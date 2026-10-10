import type { Metadata } from "next";
import Link from "next/link";
import WaiverDoc from "@/components/forms/WaiverDoc";
import PrintButton from "@/components/forms/PrintButton";
import { contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Waiver | O’Town Watersports Orlando",
  description: "The O’Town Watersports release from liability: adult waiver and the limited release for minor children. Read online, download the PDF or print.",
  alternates: { canonical: "/waiver" },
};

export default function WaiverPage() {
  return (
    <>
      <section className="wv-intro">
        <div className="wrap wv-intro__grid">
          <div>
            <p className="eyebrow eyebrow--cyan">Before you ride</p>
            <h1 className="display display--lg">The waiver.</h1>
          </div>
          <div className="wv-intro__side">
            <p>Every rider signs the O’Town Watersports release. Adults sign page 1. For riders under 18, a parent or natural guardian also signs page 2 before arriving.</p>
            <ol className="wv-steps">
              <li>Download or print both pages.</li>
              <li>Initial sections A to D and sign.</li>
              <li>Bring it with you on the day.</li>
            </ol>
            <div className="actions">
              <a className="btn btn--primary btn--pill" href="/docs/otown-waiver.pdf" download="OTown-Watersports-Waiver.pdf">Download PDF <span aria-hidden>↓</span></a>
              <PrintButton />
            </div>
            <p className="wv-intro__q">Questions? Call <a href={contact.phone.href}>{contact.phone.label}</a> or <Link href="/plan">plan your session</Link>.</p>
          </div>
        </div>
      </section>
      <section className="wv-wrap" aria-label="Waiver document">
        <WaiverDoc />
      </section>
    </>
  );
}
