"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { imgUrl } from "@/lib/img";

export type GalleryItem =
  | { kind: "image"; src: string; alt: string; caption: string; cls: string; sizes: string; position?: string }
  | { kind: "video"; src: string; poster: string; alt: string; caption: string; cls: string; portrait?: boolean; position?: string };

const Play = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" /></svg>
);

/** Tile grid + one shared viewer: open any tile, then step through every photo and video with arrows, keys or swipe. */
export default function MediaGallery({ items, className }: { items: GalleryItem[]; className: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState<number | null>(null);
  const touch = useRef<number | null>(null);
  const n = items.length;

  const open = (k: number) => { setI(k); dlg.current?.showModal(); };
  const close = () => dlg.current?.close();
  const step = useCallback((d: number) => setI((v) => (v === null ? v : (v + d + n) % n)), [n]);

  useEffect(() => {
    const el = dlg.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.open) return;
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const cur = i === null ? null : items[i];

  return (
    <>
      <div className={className}>
        {items.map((it, k) => (
          <button key={it.src} type="button" className={`tile ${it.cls}`} onClick={() => open(k)} aria-haspopup="dialog">
            {it.kind === "image" ? (
              <Image src={it.src} alt={it.alt} fill sizes={it.sizes} quality={85} style={it.position ? { objectPosition: it.position } : undefined} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imgUrl(it.poster, 640)} alt={it.alt} loading="lazy" style={it.position ? { objectPosition: it.position } : undefined} />
            )}
            {it.kind === "video" && <span className="tile__play"><Play /></span>}
            <span className="tile__cap">{it.caption}</span>
          </button>
        ))}
      </div>

      <dialog ref={dlg} className={`media-dialog media-dialog--gallery${cur?.kind === "video" && cur.portrait ? " is-portrait" : ""}`} aria-label={cur?.caption ?? "Gallery"}
        onClose={() => setI(null)} onClick={(e) => { if (e.target === dlg.current) close(); }}
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => { if (touch.current === null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); touch.current = null; }}>
        <div className="media-dialog__top">
          <p>{cur?.caption} <span className="gal__count">{i === null ? "" : `${i + 1} / ${n}`}</span></p>
          <button type="button" className="icon-btn icon-btn--dark" onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" /></svg>
          </button>
        </div>
        <div className="gal__stage">
          {cur?.kind === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={cur.src} className="media-dialog__img" src={imgUrl(cur.src, 1920)} alt={cur.alt} />
          )}
          {cur?.kind === "video" && (
            <video key={cur.src} className="media-dialog__video" src={cur.src} poster={imgUrl(cur.poster, 1280)} controls autoPlay playsInline muted preload="auto" />
          )}
          <button type="button" className="gal__nav gal__nav--prev" onClick={() => step(-1)} aria-label="Previous">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
          <button type="button" className="gal__nav gal__nav--next" onClick={() => step(1)} aria-label="Next">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
        </div>
      </dialog>
    </>
  );
}
