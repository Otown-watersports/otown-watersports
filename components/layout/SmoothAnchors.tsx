"use client";

import { useEffect } from "react";

const ease = (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2); // easeInOutQuart

/** Slower, eased scrolling for same-page anchor links (e.g. /#experiences on the homepage). Instant under reduced motion. */
export default function SmoothAnchors() {
  useEffect(() => {
    let raf = 0;
    const cancel = () => cancelAnimationFrame(raf);

    const scrollToEl = (el: HTMLElement) => {
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const start = window.scrollY;
      const end = Math.max(0, el.getBoundingClientRect().top + start - offset);
      const dist = Math.abs(end - start);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || dist < 4) { window.scrollTo(0, end); return; }
      const dur = Math.min(1700, Math.max(950, 700 + dist * 0.22));
      const t0 = performance.now();
      cancel();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, start + (end - start) * ease(p));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      history.pushState(null, "", url.hash);
      window.dispatchEvent(new HashChangeEvent("hashchange")); // lets the mobile menu close
      scrollToEl(el);
    };

    // Stop the animation if the visitor scrolls themselves
    const stop = () => cancel();
    document.addEventListener("click", onClick, true);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      cancel();
    };
  }, []);
  return null;
}
