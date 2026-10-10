import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RiderSpotlight from "@/components/riders/RiderSpotlight";
import { glen, method, riders } from "@/content/site";

export const metadata: Metadata = {
  title: "Wakeboard Coaching with Glen Fletcher | O’Town Watersports Orlando",
  description: "One-to-one wakeboard and wakesurf coaching with Glen Fletcher on Lake Barton, Orlando: on the water, on the trampoline and in video review.",
  alternates: { canonical: "/coaching" },
};

export default function CoachingPage() {
  return (
    <>
      <section className="page-hero">
        <Image className="only-desk" src="/images/glen-tower.jpg" alt="Glen at the wheel under the tower, Lake Barton" fill priority quality={85} sizes="100vw" style={{ objectPosition: "86% 72%" }} />
        <Image className="only-mob" src="/images/glen-helm.jpg" alt="" fill quality={85} sizes="100vw" style={{ objectPosition: "50% 18%" }} />
        <div className="wrap page-hero__inner">
          <p className="eyebrow eyebrow--cyan">Coaching</p>
          <h1 className="display display--hero">Coached by Glen.</h1>
          <p>Twenty-plus years behind the boat, with first-timers, juniors and world champions.</p>
        </div>
      </section>

      <section className="glen" aria-labelledby="glen-title">
        <div className="glen__copy wrap-left">
          <p className="eyebrow eyebrow--dark">{glen.role}</p>
          <h2 id="glen-title" className="display display--name display--ink">Glen<br />Fletcher</h2>
          <ul className="dash-list dash-list--ink">
            {glen.points.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <p className="glen__aside">{glen.aside}</p>
          <div className="actions">
            <Link href="/plan?activity=coaching" className="btn btn--ink btn--pill btn--lg">Ride with Glen</Link>
            <Link href="/rates" className="u-link">Lesson rates</Link>
          </div>
        </div>
        <div className="glen__media">
          <Image className="only-desk" src="/images/glen-helm.jpg" alt="Glen Fletcher at the helm, handle in hand" fill quality={85} sizes="(max-width: 900px) 100vw, 55vw" />
          <Image className="only-mob" src="/images/glen-driving.jpg" alt="Glen Fletcher driving the boat" fill quality={85} sizes="100vw" style={{ objectPosition: "40% 62%" }} />
          <figure className="glen__inset">
            <Image src="/images/dock-guitar.jpg" alt="An acoustic guitar on the O’Town dock at sunrise" fill quality={85} sizes="280px" />
            <figcaption>The dock, most mornings.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section" aria-labelledby="method-title">
        <div className="wrap">
          <div className="section-head section-head--row">
            <div>
              <p className="eyebrow eyebrow--dark">How a session works</p>
              <h2 id="method-title" className="display display--lg display--ink">On the water.<br />Off the water.</h2>
            </div>
            <p className="lede lede--narrow">Every session is one-to-one and by appointment, built around your level and the next thing you want to learn.</p>
          </div>
          <ol className="method">
            {method.map((m) => (
              <li key={m.n} className="method__item">
                <div className="method__media"><Image src={m.image} alt={m.alt} fill quality={85} sizes="(max-width: 960px) 100vw, 33vw" style={{ objectPosition: m.position }} /></div>
                <p className="method__n">{m.n}</p>
                <h3 className="method__title">{m.title}</h3>
                <p>{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <RiderSpotlight />

      <section className="roster" id="roster" aria-labelledby="roster-title">
        <div className="wrap roster__grid">
          <div>
            <p className="eyebrow eyebrow--cyan">The list</p>
            <h2 id="roster-title" className="display display--lg">Riders Glen<br />has worked with.</h2>
            <p className="roster__foot">The O’Town rider roster: world champions, X Games medalists and the next generation of junior pros.</p>
            <p style={{ marginTop: 28 }}><Link href="/athletes" className="btn btn--primary btn--pill">Meet the athletes</Link></p>
          </div>
          <div>
            <h3>Pro riders</h3>
            <ul className="name-grid">{riders.filter((r) => !r.title.startsWith("Junior")).map((r) => <li key={r.key}><Link href={`/athletes/${r.key}`}>{r.name}</Link></li>)}</ul>
            <h3>Junior pros</h3>
            <ul className="name-grid">{riders.filter((r) => r.title.startsWith("Junior")).map((r) => <li key={r.key}><Link href={`/athletes/${r.key}`}>{r.name}</Link></li>)}</ul>
          </div>
        </div>
      </section>

      <section className="cta-band cta-band--short" aria-labelledby="cta-title">
        <Image src="/images/hero-bec-invert.jpg" alt="" fill sizes="(orientation: portrait) 640px, 100vw" quality={85} style={{ objectPosition: "52% 28%" }} />
        <div className="wrap cta-band__inner">
          <h2 id="cta-title" className="display display--xl">Your turn.</h2>
          <div className="actions">
            <Link href="/plan?activity=coaching" className="btn btn--primary btn--pill btn--lg">Plan your session</Link>
          </div>
        </div>
      </section>
    </>
  );
}
