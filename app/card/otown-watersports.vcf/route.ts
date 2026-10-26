import { card as c } from "@/content/card";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export function GET() {
  const a = c.address;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${esc(c.nameVcard)}`,
    `N:;${esc(c.nameVcard)};;;`,
    `ORG:${esc(c.nameVcard)}`,
    `TITLE:Wakeboarding, Wakesurfing & Foiling`,
    `TEL;TYPE=WORK,VOICE:${c.phoneE164}`,
    `EMAIL;TYPE=WORK:${c.email}`,
    `URL:${c.website}`,
    `ADR;TYPE=WORK:;;${esc(a.street)};${a.city};${a.region};${a.zip};${a.country}`,
    `URL;TYPE=Instagram:${c.instagram}`,
    ...(c.tiktok.verified ? [`URL;TYPE=TikTok:${c.tiktok.url}`] : []),
    `NOTE:${esc(c.tagline)}`,
    "END:VCARD",
  ];
  return new Response(lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="otown-watersports.vcf"',
    },
  });
}
