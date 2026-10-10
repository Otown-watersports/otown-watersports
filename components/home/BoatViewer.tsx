"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/** Named viewpoints as a fraction of a full turn (frame 0 = three-quarter bow). */
const VIEWS = [
  { label: "¾ Bow", at: 0 },
  { label: "Profile", at: 12 / 72 },
  { label: "Stern", at: 29 / 72 },
  { label: "Port", at: 48 / 72 },
  { label: "Bow", at: 65 / 72 },
];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * 360° boat viewer built from captured views of Supra's own SL render (not a free-orbit 3D model).
 * Controlled by the rotation bar, view shortcuts, arrow keys and horizontal drag (with gentle inertia). Never plays on its own.
 */
export default function BoatViewer({ frames, label, badge }: { frames: number; label: string; badge?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const target = useRef(0);
  const shown = useRef(0);
  const raf = useRef(0);
  const isDragging = useRef(false);
  const [value, setValue] = useState(0);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const wrap = useCallback((f: number) => ((f % frames) + frames) % frames, [frames]);

  // Always draw one real captured view — no blending, so nothing ghosts or trails while turning
  const last = useRef(-1);
  const draw = useCallback((f: number) => {
    const c = canvasRef.current;
    const i = Math.round(wrap(f)) % frames;
    const img = imgs.current[i];
    if (!c || !img) return;
    if (i === last.current && c.dataset.w === String(c.width)) return;
    last.current = i; c.dataset.w = String(c.width);
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    const r = Math.min(c.width / img.naturalWidth, c.height / img.naturalHeight);
    const w = img.naturalWidth * r, h = img.naturalHeight * r;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
  }, [frames, wrap]);

  const tick = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const step = () => {
      const d = target.current - shown.current;
      if (Math.abs(d) < 0.004) {
        // Always come to rest on a real captured view — never on a blend of two
        const snap = Math.round(target.current);
        if (snap !== target.current && !isDragging.current) { target.current = snap; setValue(wrap(snap)); raf.current = requestAnimationFrame(step); return; }
        shown.current = target.current; draw(shown.current); return;
      }
      shown.current += d * 0.25;
      draw(shown.current);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [draw, wrap]);

  const goTo = useCallback((f: number) => {
    target.current = f;
    setValue(wrap(f));
    if (isDragging.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { cancelAnimationFrame(raf.current); shown.current = f; draw(f); }
    else tick();
  }, [wrap, tick, draw]);

  /** Go to a named view by the shortest way round. */
  const goView = (at: number) => {
    const dest = Math.round(at * frames);
    const cur = target.current;
    let delta = wrap(dest - cur);
    if (delta > frames / 2) delta -= frames;
    goTo(cur + delta);
  };

  // Keep the canvas sharp at any size
  useEffect(() => {
    const c = canvasRef.current, s = stageRef.current;
    if (!c || !s) return;
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(s.clientWidth * dpr);
      c.height = Math.round(s.clientHeight * dpr);
      last.current = -1;
      draw(shown.current);
    });
    ro.observe(s);
    return () => ro.disconnect();
  }, [draw]);

  // Load the views as the section approaches
  useEffect(() => {
    const s = stageRef.current;
    if (!s) return;
    let started = false;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started) return;
      started = true;
      const size = s.clientWidth * Math.min(window.devicePixelRatio || 1, 2) > 1100 ? "d" : "m";
      let done = 0;
      const list: HTMLImageElement[] = [];
      for (let i = 0; i < frames; i++) {
        const img = new Image();
        img.decoding = "async";
        img.src = `/boat/${size}/${pad(i)}.webp`;
        list.push(img);
        img.decode().catch(() => {}).finally(() => {
          done++;
          setProgress(done / frames);
          if (done === frames) { imgs.current = list; setReady(true); last.current = -1; draw(shown.current); }
        });
      }
    }, { rootMargin: "800px 0px" });
    io.observe(s);
    return () => { io.disconnect(); cancelAnimationFrame(raf.current); };
  }, [frames, draw]);

  // Drag (horizontal only — vertical swipes still scroll the page), with a soft glide on release
  useEffect(() => {
    const s = stageRef.current;
    if (!s || !ready) return;
    const dragRef = isDragging;
    let down = false, dragging = false, x0 = 0, y0 = 0, f0 = 0, lastX = 0, lastT = 0, vel = 0, glide = 0;
    const per = () => (s.clientWidth * 1.5) / frames; // 1.5 widths per full turn — slow and controlled
    const stopGlide = () => { cancelAnimationFrame(glide); dragRef.current = false; };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      stopGlide();
      down = true; dragging = false; x0 = lastX = e.clientX; y0 = e.clientY; f0 = target.current; lastT = performance.now(); vel = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      if (!dragging) {
        if (Math.abs(dx) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) { down = false; return; }
        dragging = true; dragRef.current = true; s.setPointerCapture(e.pointerId); s.classList.add("is-dragging");
      }
      const now = performance.now();
      const v = (e.clientX - lastX) / Math.max(1, now - lastT);
      vel = vel * 0.6 + v * 0.4;
      lastX = e.clientX; lastT = now;
      goTo(f0 + dx / per()); // the near side of the boat follows the finger
    };
    const onUp = () => {
      if (!down) return;
      down = false; s.classList.remove("is-dragging");
      if (!dragging || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { dragRef.current = false; goTo(target.current); return; }
      let v = vel * 16 / per(); // frames per 16ms
      const run = () => {
        v *= 0.93;
        if (Math.abs(v) < 0.004) { dragRef.current = false; goTo(target.current); return; }
        goTo(target.current + v);
        glide = requestAnimationFrame(run);
      };
      glide = requestAnimationFrame(run);
    };
    s.addEventListener("pointerdown", onDown); s.addEventListener("pointermove", onMove);
    s.addEventListener("pointerup", onUp); s.addEventListener("pointercancel", onUp);
    return () => { stopGlide(); s.removeEventListener("pointerdown", onDown); s.removeEventListener("pointermove", onMove); s.removeEventListener("pointerup", onUp); s.removeEventListener("pointercancel", onUp); };
  }, [ready, frames, goTo]);

  // Rotation bar: press anywhere on the line and slide (the native range only grabs its thumb on iPhone)
  const barRef = useRef<HTMLDivElement>(null);
  const setFromX = useCallback((clientX: number) => {
    const el = barRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const v = Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * frames;
    const cur = target.current;
    let d = v - wrap(cur);
    if (d > frames / 2) d -= frames; else if (d < -frames / 2) d += frames;
    goTo(cur + d);
  }, [frames, wrap, goTo]);
  const barDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ready || (e.pointerType === "mouse" && e.button !== 0)) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.classList.add("is-active");
    setFromX(e.clientX);
  };
  const barMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromX(e.clientX);
  };
  const barUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("is-active");
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const deg = Math.round((value / frames) * 360) % 360;
  const pct = (value / frames) * 100;
  const activeView = VIEWS.reduce((best, v) => {
    const d = Math.min(Math.abs(v.at * frames - value), frames - Math.abs(v.at * frames - value));
    return d < best.d ? { label: v.label, d } : best;
  }, { label: "", d: Infinity });

  return (
    <div className="boat-viewer">
      <div ref={stageRef} className={`boat-stage${ready ? " is-ready" : ""}`} aria-hidden>
        <div className="boat-floor" />
        {badge && <span className="boat-badge"><b>{badge.split(" · ")[0]}</b>{badge.split(" · ")[1]}</span>}
        <picture>
          <source media="(max-width: 700px)" srcSet="/boat/m/00.webp" />
          <img className="boat-poster" src="/boat/d/00.webp" alt="" width={1800} height={915} />
        </picture>
        <canvas ref={canvasRef} className="boat-canvas" />
        {!ready && <span className="boat-load" style={{ ["--p" as string]: progress }} />}
      </div>

      <div className="boat-views" role="group" aria-label="Viewpoints">
        {VIEWS.map((v) => (
          <button key={v.label} type="button" disabled={!ready}
            className={`boat-view${activeView.label === v.label && activeView.d < frames / 36 ? " is-active" : ""}`}
            onClick={() => goView(v.at)}>{v.label}</button>
        ))}
      </div>

      <div className="boat-bar">
        <div ref={barRef} className="boat-range" style={{ ["--pct" as string]: `${pct}%` }}
          onPointerDown={barDown} onPointerMove={barMove} onPointerUp={barUp} onPointerCancel={barUp}>
          <span className="boat-range__track" aria-hidden />
          <input
            type="range" min={0} max={frames} step={0.02} value={value} disabled={!ready}
            aria-label={`Rotate ${label}`} aria-valuetext={`${deg} degrees`}
            onChange={(e) => {
              // move to the chosen angle without spinning the long way round
              const v = Number(e.target.value);
              const cur = target.current;
              let d = v - wrap(cur);
              if (d > frames / 2) d -= frames; else if (d < -frames / 2) d += frames;
              goTo(cur + d);
            }}
          />
          <span className="boat-range__thumb" aria-hidden />
        </div>
      </div>
      <p className="boat-hint">{ready ? "Drag to rotate" : "Loading…"}</p>
    </div>
  );
}
