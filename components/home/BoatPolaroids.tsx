"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Shot = { src: string; alt: string; caption: string; pos?: string; video?: string };

const SHOTS: Shot[] = [
  { src: "/images/new/sl450-crew.jpg", alt: "The new Supra SL 450 on Lake Barton with riders on board", caption: "The SL 450 on Lake Barton", pos: "38% 62%" },
  { src: "/images/new/dock-start-sl450.jpg", alt: "A rider ready on the dock, the SL 450 waiting on the lake", caption: "Ready on the dock", pos: "50% 60%" },
  { src: "/video/sl450-arrival-poster.jpg", alt: "The SL 450 pulling in to the O’Town dock", caption: "Pulling in to the dock", pos: "50% 55%", video: "/video/sl450-arrival.mp4" },
];

const DURATION = 5200;
const TILT = [-3, 4, -6, 7];

/**
 * A small stack of polaroids beside the 3D boat. The top photo slides away and tucks in at the back.
 * Auto-advances (paused on hover, focus, hidden tab and reduced motion); left/right buttons and arrow keys too.
 */
export default function BoatPolaroids() {
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState<null | "l" | "r">(null);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(true);
  const [video, setVideo] = useState<string | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const n = SHOTS.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
    const vis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, []);

  const go = (dir: 1 | -1) => {
    if (leaving) return;
    setLeaving(dir === 1 ? "l" : "r");
    window.setTimeout(() => { setI((v) => (v + dir + n) % n); setLeaving(null); }, 420);
  };

  useEffect(() => {
    if (!auto || paused || video) return;
    const t = window.setTimeout(() => go(1), DURATION);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, auto, paused, video]);

  const openVideo = (src: string) => { setVideo(src); requestAnimationFrame(() => dlg.current?.showModal()); };

  return (
    <div className="pola" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}
      role="region" aria-roledescription="carousel" aria-label="The new boat on Lake Barton">
      <div className="pola__stack">
        {SHOTS.map((s, k) => {
          const depth = (k - i + n) % n;
          const top = depth === 0;
          const cls = `pola__card${top ? " is-top" : ""}${top && leaving ? ` is-leaving-${leaving}` : ""}`;
          return (
            <figure key={s.src} className={cls} aria-hidden={!top}
              style={{ ["--d" as string]: depth, ["--r" as string]: `${TILT[k % TILT.length]}deg`, zIndex: n - depth }}>
              <div className="pola__photo">
                <Image src={s.src} alt={top ? s.alt : ""} fill sizes="(max-width: 900px) 70vw, 340px" quality={82} style={{ objectPosition: s.pos }} />
                {s.video && top && (
                  <button type="button" className="pola__play" onClick={() => openVideo(s.video!)} aria-label={`Play video: ${s.caption}`}>
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" /></svg>
                  </button>
                )}
              </div>
              <figcaption>{s.caption}</figcaption>
            </figure>
          );
        })}
      </div>

      <div className="pola__nav">
        <button type="button" className="icon-btn icon-btn--dark" onClick={() => go(-1)} aria-label="Previous photo">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
        </button>
        <span className="pola__count" aria-live="polite"><b>{String(i + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}</span>
        <button type="button" className="icon-btn icon-btn--dark" onClick={() => go(1)} aria-label="Next photo">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
        </button>
      </div>
      <div className="pola__dots" aria-hidden>
        {SHOTS.map((sh, k) => (
          <span key={sh.src} className={k === i ? `is-on${auto && !paused && !video ? " is-run" : ""}` : ""} style={k === i ? { animationDuration: `${DURATION}ms` } : undefined} />
        ))}
      </div>

      <dialog ref={dlg} className="media-dialog media-dialog--portrait" aria-label="The SL 450 pulling in"
        onClose={() => setVideo(null)} onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }}>
        <div className="media-dialog__top">
          <p>The SL 450 pulling in</p>
          <button type="button" className="icon-btn icon-btn--dark" onClick={() => dlg.current?.close()} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" /></svg>
          </button>
        </div>
        {video && <video className="media-dialog__video" src={video} controls autoPlay playsInline muted preload="auto" />}
      </dialog>
    </div>
  );
}
