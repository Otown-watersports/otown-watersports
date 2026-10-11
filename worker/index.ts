/**
 * O'Town Watersports Worker.
 * Serves the static site (./out) and handles: POST /api/waiver (online waiver signing) and POST /api/inquiry (plan-your-session form).
 *
 * The signed PDF is built in the rider's browser (no CPU limits there). This Worker:
 *  1. checks the submission (required fields, ages, initials, signature, size),
 *  2. stamps an audit record (server time, IP, device, SHA-256 of the PDF),
 *  3. saves the PDF + record to R2 (bucket "otown-waivers", auto-deleted after 3 years by a lifecycle rule),
 *  4. saves it to the owner's Google Drive and emails it to O'Town (and a copy to the signer) from the
 *     connected Gmail account (see google.ts). Resend is supported as an alternative sender.
 * A waiver counts as received only if it was stored or emailed to O'Town.
 */

import { cleanupDrive, driveUpload, getConfig, gmailSend, handleGoogle, type GoogleEnv } from "./google";

export interface Env extends GoogleEnv {
  ASSETS: Fetcher;
  WAIVERS?: R2Bucket;
  RESEND_API_KEY?: string; // optional fallback sender
  WAIVER_TO?: string; // defaults to the connected Google account
  WAIVER_FROM?: string;
}

