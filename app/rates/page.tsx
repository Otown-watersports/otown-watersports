import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Accordion from "@/components/ui/Accordion";
import { contact, faqs, rates } from "@/content/site";

export const metadata: Metadata = {
  title: "Rates & Booking | O’Town Watersports Orlando",
  description: "Wakeboard and wakesurf lesson prices in Orlando: $175 for a 30 minute set, $450 for a full day with two 45 minute sessions. Camps and overnight stays tailored to you. Lake Barton, Orlando, FL.",
  alternates: { canonical: "/rates" },
};

export default function RatesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [...rates.policies, ...faqs].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />
      <section className="page-hero">
        <Image src="/images/bg-sunset-air.jpg" alt="A rider inverted high above the wake at sunset" fill priority quality={85} sizes="(orientation: portrait) 640px, 100vw" style={{ objectPosition: "28% 16%" }} />
        <div className="wrap page-hero__inner page-hero__inner--rates">
          <p className="eyebrow eyebrow--cyan">Rates</p>
          <h1 className="display display--hero">Rates &amp; booking.</h1>
          <p>{rates.note} Every session includes coaching on and off the water.</p>
        </div>
      </section>

      <div className="wrap">
        <ul className="price-grid">
          {rates.items.map((r) => (
            <li key={r.name} className={`price${r.featured ? " price--featured" : ""}`}>
              {r.featured && <span className="price__tag">Most booked</span>}
              <h2 className="price__name">{r.name}</h2>
              <p className="price__amount">{r.price}</p>
              <p className="price__unit">{r.unit}</p>
              <ul>{r.includes.map((i) => <li key={i}>{i}</li>)}</ul>
              <Link href={r.key === "stay" ? "/stay" : `/plan?activity=${r.key === "day" ? "coaching" : "first-session"}`}
                className={`btn btn--pill ${r.featured ? "btn--primary" : "btn--ink"}`}>
                {r.key === "stay" ? "See the stay" : "Request a time"}
              </Link>
            </li>
          ))}
        </ul>

        <div className="rates-body">
          <div>
            <p className="eyebrow eyebrow--dark">Booking policy</p>
            <h2 className="display display--lg display--ink">The small<br />print.</h2>
            <p className="lede" style={{ marginTop: 20 }}>Questions? Call <a href={contact.phone.href}>{contact.phone.label}</a>.</p>
            <p style={{ marginTop: 16 }}><Link className="u-link" href={contact.waiver}>Read and download the waiver</Link></p>
          </div>
          <Accordion items={rates.policies} />
        </div>

        <div className="rates-body rates-body--faq">
          <div>
            <p className="eyebrow eyebrow--dark">Good to know</p>
            <h2 className="display display--lg display--ink">Before your<br />first set.</h2>
          </div>
          <Accordion items={faqs} />
        </div>
      </div>
    </>
  );
}
