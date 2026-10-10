"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Magnetic from "./Magnetic";
import { imgUrl } from "@/lib/img";

const links = [
  { label: "Coaching", href: "/coaching" },
  { label: "Rates", href: "/rates" },
  { label: "Stay", href: "/stay" },
  { label: "Athletes", href: "/athletes" },
  { label: "Life at O’Town", href: "/#life" },
];

/** Text that rolls to a duplicate on hover (21st.dev "flip links", adapted). */
function Flip({ children }: { children: string }) {
  return (
    <span className="flip" aria-hidden>
      <span className="flip__a">{children}</span>
      <span className="flip__b">{children}</span>
    </span>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("menu-open");
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); }
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a,button");
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.classList.remove("menu-open"); };
  }, [open]);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    return () => document.documentElement.classList.remove("menu-open");
  }, [open]);

  const close = () => setOpen(false);
  const solid = scrolled || open || pathname === "/stay";

  return (
    <header className={`site-header${solid ? " is-solid" : ""}${open ? " is-open" : ""}`}>
      <div className="site-header__bar">
        <Link href="/" className="brand" aria-label="O’Town Watersports home" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand__logo brand__logo--neon" src={imgUrl("/brand/otown-logo-neon.png", 640)} alt="" width={900} height={302} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand__logo brand__logo--solid" src={imgUrl("/brand/otown-logo-solid.png", 640)} alt="" width={900} height={302} />
          <span className="brand__sub">Watersports</span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="site-nav__link" aria-current={pathname === l.href ? "page" : undefined} aria-label={l.label}>
              <Flip>{l.label}</Flip>
            </Link>
          ))}
        </nav>

        <Magnetic>
          <Link href="/plan" className="btn btn--primary btn--pill site-header__cta">Plan your session</Link>
        </Magnetic>

        <button ref={btnRef} type="button" className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
          <span className="menu-btn__label">{open ? "Close" : "Menu"}</span>
          <span className="menu-btn__icon" aria-hidden />
        </button>
      </div>

      <div id="mobile-menu" ref={panelRef} className="mobile-menu" hidden={!open}>
        <nav aria-label="Mobile">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} className="mobile-menu__link" onClick={close}>
              <span className="mobile-menu__num">0{i + 1}</span>{l.label}
            </Link>
          ))}
        </nav>
        <Link href="/plan" className="btn btn--primary btn--pill btn--block" onClick={close}>Plan your session</Link>
      </div>
    </header>
  );
}
