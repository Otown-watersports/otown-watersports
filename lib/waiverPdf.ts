/** Builds the signed waiver PDF in the browser (pdf-lib is loaded only when the rider submits). */
import { TRAMPOLINE_BLOCKS, TRAMPOLINE_TITLE, TRAMPOLINE_VERSION, WAIVER_PAGES, WAIVER_VERSION } from "@/content/waiverText";

export type WaiverData = {
  kind: "adult" | "minor" | "both";
  signer: { name: string; dob?: string; phone: string; email: string };
  minors: { name: string; dob: string }[];
  emergency: { name: string; phone: string };
  trampoline?: boolean;
  initials: Record<string, string>;
  signedAt: string;
  version: string;
  agree: boolean;
  esign: boolean;
};

// Standard PDF fonts only cover Western characters; keep the rest readable instead of failing.
const safe = (s: string) =>
  s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/…/g, "...")
   .replace(/[^\x20-\x7E\xA0-\xFF\u2022]/g, "?");

export async function buildWaiverPdf(d: WaiverData, signaturePng: string): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  doc.setTitle("O'Town Watersports signed waiver");
  doc.setAuthor(safe(d.signer.name));
  doc.setSubject(WAIVER_VERSION);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 612, H = 792, M = 50, LW = W - M * 2;
  const ink = rgb(0.07, 0.09, 0.11), soft = rgb(0.4, 0.43, 0.47), red = rgb(0.75, 0.1, 0.1), cyan = rgb(0.05, 0.55, 0.68);
  let page = doc.addPage([W, H]);
  let y = H - M;
  const ensure = (h: number) => { if (y - h < M + 20) { page = doc.addPage([W, H]); y = H - M; } };
  const wrap = (text: string, f = font, size = 9) => {
    const out: string[] = [];
    for (const para of safe(text).split("\n")) {
      let line = "";
      for (const word of para.split(/\s+/)) {
        const t = line ? `${line} ${word}` : word;
        if (f.widthOfTextAtSize(t, size) > LW - 14 && line) { out.push(line); line = word; } else line = t;
      }
      out.push(line);
    }
    return out;
  };
  const write = (text: string, o: { f?: typeof font; size?: number; color?: ReturnType<typeof rgb>; indent?: number; gap?: number; center?: boolean } = {}) => {
    const f = o.f ?? font, size = o.size ?? 9, lh = size * 1.32;
    for (const ln of wrap(text, f, size)) {
      ensure(lh);
      const x = o.center ? (W - f.widthOfTextAtSize(ln, size)) / 2 : M + (o.indent ?? 0);
      page.drawText(ln, { x, y: y - size, size, font: f, color: o.color ?? ink });
      y -= lh;
    }
    y -= o.gap ?? 5;
  };

  write("O'TOWN WATERSPORTS  ·  SIGNED ONLINE", { f: bold, size: 8, color: cyan, gap: 10 });
  const pages = [...(d.kind === "adult" ? [WAIVER_PAGES[0]] : WAIVER_PAGES), ...(d.trampoline ? [{ title: [TRAMPOLINE_TITLE], blocks: TRAMPOLINE_BLOCKS }] : [])];
  pages.forEach((p, pi) => {
    if (pi > 0) { page = doc.addPage([W, H]); y = H - M; }
    ensure(40);
    page.drawRectangle({ x: M, y: y - 34, width: LW, height: 34, color: rgb(0.9, 0.9, 0.9) });
    y -= 6;
    p.title.forEach((t) => write(t, { f: bold, size: 10, center: true, gap: 0 }));
    y -= 14;
    for (const b of p.blocks) {
      // statutory minor notice: capitals, 5pt larger than the 9pt body (Fla. Stat. 744.301(3)(b))
      if (b.notice) write(b.text.toUpperCase(), { f: bold, size: 14, gap: 8 });
      else if (b.t === "h") write(b.text, { f: bold, size: 9.5, gap: 4 });
      else if (b.t === "li") write(`•  ${b.text}`, { indent: 12, gap: 2 });
      else {
        write(b.text, { gap: b.initial ? 2 : 6 });
        if (b.initial) write(`INITIALED: ${d.initials[b.initial] ?? ""}`, { f: bold, size: 9, color: red, gap: 8 });
      }
    }
  });

  // Signature block
  page = doc.addPage([W, H]); y = H - M;
  write("SIGNATURE AND PARTICIPANTS", { f: bold, size: 12, gap: 10 });
  const rows: [string, string][] = [
    ["Signed by", `${d.signer.name}${d.kind === "adult" ? " (adult participant)" : d.kind === "minor" ? " (natural guardian)" : " (adult participant and natural guardian)"}`],
    ...(d.signer.dob ? [["Date of birth", d.signer.dob] as [string, string]] : []),
    ["Phone", d.signer.phone],
    ["Email", d.signer.email],
    ...d.minors.map((m, i) => [`Minor child ${i + 1}`, `${m.name}, born ${m.dob}`] as [string, string]),
    ["Emergency contact", d.emergency.name ? `${d.emergency.name}, ${d.emergency.phone}` : "not provided"],
    ["Signed on", new Date(d.signedAt).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "long", timeStyle: "short" }) + " (Eastern)"],
    ["Documents", d.trampoline ? `Water sports release + trampoline release` : "Water sports release"],
    ["Document version", d.trampoline ? `${WAIVER_VERSION}; ${TRAMPOLINE_VERSION}` : WAIVER_VERSION],
  ];
  for (const [k, v] of rows) {
    ensure(16);
    page.drawText(safe(k), { x: M, y: y - 10, size: 10, font, color: soft });
    const lines = wrap(v, bold, 10);
    lines.forEach((ln, i) => page.drawText(ln, { x: M + 130, y: y - 10 - i * 13, size: 10, font: bold, color: ink }));
    y -= 13 * lines.length + 6;
  }
  y -= 10;
  const png = await doc.embedPng(signaturePng);
  const sw = 260, sh = (png.height / png.width) * sw;
  ensure(sh + 40);
  page.drawImage(png, { x: M, y: y - sh, width: sw, height: sh });
  y -= sh + 4;
  page.drawLine({ start: { x: M, y }, end: { x: M + 300, y }, thickness: 0.8, color: ink });
  y -= 14;
  write(`Signature of ${d.kind === "adult" ? "Adult Participant" : "Natural Guardian"}: ${d.signer.name}${d.trampoline ? " (water sports release and trampoline release)" : ""}`, { size: 9, color: soft, gap: 16 });
  write("The signer confirmed: \"I have read this entire agreement, initialed each section, understand that I am giving up legal rights, and agree to be bound by it.\"", { size: 9, gap: 6 });
  write("The signer agreed to sign electronically and that this electronic signature has the same effect as a handwritten signature (Florida Uniform Electronic Transaction Act, Fla. Stat. 668.50; federal E-SIGN Act).", { size: 9, gap: 6 });
  write("O'Town Watersports records the server time, IP address, device and a SHA-256 fingerprint of this file when it is received.", { size: 8, color: soft });
  return doc.save();
}
