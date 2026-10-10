/**
 * O'Town Watersports Worker.
 * Serves the static site (./out) and handles one API route: POST /api/waiver (online waiver signing).
 *
 * The signed PDF is built in the rider's browser (no CPU limits there). This Worker:
 *  1. checks the submission (required fields, ages, initials, signature, size),
 *  2. stamps an audit record (server time, IP, device, SHA-256 of the PDF),
 *  3. saves the PDF + record to R2 (bucket "otown-waivers", auto-deleted after 3 years by a lifecycle rule),
 *  4. emails the PDF to O'Town (and a copy to the signer) through Resend.
 * A waiver counts as received only if it was stored or emailed to O'Town.
 */

export interface Env {
  ASSETS: Fetcher;
  WAIVERS?: R2Bucket;
  RESEND_API_KEY?: string;
  WAIVER_TO?: string;
  WAIVER_FROM?: string;
}

type Person = { name: string; dob?: string };
type Submission = {
  kind: "adult" | "minor" | "both";
  signer: { name: string; dob?: string; phone: string; email: string };
  minors: Person[];
  emergency: { name: string; phone: string };
  initials: Record<string, string>;
  signedAt: string;
  version: string;
  agree: boolean;
  esign: boolean;
  website?: string; // honeypot, must stay empty
};

const MAX_PDF = 3 * 1024 * 1024;
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

const age = (dob: string, on = new Date()) => {
  const d = new Date(dob + "T12:00:00Z");
  if (Number.isNaN(d.getTime())) return -1;
  let a = on.getUTCFullYear() - d.getUTCFullYear();
  const m = on.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && on.getUTCDate() < d.getUTCDate())) a--;
  return a;
};
const clean = (s: unknown, max = 120) => (typeof s === "string" ? s.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max) : "");
const slug = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "rider";
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function validate(raw: unknown): { ok: true; s: Submission } | { ok: false; error: string } {
  const r = raw as Partial<Submission>;
  if (!r || typeof r !== "object") return { ok: false, error: "Invalid form." };
  if (r.website) return { ok: false, error: "Invalid form." };
  const kind = r.kind;
  if (kind !== "adult" && kind !== "minor" && kind !== "both") return { ok: false, error: "Choose who is riding." };
  const signer = { name: clean(r.signer?.name), dob: clean(r.signer?.dob, 10), phone: clean(r.signer?.phone, 40), email: clean(r.signer?.email, 120) };
  if (signer.name.length < 3) return { ok: false, error: "Enter your full name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(signer.email)) return { ok: false, error: "Enter a valid email." };
  if (signer.phone.replace(/\D/g, "").length < 7) return { ok: false, error: "Enter a valid phone number." };
  if (kind !== "minor" && age(signer.dob || "") < 18) return { ok: false, error: "Adult riders must be 18 or older." };
  const minors = (Array.isArray(r.minors) ? r.minors : []).slice(0, 6).map((m) => ({ name: clean(m?.name), dob: clean(m?.dob, 10) }));
  if (kind !== "adult") {
    if (!minors.length) return { ok: false, error: "Add at least one child." };
    for (const m of minors) {
      const a = age(m.dob);
      if (m.name.length < 2 || a < 0 || a >= 18) return { ok: false, error: "Each child needs a name and a date of birth under 18." };
    }
  }
  const emergency = { name: clean(r.emergency?.name), phone: clean(r.emergency?.phone, 40) };
  if (emergency.name.length < 2 || emergency.phone.replace(/\D/g, "").length < 7) return { ok: false, error: "Add an emergency contact." };
  const need = kind === "adult" ? ["A", "B", "C", "D"] : ["A", "B", "C", "D", "M"];
  const initials: Record<string, string> = {};
  for (const k of need) {
    const v = clean(r.initials?.[k], 5).toUpperCase();
    if (!/^[A-Z.\- ]{1,5}$/.test(v)) return { ok: false, error: `Initial section ${k === "M" ? "for minors" : k}.` };
    initials[k] = v;
  }
  if (r.agree !== true || r.esign !== true) return { ok: false, error: "Tick both boxes to sign." };
  return { ok: true, s: { kind, signer, minors: kind === "adult" ? [] : minors, emergency, initials, signedAt: clean(r.signedAt, 40), version: clean(r.version, 80), agree: true, esign: true } };
}

async function sha256(buf: ArrayBuffer) {
  const h = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function toBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

async function sendEmail(env: Env, to: string, subject: string, html: string, filename: string, pdfB64: string, replyTo?: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.WAIVER_FROM || "O'Town Watersports <waivers@otownwatersports.com>",
      to: [to],
      reply_to: replyTo,
      subject,
      html,
      attachments: [{ filename, content: pdfB64 }],
    }),
  });
  return res.ok;
}

