"use client";
import { useEffect, useRef, useState } from "react";

type Props = { url: string; title: string; text: string; qrSvg: string };

export default function CardShare({ url, title, text, qrSvg }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState("");
  const [canShare, setCanShare] = useState(false);
  useEffect(() => { setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function"); }, []);

  const open = () => { setStatus(""); ref.current?.showModal(); };
  const close = () => ref.current?.close();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied");
    } catch {
      setStatus("Couldn’t copy automatically — press and hold the link above to copy.");
    }
  };
  const share = async () => {
    try { await navigator.share({ title, text, url }); } catch { /* cancelled */ }
  };

  return (
    <>
      <button type="button" className="cd-share" onClick={open} aria-haspopup="dialog">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
        Share O’Town
      </button>
      <dialog ref={ref} className="cd-sheet" aria-labelledby="cd-sheet-title" onClick={(e) => { if (e.target === ref.current) close(); }}>
        <div className="cd-sheet__body">
          <button type="button" className="cd-sheet__x" onClick={close} aria-label="Close share dialog">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <h2 id="cd-sheet-title" className="cd-sheet__title">Share O’Town</h2>
          <p className="cd-sheet__sub">Scan with a phone camera to open the card.</p>
          <div className="cd-qr" role="img" aria-label="QR code linking to the O’Town Watersports digital business card" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <p className="cd-sheet__url">{url.replace("https://", "")}</p>
          <div className="cd-sheet__row">
            <button type="button" className="cd-btn cd-btn--ghost" onClick={copy}>Copy link</button>
            {canShare && <button type="button" className="cd-btn cd-btn--solid" onClick={share}>Share…</button>}
          </div>
          <p className="cd-sheet__status" role="status" aria-live="polite">{status}</p>
        </div>
      </dialog>
    </>
  );
}
