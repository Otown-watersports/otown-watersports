"use client";

import { useEffect, useRef, useState } from "react";
import { TRAMPOLINE_BLOCKS, TRAMPOLINE_TITLE, WAIVER_PAGES, WAIVER_VERSION } from "@/content/waiverText";
import type { WaiverData } from "@/lib/waiverPdf";

type Kind = "adult" | "minor" | "both";
type Minor = { name: string; dob: string };

const ageOn = (dob: string) => {
  const d = new Date(dob + "T12:00:00");
  if (Number.isNaN(d.getTime())) return -1;
  const n = new Date();
  let a = n.getFullYear() - d.getFullYear();
  if (n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) a--;
  return a;
};
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const THIS_YEAR = new Date().getFullYear();

/** Date of birth as three selects (the native date picker is awkward on phones and in dark mode). Value is YYYY-MM-DD or "". */
function DobPicker({ value, onChange, minYear = THIS_YEAR - 100, maxYear = THIS_YEAR, label }: { value: string; onChange: (v: string) => void; minYear?: number; maxYear?: number; label: string }) {
  const [y, m, d] = value ? value.split("-") : ["", "", ""];
  const set = (ny: string, nm: string, nd: string) => {
    if (ny && nm && nd) {
      const days = new Date(Number(ny), Number(nm), 0).getDate();
      const dd = Math.min(Number(nd), days);
      onChange(`${ny}-${nm.padStart(2, "0")}-${String(dd).padStart(2, "0")}`);
    } else onChange(ny || nm || nd ? `${ny}-${nm}-${nd}` : "");
  };
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => String(maxYear - i));
  const daysIn = y && m ? new Date(Number(y), Number(m), 0).getDate() : 31;
  return (
    <fieldset className="field ws__dob">
      <legend><span>{label}</span></legend>
      <div className="ws__dob-row">
        <select aria-label="Month" value={m ? String(Number(m)) : ""} onChange={(e) => set(y, e.target.value, d)} required>
          <option value="">Month</option>
          {MONTHS.map((n, i) => <option key={n} value={String(i + 1)}>{n}</option>)}
        </select>
        <select aria-label="Day" value={d ? String(Number(d)) : ""} onChange={(e) => set(y, m, e.target.value)} required>
          <option value="">Day</option>
          {Array.from({ length: daysIn }, (_, i) => <option key={i} value={String(i + 1)}>{i + 1}</option>)}
        </select>
        <select aria-label="Year" value={y} onChange={(e) => set(e.target.value, m, d)} required>
          <option value="">Year</option>
          {years.map((yy) => <option key={yy} value={yy}>{yy}</option>)}
        </select>
      </div>
    </fieldset>
  );
}

/** Finger / mouse signature pad on a canvas. */
function SignaturePad({ onChange }: { onChange: (png: string | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawn = useRef(false);
  const ink = useRef(0); // total stroke length, so a stray tap doesn't count as a signature
  useEffect(() => {
    const c = ref.current!;
    const fit = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = r.width * dpr; c.height = r.height * dpr;
      const ctx = c.getContext("2d")!;
      ctx.scale(dpr, dpr); ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#0B1116";
      drawn.current = false; ink.current = 0; onChange(null);
    };
    fit();
    let down = false, lx = 0, ly = 0;
    const pos = (e: PointerEvent) => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const start = (e: PointerEvent) => { down = true; c.setPointerCapture(e.pointerId); [lx, ly] = pos(e); e.preventDefault(); };
    const move = (e: PointerEvent) => {
      if (!down) return;
      const [x, y] = pos(e);
      const ctx = c.getContext("2d")!;
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(x, y); ctx.stroke();
      ink.current += Math.hypot(x - lx, y - ly);
      lx = x; ly = y; drawn.current = true;
    };
    const end = () => { if (!down) return; down = false; if (drawn.current && ink.current > 60) onChange(c.toDataURL("image/png")); };
    c.addEventListener("pointerdown", start); c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", end); c.addEventListener("pointercancel", end);
    return () => { c.removeEventListener("pointerdown", start); c.removeEventListener("pointermove", move); c.removeEventListener("pointerup", end); c.removeEventListener("pointercancel", end); };
  }, [onChange]);
  const clear = () => { const c = ref.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); drawn.current = false; ink.current = 0; onChange(null); };
  const [signed, setSigned] = useState(false);
  const [drawing, setDrawing] = useState(false);
  return (
    <div className={`ws-pad${signed ? " is-signed" : ""}${drawing ? " is-drawing" : ""}`}
      onPointerDown={() => setDrawing(true)} onPointerUp={() => { setDrawing(false); setSigned(ink.current > 60); }} onPointerCancel={() => setDrawing(false)}>
      <canvas ref={ref} aria-label="Signature area: sign with your finger or mouse" />
      <span className="ws-pad__hint" aria-hidden>Draw your signature with your finger or mouse</span>
      <span className="ws-pad__line" aria-hidden>Sign here</span>
      <button type="button" className="ws-pad__clear" onClick={() => { clear(); setSigned(false); }}>Clear</button>
    </div>
  );
}

