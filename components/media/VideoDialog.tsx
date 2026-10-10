"use client";

import { useRef, useState } from "react";

type Props = { src: string; title: string; className?: string; children: React.ReactNode; muted?: boolean; portrait?: boolean };

/** Button that opens a centred native <dialog> with the video; the player is only created on request. */
export default function VideoDialog({ src, title, className, children, muted = false, portrait = false }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(false);
  const open = () => { setActive(true); ref.current?.showModal(); };
  const close = () => ref.current?.close();

  return (
    <>
      <button type="button" className={className} onClick={open} aria-haspopup="dialog">{children}</button>
      <dialog ref={ref} className={`media-dialog${portrait ? " media-dialog--portrait" : ""}`} aria-label={title}
        onClose={() => setActive(false)} onClick={(e) => { if (e.target === ref.current) close(); }}>
        <div className="media-dialog__top">
          <p>{title}</p>
          <button type="button" className="icon-btn icon-btn--dark" onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" /></svg>
          </button>
        </div>
        {active && <video className="media-dialog__video" src={src} poster={src.replace(/\.mp4$/, "-poster.jpg")} controls autoPlay playsInline muted={muted} preload="auto" />}
      </dialog>
    </>
  );
}
