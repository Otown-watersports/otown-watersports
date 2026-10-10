import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { riders } from "@/content/site";
import { riderBios } from "@/content/riderBios";
import { riderResults } from "@/content/riderResults";
import RiderCarousel from "@/components/riders/RiderCarousel";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://otownwatersports.com";

export function generateStaticParams() {
  return riders.map((r) => ({ slug: r.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = riders.find((x) => x.key === slug);
  if (!r) return {};
  const bio = riderBios[r.key]?.bio.join(" ");
  const desc = bio ?? `${r.name}, ${r.title.toLowerCase()} from ${r.country}. ${r.points.join(" ")}`;
  return {
    title: `${r.name} | ${r.title} | O’Town Watersports Orlando`,
    description: desc.slice(0, 300),
    alternates: { canonical: `/athletes/${r.key}` },
    openGraph: { title: `${r.name} · O’Town Watersports`, description: desc.slice(0, 200), ...(r.photo ? { images: [{ url: r.photo }] } : {}) },
  };
}

export default async function RiderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = riders.findIndex((x) => x.key === slug);
  if (i < 0) notFound();
  const r = riders[i];
  const next = riders[(i + 1) % riders.length];
  const [first, ...rest] = r.name.split(" ");
  const b = riderBios[r.key];
  const yr = (y: string) => Number(y.match(/\d{4}/g)?.pop() ?? 0);
  const results = [...(riderResults[r.key] ?? [])].sort((a, b) => yr(b.year) - yr(a.year));
  const pool = riders.filter((x) => x.key !== r.key && x.photo);
  // Everyone else with a photo, starting after this rider (wraps round), so each page shows a different run
  const others = [...riders.slice(i + 1), ...riders.slice(0, i)].filter((x) => x.photo);
  const related = others;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE}/athletes/${r.key}#person`,
        name: r.name,
        jobTitle: r.title,
        nationality: r.country,
        description: b?.bio.join(" ") ?? r.points.join(" "),
        url: `${SITE}/athletes/${r.key}`,
        ...(r.photo ? { image: `${SITE}${r.photo}` } : {}),
        ...(r.instagram ? { sameAs: [`https://www.instagram.com/${r.instagram}/`] } : {}),
        knowsAbout: ["Wakeboarding", "Boat wakeboarding"],
        award: results.map((x) => `${x.text} (${x.year})`),
        ...(b?.from ? { homeLocation: { "@type": "Country", name: b.from } } : {}),
        ...(b?.sources.length ? { subjectOf: b.sources.map((x) => ({ "@type": "WebPage", name: x.label, url: x.url })) } : {}),
        affiliation: { "@type": "SportsOrganization", name: "O’Town Watersports", url: SITE },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Athletes", item: `${SITE}/athletes` },
          { "@type": "ListItem", position: 3, name: r.name, item: `${SITE}/athletes/${r.key}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="rider-page">
        <div className="rider-page__media">
          {r.photo ? (
            <Image src={r.photo} alt={r.photoAlt ?? `${r.name} wakeboarding`} fill priority quality={85} sizes="(max-width: 900px) 100vw, 55vw" style={{ objectPosition: r.photoPosition ?? "50% 50%" }} />
          ) : (
            <span className="ath-card__type rider-page__type" aria-hidden><span>{first}</span><span>{rest.join(" ")}</span></span>
          )}
        </div>
        <div className="rider-page__copy">
          <nav className="rider-page__crumbs" aria-label="Breadcrumb"><Link href="/athletes">Athletes</Link> <span aria-hidden>/</span> {r.name}</nav>
          <p className="eyebrow eyebrow--cyan">{r.country} · {r.title}</p>
          <h1 className={`display display--name${r.name.split(" ").some((w) => w.length > 9) ? " display--name-long" : ""}`}>{first}<br />{rest.join(" ")}</h1>
          {r.instagram && (
            <a className="riders__ig" href={`https://www.instagram.com/${r.instagram}/`} target="_blank" rel="noreferrer">Follow @{r.instagram} on Instagram <span aria-hidden>↗</span></a>
          )}
          {b?.bio.map((t) => <p key={t} className="rider-page__about">{t}</p>)}
          <div className="actions">
            <Link href="/plan?activity=coaching" className="btn btn--primary btn--pill btn--lg">Train with Glen</Link>
            <Link href={`/athletes/${next.key}`} className="u-link u-link--light">Next: {next.name} →</Link>
          </div>
        </div>
      </section>

      <section className="rider-more">
        <div className="rider-more__inner">
          <div>
            <p className="eyebrow">Results &amp; career</p>
            <h2 className="rider-more__h">{r.name}: career highlights</h2>
            <ol className="rider-hl">
              {results.map((x) => (
                <li key={x.year + x.text}>
                  <span className="rider-hl__y">{x.year.split(", ").map((y) => <span key={y}>{y}</span>)}</span>
                  <span className="rider-hl__t">{x.text}{x.source.startsWith("http") && <a className="rider-hl__src" href={x.source} target="_blank" rel="noreferrer nofollow" >source ↗</a>}</span>
                </li>
              ))}
            </ol>
            {b && b.sources.length > 0 && (
              <p className="rider-src">Sources: {b.sources.map((x, k) => (<span key={x.url}>{k > 0 && " · "}<a href={x.url} target="_blank" rel="noreferrer nofollow">{x.label}</a></span>))}</p>
            )}
          </div>
        </div>
        <div className="rider-more__inner rider-more__inner--rel">
          {related.length > 0 && (
            <nav aria-label="More O’Town riders" className="rider-rel">
              <div className="rider-rel__head">
                <p className="eyebrow">More O’Town riders</p>
                <Link href="/athletes" className="u-link rider-rel__all">All riders →</Link>
              </div>
              <RiderCarousel items={related.map((x) => ({ key: x.key, name: x.name, meta: `${x.country} · ${x.title}`, img: x.cardPhoto ?? x.photo!, alt: x.photoAlt ?? x.name }))} />
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