export default function WaiverSign() {
  const [ready, setReady] = useState<boolean | null>(null);
  const [kind, setKind] = useState<Kind>("adult");
  const [signer, setSigner] = useState({ name: "", dob: "", phone: "", email: "" });
  const [minors, setMinors] = useState<Minor[]>([{ name: "", dob: "" }]);
  const [emergency, setEmergency] = useState({ name: "", phone: "" });
  const [trampoline, setTrampoline] = useState(false);
  const [initials, setInitials] = useState<Record<string, string>>({});
  const [sig, setSig] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const [esign, setEsign] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState<{ url: string; name: string } | null>(null);
  const hp = useRef<HTMLInputElement>(null);

  // keep typed answers if the page is refreshed by accident (never the signature)
  const DRAFT = "otown-waiver-draft";
  useEffect(() => {
    try {
      const d = JSON.parse(sessionStorage.getItem(DRAFT) || "null");
      if (d) { setKind(d.kind); setSigner(d.signer); setMinors(d.minors); setEmergency(d.emergency); setInitials(d.initials); setTrampoline(!!d.trampoline); }
    } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(DRAFT, JSON.stringify({ kind, signer, minors, emergency, initials, trampoline })); } catch {}
  }, [kind, signer, minors, emergency, initials, trampoline]);

  useEffect(() => {
    fetch("/api/waiver").then((r) => r.json()).then((j) => setReady(!!j.ready)).catch(() => setReady(false));
  }, []);

  const pages = kind === "adult" ? [WAIVER_PAGES[0]] : WAIVER_PAGES;
  const needInitials = [...(kind === "adult" ? ["A", "B", "C", "D"] : ["A", "B", "C", "D", "M"]), ...(trampoline ? ["T"] : [])];
  const suggested = signer.name.trim().split(/\s+/).filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 4);
  const initRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const setInitial = (k: string, v: string) => {
    const val = v.toUpperCase().replace(/[^A-Z.\-]/g, "").slice(0, 4);
    setInitials((cur) => ({ ...cur, [k]: val }));
    // once a full set of initials is typed, move on to the next empty box
    if (val.length >= 2) {
      const next = needInitials.find((n) => n !== k && !(initials[n] || "").trim() && needInitials.indexOf(n) > needInitials.indexOf(k));
      if (next) setTimeout(() => { const el = initRefs.current[next]; el?.scrollIntoView({ behavior: "smooth", block: "center" }); el?.focus({ preventScroll: true }); }, 200);
    }
  };
  const applyAll = (v: string) => setInitials(Object.fromEntries(needInitials.map((k) => [k, v])));
  const firstEmpty = needInitials.find((k) => !(initials[k] || "").trim());

  const check = (): string => {
    if (signer.name.trim().split(/\s+/).length < 2) return "Enter your first and last name.";
    if (kind !== "minor" && ageOn(signer.dob) < 18) return "Adult riders must be 18 or older. For riders under 18, choose “My child(ren)”.";
    if (signer.phone.replace(/\D/g, "").length < 7) return "Enter your phone number.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(signer.email)) return "Enter a valid email.";
    if (kind !== "adult") for (const m of minors) { const a = ageOn(m.dob); if (m.name.trim().length < 2 || a < 0 || a >= 18) return "Each child needs a full name and a date of birth (under 18)."; }
    if ((emergency.name.trim() || emergency.phone.trim()) && (emergency.name.trim().length < 2 || emergency.phone.replace(/\D/g, "").length < 7)) return "Emergency contact needs both a name and a phone number (or leave both empty).";
    for (const k of needInitials) if (!(initials[k] || "").trim()) return `Add your initials to ${k === "M" ? "the minor children section" : k === "T" ? "the trampoline release" : `section ${k}`}.`;
    if (!sig) return "Please sign in the signature box (a full signature, not a dot).";
    if (!agree || !esign) return "Tick both boxes to sign.";
    return "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = check();
    setError(msg);
    if (msg) return;
    setState("sending");
    try {
      const data: WaiverData & { website: string } = {
        kind, signer: { ...signer, dob: kind === "minor" ? signer.dob || undefined : signer.dob },
        minors: kind === "adult" ? [] : minors, emergency, trampoline,
        initials: Object.fromEntries(needInitials.map((k) => [k, initials[k].trim().toUpperCase()])),
        signedAt: new Date().toISOString(), version: WAIVER_VERSION, agree, esign, website: hp.current?.value || "",
      };
      const { buildWaiverPdf } = await import("@/lib/waiverPdf");
      const bytes = await buildWaiverPdf(data, sig!);
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const fd = new FormData();
      fd.append("data", JSON.stringify(data));
      fd.append("pdf", blob, "waiver.pdf");
      const res = await fetch("/api/waiver", { method: "POST", body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Something went wrong. Please try again.");
      setPdfUrl({ url: URL.createObjectURL(blob), name: j.filename || "OTown-Waiver.pdf" });
      try { sessionStorage.removeItem(DRAFT); } catch {}
      setState("done");
      requestAnimationFrame(() => { const el = document.getElementById("sign"); el?.scrollIntoView({ behavior: "smooth", block: "start" }); el?.querySelector<HTMLElement>("h2")?.focus(); });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("idle");
    }
  };

  if (ready === false) return null;

  if (state === "done") {
    return (
      <section id="sign" className="ws">
        <div className="wrap ws__done">
          <p className="eyebrow eyebrow--cyan">Signed</p>
          <h2 className="display display--md" tabIndex={-1}>You’re all set.</h2>
          <p>Your signed waiver has been sent to O’Town Watersports and a copy is on its way to {signer.email}.</p>
          <p className="wv-done__note">Don’t see it in a few minutes? Check your spam or junk folder and mark it “Not spam” so you get our emails.</p>
          {pdfUrl && <a className="btn btn--primary btn--pill" href={pdfUrl.url} download={pdfUrl.name}>Download your signed waiver <span aria-hidden>↓</span></a>}
        </div>
      </section>
    );
  }

  return (
    <section id="sign" className="ws" aria-labelledby="ws-title">
      <form className="wrap ws__form" onSubmit={submit} onChange={() => error && setError("")} noValidate>
        <div className="ws__head">
          <p className="eyebrow eyebrow--cyan">Sign online</p>
          <h2 id="ws-title" className="display display--md">Sign the waiver.</h2>
          <p>Fill in your details, initial each section and sign with your finger.</p>
        </div>

        <fieldset className="chips">
          <legend>Who is riding?</legend>
          <div className="chips__row">
            {([["adult", "Just me (18+)"], ["minor", "My child(ren) under 18"], ["both", "Me and my child(ren)"]] as [Kind, string][]).map(([k, l]) => (
              <label key={k} className="chip"><input type="radio" name="kind" checked={kind === k} onChange={() => setKind(k)} /><span>{l}</span></label>
            ))}
          </div>
        </fieldset>

        <label className="ws__check ws__check--card">
          <input type="checkbox" checked={trampoline} onChange={(e) => setTrampoline(e.target.checked)} />
          <span><b>Also sign the trampoline release</b> (optional). For the trampoline on the dock, valid 5 years. One extra section to initial.</span>
        </label>

        <div className="inquiry__grid">
          <label className="field"><span>{kind === "adult" ? "Your full name" : kind === "minor" ? "Parent / guardian full name" : "Your full name (parent / guardian)"}</span>
            <input autoComplete="name" value={signer.name} onChange={(e) => setSigner({ ...signer, name: e.target.value })} required /></label>
          {kind !== "minor" && (
            <DobPicker label="Your date of birth" value={signer.dob} maxYear={THIS_YEAR - 18} onChange={(dob) => setSigner({ ...signer, dob })} />
          )}
          <label className="field"><span>Phone</span>
            <input type="tel" autoComplete="tel" value={signer.phone} onChange={(e) => setSigner({ ...signer, phone: e.target.value })} required /></label>
          <label className="field"><span>Email <em>your copy goes here</em></span>
            <input type="email" autoComplete="email" value={signer.email} onChange={(e) => setSigner({ ...signer, email: e.target.value })} required /></label>
        </div>

        {kind !== "adult" && (
          <div className="ws__minors">
            {minors.map((m, i) => (
              <div className="inquiry__grid" key={i}>
                <label className="field"><span>Child {minors.length > 1 ? i + 1 : ""} full name</span>
                  <input value={m.name} onChange={(e) => setMinors(minors.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} required /></label>
                <div className="ws__dob-wrap">
                  <DobPicker label="Date of birth" value={m.dob} minYear={THIS_YEAR - 17} onChange={(dob) => setMinors(minors.map((x, j) => (j === i ? { ...x, dob } : x)))} />
                  {minors.length > 1 && <button type="button" className="ws__remove" onClick={() => setMinors(minors.filter((_, j) => j !== i))}>Remove child</button>}
                </div>
              </div>
            ))}
            {minors.length < 6 && <button type="button" className="u-link u-link--light ws__add" onClick={() => setMinors([...minors, { name: "", dob: "" }])}>+ Add another child</button>}
          </div>
        )}

        <div className="inquiry__grid">
          <label className="field"><span>Emergency contact name <em>optional</em></span>
            <input autoComplete="off" value={emergency.name} onChange={(e) => setEmergency({ ...emergency, name: e.target.value })} /></label>
          <label className="field"><span>Emergency contact phone <em>optional</em></span>
            <input type="tel" autoComplete="off" value={emergency.phone} onChange={(e) => setEmergency({ ...emergency, phone: e.target.value })} /></label>
        </div>

        <div className="ws__docwrap">
        <div className="ws__prog" aria-label="Initials progress">
          <b>Initial:</b>
          {needInitials.map((k) => {
            const done = (initials[k] || "").length >= 2;
            return (
              <button key={k} type="button" className={done ? "is-done" : k === firstEmpty ? "is-next" : ""}
                onClick={() => initRefs.current[k]?.scrollIntoView({ behavior: "smooth", block: "center" })}>
                {k === "M" ? "Minor" : k === "T" ? "Trampoline" : k}{done ? " ✓" : ""}
              </button>
            );
          })}
          {firstEmpty && suggested && <button type="button" onClick={() => applyAll(suggested)}>All as “{suggested}”</button>}
        </div>
        <div className="ws__doc" aria-label="Waiver text">
          {[...pages, ...(trampoline ? [{ title: [TRAMPOLINE_TITLE], blocks: TRAMPOLINE_BLOCKS }] : [])].map((p, pi) => (
            <div key={pi} className="ws__page">
              {p.title.map((t) => <p key={t} className="ws__title">{t}</p>)}
              {p.blocks.map((b, bi) =>
                b.t === "h" ? <h3 key={bi} className={b.notice ? "ws__notice" : undefined}>{b.text}</h3>
                : b.t === "li" ? <p key={bi} className="ws__li">{b.text}</p>
                : (
                  <div key={bi}>
                    <p className={b.notice ? "ws__notice" : undefined}>{b.text}</p>
                    {b.initial && (
                      <div className={`ws__init${(initials[b.initial] || "").length >= 2 ? " is-done" : ""}`}>
                        <label>
                          <span>Initial here{b.initial === "M" ? " (minor release)" : b.initial === "T" ? " (trampoline)" : ` (section ${b.initial})`}</span>
                          <input ref={(el) => { initRefs.current[b.initial!] = el; }} maxLength={4} autoCapitalize="characters" autoComplete="off"
                            placeholder={suggested || "AB"} value={initials[b.initial] || ""}
                            onChange={(e) => setInitial(b.initial!, e.target.value)} required />
                        </label>
                        {(initials[b.initial] || "").length >= 2 && needInitials.some((k) => (initials[k] || "") !== initials[b.initial!]) && (
                          <button type="button" className="ws__init-all" onClick={() => applyAll(initials[b.initial!])}>Use “{initials[b.initial]}” for all sections</button>
                        )}
                        {!(initials[b.initial] || "") && suggested && b.initial === firstEmpty && (
                          <button type="button" className="ws__init-all" onClick={() => applyAll(suggested)}>Initial all sections as “{suggested}”</button>
                        )}
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          ))}
        </div>
        </div>

        <div className="ws__sign">
          <p className="ws__label">{kind === "adult" ? "Your signature" : "Parent / guardian signature"}</p>
          <SignaturePad onChange={setSig} />
        </div>

        <label className="ws__check"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>I have read {trampoline ? "both agreements" : "this entire agreement"}, initialed each section, understand that I am giving up legal rights, and agree to be bound by {trampoline ? "them" : "it"}{kind !== "adult" ? ", and I am the natural guardian of the child(ren) listed" : ""}.</span></label>
        <label className="ws__check"><input type="checkbox" checked={esign} onChange={(e) => setEsign(e.target.checked)} />
          <span>I agree to do this electronically. My electronic signature has the same legal effect as a handwritten one, and I will receive my signed copy by email.</span></label>

        <input ref={hp} name="website" tabIndex={-1} autoComplete="off" className="ws__hp" aria-hidden />

        <div className="inquiry__foot">
          <button className="btn btn--primary btn--pill btn--lg" type="submit" disabled={state === "sending" || ready === null}>
            {state === "sending" ? "Signing…" : "Sign waiver"} <span aria-hidden>→</span>
          </button>
          {error ? <p className="ws__error" role="alert">{error}</p>
            : (() => { const missing = [signer.name.trim().split(/\s+/).length < 2 && "your name", kind !== "minor" && !signer.dob && "date of birth", !signer.email && "email", needInitials.some((k) => !(initials[k] || "").trim()) && "initials", !sig && "signature", (!agree || !esign) && "the two boxes"].filter(Boolean) as string[]; return missing.length ? <p className="ws__missing">Still needed: {missing.join(", ")}</p> : null; })()}
        </div>
      </form>
    </section>
  );
}