async function handleWaiver(req: Request, env: Env): Promise<Response> {
  // The form goes live once email is connected (storage alone would leave O'Town without a notification)
  if (req.method === "GET") return json({ ready: Boolean(env.RESEND_API_KEY) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!env.RESEND_API_KEY) return json({ error: "Online signing isn't switched on yet. Please download and print the waiver." }, 503);

  let form: FormData;
  try { form = await req.formData(); } catch { return json({ error: "Invalid form." }, 400); }
  const pdf = form.get("pdf") as unknown;
  let data: unknown;
  try { data = JSON.parse(String(form.get("data") || "")); } catch { return json({ error: "Invalid form." }, 400); }
  const v = validate(data);
  if (!v.ok) return json({ error: v.error }, 400);
  if (!(pdf instanceof Blob) || pdf.size < 1000 || pdf.size > MAX_PDF) return json({ error: "The signed document is missing. Please try again." }, 400);
  const pdfBuf = await pdf.arrayBuffer();
  if (new TextDecoder().decode(pdfBuf.slice(0, 5)) !== "%PDF-") return json({ error: "Invalid document." }, 400);

  const s = v.s;
  const now = new Date();
  const id = crypto.randomUUID().slice(0, 8);
  const hash = await sha256(pdfBuf);
  const who = s.kind === "adult" ? s.signer.name : `${s.minors.map((m) => m.name).join(", ")} (guardian ${s.signer.name})`;
  const audit = {
    id,
    receivedAt: now.toISOString(),
    ip: req.headers.get("cf-connecting-ip") || "",
    country: req.headers.get("cf-ipcountry") || "",
    userAgent: (req.headers.get("user-agent") || "").slice(0, 300),
    pdfSha256: hash,
    ...s,
  };
  const day = now.toISOString().slice(0, 10);
  const base = `waivers/${day.slice(0, 4)}/${day.slice(5, 7)}/${day}_${slug(s.signer.name)}_${id}`;
  const filename = `OTown-Waiver_${day}_${slug(s.signer.name)}.pdf`;

  let stored = false, emailed = false;
  if (env.WAIVERS) {
    try {
      await env.WAIVERS.put(`${base}.pdf`, pdfBuf, { httpMetadata: { contentType: "application/pdf" }, customMetadata: { name: s.signer.name, kind: s.kind, sha256: hash } });
      await env.WAIVERS.put(`${base}.json`, JSON.stringify(audit, null, 2), { httpMetadata: { contentType: "application/json" } });
      stored = true;
    } catch { /* fall through to email */ }
  }
  if (env.RESEND_API_KEY) {
    const b64 = toBase64(pdfBuf);
    const rows: [string, string][] = [
      ["Rider(s)", who],
      ["Type", s.kind === "adult" ? "Adult (18+)" : s.kind === "minor" ? "Minor(s), signed by guardian" : "Adult + minor(s)"],
      ["Signer", `${s.signer.name}${s.signer.dob ? ` · born ${s.signer.dob}` : ""}`],
      ["Phone", s.signer.phone],
      ["Email", s.signer.email],
      ...s.minors.map((m, i) => [`Child ${i + 1}`, `${m.name} · born ${m.dob}`] as [string, string]),
      ["Emergency contact", `${s.emergency.name} · ${s.emergency.phone}`],
      ["Signed (server time)", now.toLocaleString("en-US", { timeZone: "America/New_York" }) + " ET"],
      ["IP / device", `${audit.ip} ${audit.country} · ${audit.userAgent.slice(0, 90)}`],
      ["Document SHA-256", hash],
      ["Waiver ID", id],
    ];
    const table = `<table cellpadding="6" style="border-collapse:collapse;font:14px/1.4 Arial,sans-serif">${rows.map(([k, val]) => `<tr><td style="color:#667;vertical-align:top">${esc(k)}</td><td><b>${esc(val)}</b></td></tr>`).join("")}</table>`;
    emailed = await sendEmail(env, env.WAIVER_TO || "info@otownwatersports.com", `Signed waiver: ${who}`,
      `<p style="font:15px Arial,sans-serif">A new waiver was signed online. The signed PDF is attached${stored ? " and saved in Cloudflare" : ""}.</p>${table}`,
      filename, b64, s.signer.email).catch(() => false);
    await sendEmail(env, s.signer.email, "Your signed O'Town Watersports waiver",
      `<p style="font:15px/1.5 Arial,sans-serif">Thanks, ${esc(s.signer.name.split(" ")[0])}. Your signed waiver is attached for your records. See you on the water.<br><br>O'Town Watersports · Lake Barton, Orlando</p>`,
      filename, b64).catch(() => false);
  }
  if (!stored && !emailed) return json({ error: "We couldn't save your waiver. Please try again, or download and print it." }, 502);
  return json({ ok: true, id, filename });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/api/waiver") return handleWaiver(req, env);
    return env.ASSETS.fetch(req);
  },
} satisfies ExportedHandler<Env>;
