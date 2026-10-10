import type { Metadata } from "next";
import Link from "next/link";
import WaiverDoc from "@/components/forms/WaiverDoc";
import PrintButton from "@/components/forms/PrintButton";
import WaiverSign from "@/components/forms/WaiverSign";
import { contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Waiver | O’Town Watersports Orlando",
  description: "Sign the O’Town Watersports release online in about 3 minutes: adult waiver, the limited release for minor children, and the optional trampoline release.",
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
            <p>Every rider signs the O’Town Watersports release before riding. Adults sign for themselves; for riders under 18, a parent or natural guardian signs. Using the trampoline on the dock? Tick the trampoline release in the same form.</p>
            <ol className="wv-steps">
              <li>Sign online below in about 3 minutes. Done before you arrive.</li>
              <li>You and O’Town each get the signed PDF by email.</li>
              <li>Prefer paper? Print it, initial sections A to D, sign and bring it.</li>
            </ol>
            <div className="actions">
              <a className="btn btn--primary btn--pill" href="#sign">Sign online <span aria-hidden>→</span></a>
              <a className="btn btn--outline-light btn--pill" href="/docs/otown-waiver.pdf" download="OTown-Watersports-Waiver.pdf">Download PDF <span aria-hidden>↓</span></a>
            </div>
            <p className="wv-intro__q">Questions? Call <a href={contact.phone.href}>{contact.phone.label}</a> or <Link href="/plan">plan your session</Link>.</p>
          </div>
        </div>
      </section>
      <WaiverSign />
      <section className="wv-wrap" aria-label="Waiver document">
        <details className="wv-paper">
          <summary><span className="wv-paper__t">Prefer paper?</span><span className="wv-paper__s">Read the full water sports release and the trampoline release, print them, or download the PDF.</span></summary>
          <div className="wv-paper__actions actions">
            <a className="btn btn--primary btn--pill" href="/docs/otown-waiver.pdf" download="OTown-Watersports-Waiver.pdf">Download PDF <span aria-hidden>↓</span></a>
            <PrintButton />
          </div>
          <WaiverDoc />
        </details>
      </section>
    </>
  );
}
