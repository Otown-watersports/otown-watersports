"use client";

import Image from "next/image";
import { useRef } from "react";
import { imgUrl } from "@/lib/img";

type Props = { src: string; alt: string; caption: string; className?: string; sizes: string; position?: string };

/** Photo tile that opens a centred full-size view (21st.dev "morphing dialog" idea, using a native dialog). */
export default function Lightbox({ src, alt, caption, className, sizes, position }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className={`tile ${className ?? ""}`} onClick={() => ref.current?.showModal()} aria-haspopup="dialog">
        <Image src={src} alt={alt} fill sizes={sizes} quality={85} style={position ? { objectPosition: position } : undefined} />
        <span className="tile__cap">{caption}</span>
        <span className="tile__zoom" aria-hidden>
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 10V4h6M20 14v6h-6M4 4l6 6M20 20l-6-6" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
        </span>
      </button>
      <dialog ref={ref} className="media-dialog media-dialog--photo" aria-label={caption}
        onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}>
        <div className="media-dialog__top">
          <p>{caption}</p>
          <button type="button" className="icon-btn icon-btn--dark" onClick={() => ref.current?.close()} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" /></svg>
          </button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="media-dialog__img" src={imgUrl(src, 1920)} alt={alt} loading="lazy" />
      </dialog>
    </>
  );
}
