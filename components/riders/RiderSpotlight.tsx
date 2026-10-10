"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { spotlight } from "@/content/site";

const DURATION = 7000;

/** Tabbed rider spotlight that rotates on its own (no scroll effects). Pauses on hover/focus; manual under reduced motion. */
export default function RiderSpotlight() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
  }, []);
  useEffect(() => {
    if (!auto || paused) return;
    const t = setTimeout(() => setI((v) => (v + 1) % spotlight.length), DURATION);
    return () => clearTimeout(t);
  }, [i, auto, paused]);

  const tabsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>(".is-active");
    const box = tabsRef.current;
    if (el && box) box.scrollTo({ left: el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [i]);

  const r = spotlight[i];
  const nextI = (i + 1) % spotlight.length;
  const nx = spotlight[nextI];
  const [first, ...rest] = r.name.split(" ");

  return (
    <section className="riders" id="riders" aria-labelledby="riders-title"
>
      <div className="riders__stage">
        <div className="riders__copy wrap-left">
          <p className="eyebrow eyebrow--cyan" id="riders-title">Riders Glen has worked with</p>
          <div className="riders__swap" key={r.key}>
            <p className="riders__country">{r.country} · {r.title}</p>
            <h2 className="display display--name">{first}<br />{rest.join(" ")}</h2>
            <ul className="dash-list">
              {r.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
            {r.instagram && (
              <a className="riders__ig" href={`https://www.instagram.com/${r.instagram}/`} target="_blank" rel="noreferrer">@{r.instagram} on Instagram <span aria-hidden>↗</span></a>
            )}
          </div>
          <div className="actions">
            <Link href="/plan?activity=coaching" className="btn btn--primary btn--pill btn--lg">Train with Glen</Link>
            <Link href="/athletes" className="u-link">All athletes</Link>
          </div>
        </div>

        <div className="riders__visual">
          {r.photo ? (
            <Image key={r.key} className="riders__photo" src={r.photo} alt={r.photoAlt ?? r.name} fill sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectPosition: r.photoPosition ?? "50% 50%" }} />
          ) : (
            <div key={r.key} className="riders__type" aria-hidden>
              <span className="riders__type-first">{first}</span>
              <span className="riders__type-last">{rest.join(" ")}</span>
              <span className="riders__type-country">{r.country}</span>
            </div>
          )}

          <button type="button" className="up-next" onClick={() => setI(nextI)} aria-label={`Next rider: ${nx.name}`}>
            <span className="up-next__thumb">
              {nx.photo && <Image key={nx.key} src={nx.photo} alt="" fill sizes="56px" style={{ objectPosition: nx.photoPosition ?? "50% 50%" }} />}
              {auto && !paused && (
                <svg key={`r-${i}`} className="up-next__ring" viewBox="0 0 60 60" aria-hidden>
                  <circle cx="30" cy="30" r="28" pathLength="100" style={{ animationDuration: `${DURATION}ms` }} />
                </svg>
              )}
            </span>
            <span className="up-next__text"><span>Up next</span>{nx.name}</span>
          </button>

          <div className="pill-tabs" role="tablist" aria-label="Riders" ref={tabsRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
            {spotlight.map((s, n) => (
              <button key={s.key} type="button" role="tab" aria-selected={n === i} className={`pill-tab${n === i ? " is-active" : ""}`} onClick={() => setI(n)}>
                {s.name.split(" ")[0]}
                {n === i && auto && !paused && <span className="pill-tab__progress" style={{ animationDuration: `${DURATION}ms` }} aria-hidden />}
              </button>
            ))}
          </div>
        </div>

        {r.card && (
          <figure className="float-card" key={`card-${r.key}`}>
            <span className="float-card__media">
              <Image src={r.card} alt={`${r.name}, ${(r.cardCaption ?? "").toLowerCase()}`} fill sizes="(max-width: 900px) 150px, 260px" />
            </span>
            <figcaption><span>{r.name}</span>{r.cardCaption}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
