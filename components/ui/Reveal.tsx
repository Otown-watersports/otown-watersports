"use client";

import { useEffect } from "react";

/** Adds a gentle reveal to [data-reveal] elements. Content is fully visible without JS or with reduced motion. */
export default function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight) {
        el.classList.add("will-reveal");
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, []);
  return null;
}
