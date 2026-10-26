import type { Metadata } from "next";
import Image from "next/image";
import QRCode from "qrcode";
import { card } from "@/content/card";
import CardShare from "@/components/card/CardShare";
import "./card.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "O’Town Watersports | Digital Business Card",
  description: "Connect with O’Town Watersports in Orlando. Wakeboarding, wakesurfing, foiling, and unforgettable experiences on the water.",
  alternates: { canonical: card.cardUrl },
  openGraph: {
    title: "O’Town Watersports",
    description: "See you on the water. Book your next Orlando wakeboarding or wakesurfing experience.",
    url: card.cardUrl,
    type: "website",
    images: [{ url: `${card.site}/card/og.jpg`, width: 1200, height: 630, alt: "A rider surfing the wake behind the O’Town Supra boat" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "O’Town Watersports",
    description: "See you on the water. Book your next Orlando wakeboarding or wakesurfing experience.",
    images: [`${card.site}/card/og.jpg`],
  },
};

const I = {
  cal: <path d="M5 5h14v15H5zM5 9h14M9 3v4M15 3v4" />,
  call: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" />,
  text: <path d="M4 5h16v11H9l-5 4z" />,
  ig: <><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="16.8" cy="7.2" r=".6" /></>,
  user: <><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-4 3-6 7-6s7 2 7 6" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
};
const Icon = ({ d }: { d: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{d}</svg>
);

export default async function CardPage() {
  const qrSvg = await QRCode.toString(card.cardUrl, { type: "svg", errorCorrectionLevel: "Q", margin: 4, color: { dark: "#101F27", light: "#FFFFFF" } });
  const a = card.address;
  return (
    <div className="cd-root">
      <div className="cd">
        <div className="cd-hero">
          <Image src="/card/hero.jpg" alt="A rider surfing the wake behind the O’Town Supra boat, crew cheering" width={1500} height={1000} priority sizes="(max-width: 480px) 100vw, 480px" />
        </div>
        <div className="cd-main">
          <h1 className="cd-logo">
            <Image src="/brand/otown-logo-neon.png" alt="O’Town" width={900} height={302} priority sizes="320px" />
            <span className="cd-sr"> Watersports</span>
          </h1>
          <p className="cd-word" aria-hidden>WATERSPORTS</p>
          <p className="cd-city">{card.city.toUpperCase()}</p>
          <p className="cd-disc">{card.disciplines}</p>
          <p className="cd-tag">{card.tagline}</p>

          <a className="cd-cta" href={card.bookingUrl}>
            <Icon d={I.cal} /> BOOK YOUR SESSION
          </a>

          <ul className="cd-grid">
            <li><a href={card.tel}><Icon d={I.call} /><span>Call Us</span></a></li>
            <li><a href={card.sms}><Icon d={I.text} /><span>Text Us</span></a></li>
            <li><a href={card.instagram} target="_blank" rel="noopener noreferrer"><Icon d={I.ig} /><span>Instagram</span></a></li>
            <li><a href="/card/otown-watersports.vcf" download="otown-watersports.vcf"><Icon d={I.user} /><span>Save Contact</span></a></li>
          </ul>
          <p className="cd-hint">Save Contact downloads a .vcf — tap it to add O’Town to your contacts. If it doesn’t open in this app, open this page in Safari or Chrome.</p>

          <CardShare url={card.cardUrl} title={card.share.title} text={card.share.text} qrSvg={qrSvg} />

          <address className="cd-info">
            <a href={card.maps} target="_blank" rel="noopener noreferrer" className="cd-addr">
              <Icon d={I.pin} />
              <span>{a.street}<br />{card.areaLine}</span>
            </a>
            <details>
              <summary>More ways to connect</summary>
              <ul>
                <li><a href={card.website}>{card.websiteLabel}</a></li>
                <li><a href={`mailto:${card.email}`}>{card.email}</a></li>
                <li><a href={card.instagram} target="_blank" rel="noopener noreferrer">Instagram {card.instagramHandle}</a></li>
                {card.tiktok.verified && <li><a href={card.tiktok.url} target="_blank" rel="noopener noreferrer">TikTok {card.tiktok.handle}</a></li>}
              </ul>
            </details>
          </address>
        </div>
      </div>
    </div>
  );
}