type Person = { name: string; dob: string };
type Submission = {
  kind: "adult" | "minor" | "both";
  signer: { name: string; dob?: string; phone: string; email: string };
  minors: Person[];
  emergency: { name: string; phone: string };
  trampoline: boolean;
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
/** "ANNAMARIIA kushkovskaia" -> "Annamariia Kushkovskaia" (keeps O'Neil, Smith-Jones). */
const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s'\-])([a-z\u00e0-\u00ff])/g, (m) => m.toUpperCase());
/** Formats US numbers as (407) 555-1212; leaves others as typed. */
const prettyPhone = (p: string) => { const d = p.replace(/\D/g, ""); return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d.length === 11 && d[0] === "1" ? `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}` : p; };
const clean = (s: unknown, max = 120) => (typeof s === "string" ? s.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max) : "");
const slug = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "rider";
/** Simple, mobile-friendly email frame in the site's colours. */
const layout = (title: string, body: string) => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head><body style="margin:0;background:#eef0f2;padding:16px 8px">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;font:15px/1.55 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1d2328">
<tr><td style="background:#0b1116;padding:18px 22px;border-radius:14px 14px 0 0"><span style="font-size:20px;font-weight:800;letter-spacing:.02em;color:#22c7e8">O'TOWN</span> <span style="font-size:11px;letter-spacing:.2em;color:#f4f2ee;text-transform:uppercase">Watersports</span></td></tr>
<tr><td style="padding:22px"><h1 style="margin:0 0 14px;font-size:21px;line-height:1.25;word-break:break-word">${title}</h1>${body}</td></tr>
<tr><td style="padding:14px 22px;background:#f4f2ee;font-size:12px;line-height:1.5;color:#667;border-radius:0 0 14px 14px">O'Town Watersports · 5220 E Colonial Dr, Orlando, FL 32807<br><a href="https://otownwatersports.com" style="color:#667">otownwatersports.com</a></td></tr>
</table></body></html>`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function validate(raw: unknown): { ok: true; s: Submission } | { ok: false; error: string } {
  const r = raw as Partial<Submission>;
  if (!r || typeof r !== "object") return { ok: false, error: "Invalid form." };
  if (r.website) return { ok: false, error: "Invalid form." };
  const kind = r.kind;
  if (kind !== "adult" && kind !== "minor" && kind !== "both") return { ok: false, error: "Choose who is riding." };
  const signer = { name: titleCase(clean(r.signer?.name)), dob: clean(r.signer?.dob, 10), phone: clean(r.signer?.phone, 40), email: clean(r.signer?.email, 120).toLowerCase() };
  if (signer.name.length < 3) return { ok: false, error: "Enter your full name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(signer.email)) return { ok: false, error: "Enter a valid email." };
  if (signer.phone.replace(/\D/g, "").length < 7) return { ok: false, error: "Enter a valid phone number." };
  if (kind !== "minor" && age(signer.dob || "") < 18) return { ok: false, error: "Adult riders must be 18 or older." };
  const minors = (Array.isArray(r.minors) ? r.minors : []).slice(0, 6).map((m) => ({ name: titleCase(clean(m?.name)), dob: clean(m?.dob, 10) }));
  if (kind !== "adult") {
    if (!minors.length) return { ok: false, error: "Add at least one child." };
    for (const m of minors) {
      const a = age(m.dob);
      if (m.name.length < 2 || a < 0 || a >= 18) return { ok: false, error: "Each child needs a name and a date of birth under 18." };
    }
  }
  const emergency = { name: titleCase(clean(r.emergency?.name)), phone: clean(r.emergency?.phone, 40) };
  if ((emergency.name || emergency.phone) && (emergency.name.length < 2 || emergency.phone.replace(/\D/g, "").length < 7)) return { ok: false, error: "Emergency contact needs both a name and a phone number." };
  const trampoline = r.trampoline === true;
  const need = [...(kind === "adult" ? ["A", "B", "C", "D"] : ["A", "B", "C", "D", "M"]), ...(trampoline ? ["T"] : [])];
  const initials: Record<string, string> = {};
  for (const k of need) {
    const v = clean(r.initials?.[k], 5).toUpperCase();
    if (!/^[A-Z.\- ]{1,5}$/.test(v)) return { ok: false, error: `Initial ${k === "M" ? "the minor section" : k === "T" ? "the trampoline release" : `section ${k}`}.` };
    initials[k] = v;
  }
  if (r.agree !== true || r.esign !== true) return { ok: false, error: "Tick both boxes to sign." };
  return { ok: true, s: { kind, signer, minors: kind === "adult" ? [] : minors, emergency, trampoline, initials, signedAt: clean(r.signedAt, 40), version: clean(r.version, 80), agree: true, esign: true } };
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

async function sendEmail(env: Env, to: string, subject: string, html: string, filename?: string, pdfB64?: string, replyTo?: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.WAIVER_FROM || "O'Town Watersports <waivers@otownwatersports.com>",
      to: [to],
      reply_to: replyTo,
      subject,
      html,
      ...(filename && pdfB64 ? { attachments: [{ filename, content: pdfB64 }] } : {}),
    }),
  });
  return res.ok;
}

async function handleWaiver(req: Request, env: Env): Promise<Response> {
  const google = env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? await getConfig(env) : null;
  // The form goes live once email is connected (storage alone would leave O'Town without a notification)
  if (req.method === "GET") return json({ ready: Boolean(google || env.RESEND_API_KEY) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!google && !env.RESEND_API_KEY) return json({ error: "Online signing isn't switched on yet. Please download and print the waiver." }, 503);

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
  const who = s.kind === "adult" ? s.signer.name : s.minors.map((m) => m.name).join(", ");
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
  // File name sorts by rider surname, then date: "Kushkovskaia, Anna - 2026-10-10 - Waiver.pdf"
  const parts = s.signer.name.split(" ");
  const byName = parts.length > 1 ? `${parts[parts.length - 1]}, ${parts.slice(0, -1).join(" ")}` : s.signer.name;
  const riderPart = s.kind === "adult" ? byName : `${byName} (guardian of ${s.minors.map((m) => m.name.split(" ")[0]).join(", ")})`;
  const docPart = s.trampoline ? "Waiver + Trampoline" : "Waiver";
  const filename = `${riderPart} - ${day} - ${docPart}.pdf`.replace(/[\\/:*?"<>|]/g, "");
  const base = `waivers/${day.slice(0, 4)}/${day}_${slug(s.signer.name)}_${id}`;

  let stored = false, emailed = false, drive = false;
  if (env.WAIVERS) {
    try {
      await env.WAIVERS.put(`${base}.pdf`, pdfBuf, { httpMetadata: { contentType: "application/pdf" }, customMetadata: { name: s.signer.name, kind: s.kind, sha256: hash } });
      await env.WAIVERS.put(`${base}.json`, JSON.stringify(audit, null, 2), { httpMetadata: { contentType: "application/json" } });
      stored = true;
    } catch { /* fall through to email */ }
  }
  const b64 = toBase64(pdfBuf);
  // owner copy goes to WAIVER_TO, else to the address in WAIVER_FROM, else to the connected account
  const owner = env.WAIVER_TO || env.WAIVER_FROM?.match(/<([^>]+)>/)?.[1] || env.WAIVER_FROM || google?.email || "info@otownwatersports.com";
  if (google) {
    drive = await driveUpload(env, google, filename, pdfBuf, `${who} · signed ${now.toISOString()} · SHA-256 ${hash}`).catch(() => false);
  }
  if (google || env.RESEND_API_KEY) {
    const fmtDob = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
    const ageOf = (d: string) => age(d, now);
    const device = /iPhone/.test(audit.userAgent) ? "iPhone" : /iPad/.test(audit.userAgent) ? "iPad" : /Android/.test(audit.userAgent) ? "Android phone" : /Macintosh/.test(audit.userAgent) ? "Mac" : /Windows/.test(audit.userAgent) ? "Windows PC" : "web browser";
    const rows: [string, string][] = [
      ...(s.kind === "adult"
        ? [["Rider", `${s.signer.name}, ${ageOf(s.signer.dob ?? "")} (born ${fmtDob(s.signer.dob ?? "")})`] as [string, string]]
        : [
            ...s.minors.map((m, i) => [`Rider${s.minors.length > 1 ? ` ${i + 1}` : ""}`, `${m.name}, ${ageOf(m.dob ?? "")} (born ${fmtDob(m.dob ?? "")})`] as [string, string]),
            ...(s.kind === "both" ? [["Also riding", `${s.signer.name}, ${ageOf(s.signer.dob ?? "")} (born ${fmtDob(s.signer.dob ?? "")})`] as [string, string]] : []),
            ["Signed by", `${s.signer.name} (parent / guardian)`] as [string, string],
          ]),
      ["Phone", prettyPhone(s.signer.phone)],
      ["Email", s.signer.email],
      ["Emergency contact", s.emergency.name ? `${s.emergency.name}, ${prettyPhone(s.emergency.phone)}` : "not provided"],
      ["Documents", s.trampoline ? "Water sports release + trampoline release (5 years)" : "Water sports release"],
      ["Signed", `${now.toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" })} ET, from ${device}`],
    ];
    const table = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;font-size:14px">${rows.map(([k, val], i) => `<tr><td style="padding:8px 10px;color:#667;background:${i % 2 ? "#fff" : "#f4f2ee"};vertical-align:top;width:34%">${esc(k)}</td><td style="padding:8px 10px;background:${i % 2 ? "#fff" : "#f4f2ee"};word-break:break-word"><b>${esc(val)}</b></td></tr>`).join("")}</table>
      <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#889;word-break:break-word">Record ${id} · from ${esc(audit.ip)} (${esc(audit.country)}) · file ${hash.slice(0, 12)}…<br>Full details are stored with the PDF.</p>`;
    const saved = [stored && "Cloudflare", drive && "Google Drive"].filter(Boolean).join(" and ");
    const signedOn = now.toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "long", timeStyle: "short" });
    const ownerHtml = layout(`${who} signed the waiver`, `
      <p style="margin:0 0 16px">Signed online just now. The PDF is attached${saved ? ` and filed in ${esc(saved)}` : ""}.</p>${table}`);
    const first = esc(s.signer.name.split(" ")[0]);
    const riders = s.kind === "adult" ? "you" : s.minors.length === 1 ? esc(s.minors[0].name) : `${s.minors.map((m) => esc(m.name)).join(", ")}`;
    const riderHtml = layout(`You're all set, ${first}!`, `
      <p style="margin:0 0 14px">Thanks for signing the O'Town Watersports waiver${s.kind === "adult" ? "" : ` for ${riders}`}. Your signed copy is attached to this email. Keep it for your records; no need to print anything.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:18px 0;border-collapse:collapse">
        <tr><td style="padding:10px 14px;background:#f4f2ee;border-radius:8px 8px 0 0;font-size:13px;color:#667">Signed</td><td style="padding:10px 14px;background:#f4f2ee;border-radius:8px 8px 0 0;font-size:14px"><b>${esc(signedOn)} (Eastern)</b></td></tr>
        <tr><td style="padding:10px 14px;background:#f4f2ee;font-size:13px;color:#667">Rider${s.minors.length > 1 ? "s" : ""}</td><td style="padding:10px 14px;background:#f4f2ee;font-size:14px"><b>${s.kind === "adult" ? esc(s.signer.name) : riders}</b></td></tr>
        <tr><td style="padding:10px 14px;background:#f4f2ee;border-radius:0 0 8px 8px;font-size:13px;color:#667">Reference</td><td style="padding:10px 14px;background:#f4f2ee;border-radius:0 0 8px 8px;font-size:14px"><b>${id}</b></td></tr>
      </table>
      <p style="margin:0 0 14px"><b>Before your session</b></p>
      <ul style="margin:0 0 18px;padding-left:20px;line-height:1.7">
        <li>Be on the dock with your equipment on at your start time. Lessons run rain or shine.</li>
        <li>Lake Barton, Orlando: directions and parking are on <a href="https://otownwatersports.com/plan#visit" style="color:#0b7a95">otownwatersports.com/plan</a>.</li>
        <li>Questions or need to reschedule? Call <a href="tel:+14075297727" style="color:#0b7a95">407 529 7727</a>.</li>
      </ul>
      <p style="margin:0">See you on the water!<br><b>Glen &amp; the O'Town Watersports team</b></p>`);
    const send = (to: string, subject: string, html: string, replyTo?: string) =>
      google
        ? gmailSend(env, google, { to, replyTo, subject, html, filename, pdfB64: b64, from: env.WAIVER_FROM })
        : sendEmail(env, to, subject, html, filename, b64, replyTo);
    const shortDate = now.toLocaleDateString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric" });
    emailed = await send(owner, `[Waiver] ${who}${s.trampoline ? " +trampoline" : ""} · ${shortDate}`, ownerHtml, s.signer.email).catch(() => false);
    await send(s.signer.email, "Your signed O'Town Watersports waiver", riderHtml).catch(() => false);
  }
  if (!stored && !emailed && !drive) return json({ error: "We couldn't save your waiver. Please try again, or download and print it." }, 502);
  return json({ ok: true, id, filename });
}

