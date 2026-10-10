"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { key: string; name: string; meta: string; img: string; alt: string };

/** Horizontal rider row: arrows on desktop, swipe on touch; three cards visible on desktop. */
export default function RiderCarousel({ items }: { items: Item[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(() => { update(); }, []);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    const w = card ? card.getBoundingClientRect().width + 18 : el.clientWidth;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <div className="rc">
      <div className="rc__nav">
        <button type="button" className="rc__btn" onClick={() => go(-1)} disabled={edge.start} aria-label="Previous riders">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
        </button>
        <button type="button" className="rc__btn" onClick={() => go(1)} disabled={edge.end} aria-label="Next riders">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
        </button>
      </div>
      <ul ref={ref} className="rc__list" onScroll={update}>
        {items.map((x) => (
          <li key={x.key}>
            <Link href={`/athletes/${x.key}`}>
              <span className="rider-rel__img"><Image src={x.img} alt={x.alt} fill sizes="(max-width: 700px) 70vw, 30vw" quality={85} /></span>
              <b>{x.name}</b><small>{x.meta}</small>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
