"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { heroSlides, contact } from "@/content/site";
import VideoDialog from "@/components/media/VideoDialog";
import Magnetic from "@/components/ui/Magnetic";
import { imgUrl } from "@/lib/img";

const DURATION = 6500;

/**
 * Full-bleed hero with rotating real photographs.
 * The brand line — Learn. Ride. Progress. — is set huge along the bottom and each word is the control for its photo:
 * the active word is solid with a neon progress line, the others are outlined.
 * Auto-advance pauses on hover/focus and when the tab is hidden, and never runs under reduced motion.
 */
export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLElement>(null);

  const go = (n: number) => {
    if (n === i) return;
    setPrev(i);
    setI(n);
  };

  // Gentle pointer parallax on the photo (desktop pointers only, never under reduced motion)
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
    };
    el.addEventListener("pointermove", move);
    return () => { el.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
    const vis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, []);

  useEffect(() => {
    if (!auto || paused) return;
    const t = setTimeout(() => go((i + 1) % heroSlides.length), DURATION);
    return () => clearTimeout(t);
  }, [i, auto, paused]);


  return (
    <section
      ref={ref}
      className={`hero${auto && !paused ? " is-playing" : ""}`}
      aria-roledescription="carousel"
      aria-label="O’Town on Lake Barton"
    >
      <div className="hero__slides">
        {heroSlides.map((sl, n) => (
          <div key={sl.key} className={`hero__slide${n === i ? " is-active" : n === prev ? " is-prev" : ""}`} aria-hidden={n !== i}
            style={{ ["--pos" as string]: sl.position, ["--pos-m" as string]: sl.mobilePosition, ["--zoom-d" as string]: sl.zoom, ["--origin-d" as string]: sl.origin, ["--zoom-m" as string]: (sl.mobileZoom ?? 1) < 1 ? 1 : (sl.mobileZoom ?? 1), ["--origin-m" as string]: sl.mobileOrigin ?? "50% 50%" }}>
            <div className={`hero__plate${(sl.mobileZoom ?? 1) < 1 ? " hero__plate--fit" : ""}`}>
              {(sl.mobileZoom ?? 1) < 1 && (
                <Image className="hero__backfill" src={sl.image} alt="" aria-hidden fill quality={40} sizes="100vw" loading="eager" />
              )}
              <Image src={sl.image} alt={sl.alt} fill priority={n === 0} loading="eager" quality={85}
                sizes={sl.portrait ? "(orientation: portrait) max(100vw, 75vh), 130vw" : "(orientation: portrait) 680px, 100vw"} />
            </div>
          </div>
        ))}
        <div className="hero__shade" aria-hidden />
      </div>

      <div className="hero__inner wrap">
        <div className="hero__top">
          <Link href="/plan#visit" className="hero__loc" aria-label="Lake Barton, Orlando, Florida: see the map"><span className="hero__dot" aria-hidden />{contact.location}<span className="hero__loc-arrow" aria-hidden>↗</span></Link>
        </div>

        <div className="hero__mid">
          <div className="hero__copy">
            <h1 className="hero__title">Wakeboard &amp; wakesurf coaching with <em>Glen&nbsp;Fletcher.</em></h1>
            <p className="hero__lede">From your first ride to the trick you’ve been working toward. On Lake Barton, every week of the year.</p>
            <div className="actions">
              <Magnetic><Link href="/plan" className="btn btn--primary btn--pill btn--lg">Plan your session <span aria-hidden>→</span></Link></Magnetic>
              <Link href="/rates" className="hero__rates u-link u-link--light">See rates</Link>
            </div>
          </div>

          <VideoDialog src="/video/glen-film.mp4" title="Glen on the water" className="film-chip">
            <span className="film-chip__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl("/video/glen-film-poster.jpg", 384)} alt="" width={720} height={720} />
              <span className="film-chip__play" aria-hidden>
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" /></svg>
              </span>
            </span>
            <span className="film-chip__text">
              <span className="film-chip__title">Watch Glen on the water</span>
              <span className="film-chip__meta">1 min film</span>
            </span>
          </VideoDialog>
        </div>

        <div className="hero__words" role="tablist" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)} aria-label="Learn, ride, progress: choose a photo">
          {heroSlides.map((sl, n) => (
            <button key={sl.key} type="button" role="tab" aria-selected={n === i} aria-label={`${sl.label}: ${sl.caption}`}
              className={`hero__word${n === i ? " is-active" : ""}`} onClick={() => go(n)}>
              <span className="hero__word-text" key={n === i ? `on-${i}` : `off-${n}`} aria-hidden>
                {`${sl.label}.`.split("").map((ch, k) => <span key={k} className="hero__ch" style={{ ["--k" as string]: k }}>{ch}</span>)}
              </span>
              <span className="hero__word-bar" aria-hidden><span key={`${i}-${n}`} className="hero__word-fill" style={{ animationDuration: `${DURATION}ms` }} /></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