const ACTIVITIES: Record<string, string> = { "first-session": "First session", coaching: "Coaching", wakesurf: "Wakesurf", "training-stay": "Training stay", other: "Group / other" };
const LEVELS = ["Never ridden", "Beginner", "Intermediate", "Advanced", "Pro"];

/** POST /api/inquiry: the "Plan your session" form. Emails O'Town (reply-to = the visitor) so it never depends on the visitor's mail app. */
async function handleInquiry(req: Request, env: Env): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const google = env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? await getConfig(env) : null;
  if (!google && !env.RESEND_API_KEY) return json({ error: "unavailable" }, 503);
  let r: Record<string, unknown>;
  try { r = (await req.json()) as Record<string, unknown>; } catch { return json({ error: "Invalid form." }, 400); }
  if (r.website) return json({ ok: true }); // honeypot: bots see success, nothing is sent
  const name = titleCase(clean(r.name, 80));
  const email = clean(r.email, 120).toLowerCase();
  const dates = clean(r.dates, 160);
  const phoneRaw = clean(r.phone, 30);
  const phoneDigits = phoneRaw.replace(/\D/g, "");
  if (phoneRaw && (phoneDigits.length < 7 || phoneDigits.length > 15)) return json({ error: "That phone number doesn't look right. Leave it blank or check the digits." }, 400);
  const message = typeof r.message === "string" ? r.message.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, " ").trim().slice(0, 2000) : "";
  const activity = ACTIVITIES[clean(r.activity, 30)] ?? "First session";
  const level = LEVELS.includes(clean(r.level, 20)) ? clean(r.level, 20) : "Beginner";
  if (name.length < 2 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(email) || dates.length < 2) return json({ error: "Please add your name, a valid email and your preferred dates." }, 400);
  const urlish = (message.match(/https?:\/\//gi) ?? []).length;
  if (urlish > 2) return json({ ok: true }); // link-stuffed message: almost certainly spam
  const tel = phoneDigits.length === 10 ? `+1${phoneDigits}` : phoneRaw.startsWith("+") ? `+${phoneDigits}` : phoneDigits.length === 11 && phoneDigits[0] === "1" ? `+${phoneDigits}` : phoneDigits;
  const rows: [string, string, string?][] = [
    ["Name", name], ["Email", email],
    ...(phoneRaw ? [["Phone", prettyPhone(phoneRaw), `<a href="tel:${esc(tel)}" style="color:#0b7a95;text-decoration:none">${esc(prettyPhone(phoneRaw))}</a>`] as [string, string, string]] : []),
    ["Interested in", activity], ["Riding level", level], ["Preferred dates", dates],
  ];
  const table = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;font-size:14px">${rows.map(([k, v, raw], i) => `<tr><td style="padding:8px 10px;color:#667;background:${i % 2 ? "#fff" : "#f4f2ee"};vertical-align:top;width:34%">${esc(k)}</td><td style="padding:8px 10px;background:${i % 2 ? "#fff" : "#f4f2ee"};word-break:break-word"><b>${raw ?? esc(v)}</b></td></tr>`).join("")}</table>`;
  const note = message ? `<p style="margin:18px 0 6px;color:#667;font-size:13px">What they'd like to work on</p><p style="margin:0;white-space:pre-wrap;word-break:break-word">${esc(message)}</p>` : "";
  const html = layout(`${esc(name)} wants to plan a session`, `<p style="margin:0 0 16px">New inquiry from the website. Just hit <b>Reply</b> to answer ${esc(name.split(" ")[0])} directly${phoneRaw ? " or tap the phone number to call" : ""}.</p>${table}${note}`);
  const owner = env.WAIVER_TO || env.WAIVER_FROM?.match(/<([^>]+)>/)?.[1] || env.WAIVER_FROM || google?.email || "info@otownwatersports.com";
  const subject = `[Inquiry] ${name} · ${activity} · ${dates.slice(0, 40)}`;
  const ok = google
    ? await gmailSend(env, google, { to: owner, replyTo: email, subject, html, from: env.WAIVER_FROM, tag: "X-OTown-Inquiry: new" }).catch(() => false)
    : await sendEmail(env, owner, subject, html, undefined, undefined, email).catch(() => false);
  return ok ? json({ ok: true }) : json({ error: "unavailable" }, 502);
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/api/waiver") return handleWaiver(req, env);
    if (url.pathname === "/api/inquiry") return handleInquiry(req, env);
    if (url.pathname.startsWith("/api/google/")) return handleGoogle(req, env);
    return env.ASSETS.fetch(req);
  },
  // monthly: remove Drive copies older than 3 years
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(cleanupDrive(env));
  },
} satisfies ExportedHandler<Env>;
