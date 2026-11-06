import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RiderSpotlight from "@/components/riders/RiderSpotlight";
import Accordion from "@/components/ui/Accordion";
import { glen, lessonFaqs, lessonOptions, method, rates, riders } from "@/content/site";

export const metadata: Metadata = {
  title: "Wakeboard & Wakesurf Lessons in Orlando | O’Town Watersports",
  description: "Private boat wakeboard and wakesurf lessons in Orlando with Glen Fletcher. Learn on Lake Barton, from your first ride to advanced tricks. By appointment.",
  openGraph: {
    title: "Wakeboard & Wakesurf Lessons in Orlando | O’Town Watersports",
    description: "Private boat coaching with Glen Fletcher on Lake Barton, for beginners through advanced riders.",
    url: "/coaching",
    type: "website",
  },
  alternates: { canonical: "/coaching" },
};

export default function CoachingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: lessonFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }).replace(/</g, "\\u003c") }} />
      <section className="page-hero">
        <Image className="only-desk" src="/images/glen-tower.jpg" alt="Glen at the wheel under the tower, Lake Barton" fill priority quality={85} sizes="100vw" style={{ objectPosition: "86% 72%" }} />
        <Image className="only-mob" src="/images/glen-helm.jpg" alt="" fill quality={85} sizes="100vw" style={{ objectPosition: "50% 18%" }} />
        <div className="wrap page-hero__inner">
          <p className="eyebrow eyebrow--cyan">Wakeboard &amp; wakesurf lessons · Orlando</p>
          <h1 className="display display--hero">Coached by Glen.</h1>
          <p>Private boat wakeboard and wakesurf lessons on Lake Barton, Orlando. From your first ride to advanced tricks, with Glen Fletcher.</p>
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

      <section className="section" aria-labelledby="lesson-options-title">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow eyebrow--dark">Private lessons · Lake Barton</p>
            <h2 id="lesson-options-title" className="display display--lg display--ink">A session for<br />your level.</h2>
          </div>
          <ul className="method">
            {lessonOptions.map((lesson) => (
              <li key={lesson.key} className="method__item" id={lesson.key}>
                <h3 className="method__title">{lesson.title}</h3>
                <p>{lesson.body}</p>
                <p style={{ marginTop: 20 }}><Link href={`/plan?activity=${lesson.activity}`} className="u-link">Request a {lesson.key === "wakesurf" ? "wakesurf" : "wakeboard"} lesson</Link></p>
              </li>
            ))}
          </ul>
          <p className="lede" style={{ marginTop: 32 }}>Private lesson: {rates.items[0].price} ({rates.items[0].unit}). Full day: {rates.items[1].price}, including two 45 minute sessions, trampoline training and video review. <Link href="/rates" className="u-link">See rates and booking policy</Link>.</p>
        </div>
      </section>

      <section className="section" aria-labelledby="lessons-title">
        <div className="wrap">
          <div className="section-head section-head--row">
            <div>
              <p className="eyebrow eyebrow--dark">Plan your ride</p>
              <h2 id="lessons-title" className="display display--lg display--ink">Wakeboarding lessons<br />in Orlando.</h2>
            </div>
            <p className="lede lede--narrow">Learn behind the boat on Lake Barton. Explore <Link href="/rates" className="u-link">lesson prices and session lengths</Link>, or plan a <Link href="/stay" className="u-link">training stay at O’Town</Link>.</p>
          </div>
          <Accordion items={lessonFaqs} />
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
