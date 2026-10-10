import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { riders } from "@/content/site";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://otownwatersports.com";

export const metadata: Metadata = {
  title: "O’Town Riders: Meagan Ethell, Rusty Malinoski, Jamie Huser, Camden Marsden & more",
  description: "The O’Town Watersports rider roster in Orlando: world champions Meagan Ethell, Rusty Malinoski, Steel Lafferty, Zoey Carroll and Jamie Huser, plus Camden Marsden, Rex Abbott, Stella Tracy and the next generation of junior pros, coached by Glen Fletcher.",
  alternates: { canonical: "/athletes" },
};

const IG = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" /></svg>
);

export default function AthletesPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "O’Town Watersports riders",
    itemListElement: riders.map((r, n) => ({
      "@type": "ListItem",
      position: n + 1,
      item: {
        "@type": "Person",
        name: r.name,
        url: `${SITE}/athletes#${r.key}`,
        jobTitle: r.title,
        nationality: r.country,
        description: r.points.join(" "),
        ...(r.photo ? { image: `${SITE}${r.photo}` } : {}),
        ...(r.instagram ? { sameAs: [`https://www.instagram.com/${r.instagram}/`] } : {}),
        affiliation: { "@type": "SportsOrganization", name: "O’Town Watersports", url: SITE },
      },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="ath-hero" aria-labelledby="ath-title">
        <div className="wrap">
          <p className="eyebrow eyebrow--cyan">Athletes</p>
          <h1 id="ath-title" className="display display--hero">The O’Town<br /><span className="ath-hero__neon">riders.</span></h1>
          <p className="ath-hero__lede">World champions, X Games medalists and the next generation of junior pros, coached by Glen Fletcher on Lake Barton, Orlando.</p>
        </div>
      </section>

      <section className="ath" aria-label="All riders">
        <div className="wrap">
          <ul className="ath-grid">
            {riders.map((a, n) => {
              const [first, ...rest] = a.name.split(" ");
              return (
                <li key={a.key} id={a.key} className="ath-card">
                  <Link href={`/athletes/${a.key}`} className={`ath-card__media${a.photo ? "" : " ath-card__media--type"}`} aria-label={a.name}>
                    {a.photo ? (
                      <Image src={a.cardPhoto ?? a.photo} alt={a.photoAlt ?? `${a.name} riding`} fill quality={82} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                        style={{ objectPosition: a.cardPhoto ? "50% 50%" : a.photoPosition ?? "50% 50%" }} />
                    ) : (
                      <span className="ath-card__initials" aria-hidden>{first[0]}{rest.length ? rest[rest.length - 1][0] : ""}</span>
                    )}
                  </Link>
                  <div className="ath-card__meta"><span>{a.country}</span></div>
                  <h2 className="ath-card__name"><Link href={`/athletes/${a.key}`}>{a.name}</Link></h2>
                  <p className="ath-card__title">{a.title}</p>
                  <ul className="ath-card__points">{a.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  {a.instagram && (
                    <a className="ath-card__ig" href={`https://www.instagram.com/${a.instagram}/`} target="_blank" rel="noreferrer">
                      <IG /> @{a.instagram}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="cta-band cta-band--short" aria-labelledby="cta-title">
        <Image src="/images/bg-sunset-air.jpg" alt="" fill sizes="(orientation: portrait) 640px, 100vw" quality={85} style={{ objectPosition: "28% 14%" }} />
        <div className="wrap cta-band__inner">
          <h2 id="cta-title" className="display display--xl">Next on the list?</h2>
          <div className="actions">
            <Link href="/plan?activity=coaching" className="btn btn--primary btn--pill btn--lg">Train with Glen</Link>
            <Link href="/coaching" className="u-link u-link--light">How coaching works</Link>
          </div>
        </div>
      </section>
    </>
  );
}
