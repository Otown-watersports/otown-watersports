"use client";

import { useEffect, useRef, useState } from "react";
import { WAIVER_PAGES, WAIVER_VERSION } from "@/content/waiverText";
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
const today = () => new Date().toISOString().slice(0, 10);

/** Finger / mouse signature pad on a canvas. */
function SignaturePad({ onChange }: { onChange: (png: string | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawn = useRef(false);
  useEffect(() => {
    const c = ref.current!;
    const fit = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = r.width * dpr; c.height = r.height * dpr;
      const ctx = c.getContext("2d")!;
      ctx.scale(dpr, dpr); ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#0B1116";
      drawn.current = false; onChange(null);
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
      lx = x; ly = y; drawn.current = true;
    };
    const end = () => { if (!down) return; down = false; if (drawn.current) onChange(c.toDataURL("image/png")); };
    c.addEventListener("pointerdown", start); c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", end); c.addEventListener("pointercancel", end);
    return () => { c.removeEventListener("pointerdown", start); c.removeEventListener("pointermove", move); c.removeEventListener("pointerup", end); c.removeEventListener("pointercancel", end); };
  }, [onChange]);
  const clear = () => { const c = ref.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); drawn.current = false; onChange(null); };
  return (
    <div className="ws-pad">
      <canvas ref={ref} aria-label="Signature area: sign with your finger or mouse" />
      <span className="ws-pad__line" aria-hidden>Sign here</span>
      <button type="button" className="ws-pad__clear" onClick={clear}>Clear</button>
    </div>
  );
}

export default function WaiverSign() {
  const [ready, setReady] = useState<boolean | null>(null);
  const [kind, setKind] = useState<Kind>("adult");
  const [signer, setSigner] = useState({ name: "", dob: "", phone: "", email: "" });
  const [minors, setMinors] = useState<Minor[]>([{ name: "", dob: "" }]);
  const [emergency, setEmergency] = useState({ name: "", phone: "" });
  const [initials, setInitials] = useState<Record<string, string>>({});
  const [sig, setSig] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const [esign, setEsign] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState<{ url: string; name: string } | null>(null);
  const hp = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/waiver").then((r) => r.json()).then((j) => setReady(!!j.ready)).catch(() => setReady(false));
  }, []);

  const pages = kind === "adult" ? [WAIVER_PAGES[0]] : WAIVER_PAGES;
  const needInitials = kind === "adult" ? ["A", "B", "C", "D"] : ["A", "B", "C", "D", "M"];

  const check = (): string => {
    if (signer.name.trim().split(/\s+/).length < 2) return "Enter your first and last name.";
    if (kind !== "minor" && ageOn(signer.dob) < 18) return "Adult riders must be 18 or older. For riders under 18, choose “My child(ren)”.";
    if (signer.phone.replace(/\D/g, "").length < 7) return "Enter your phone number.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(signer.email)) return "Enter a valid email.";
    if (kind !== "adult") for (const m of minors) { const a = ageOn(m.dob); if (m.name.trim().length < 2 || a < 0 || a >= 18) return "Each child needs a full name and a date of birth (under 18)."; }
    if (emergency.name.trim().length < 2 || emergency.phone.replace(/\D/g, "").length < 7) return "Add an emergency contact name and phone.";
    for (const k of needInitials) if (!(initials[k] || "").trim()) return `Add your initials to section ${k === "M" ? "for minor children" : k}.`;
    if (!sig) return "Please sign in the signature box.";
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
        minors: kind === "adult" ? [] : minors, emergency,
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
      setState("done");
      window.scrollTo({ top: (document.getElementById("sign")?.offsetTop ?? 0) - 80, behavior: "smooth" });
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
          <h2 className="display display--md">You’re all set.</h2>
          <p>Your signed waiver has been sent to O’Town Watersports and a copy is on its way to {signer.email}.</p>
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
          <h2 id="ws-title" className="display display--md">Sign the waiver in 3 minutes.</h2>
          <p>No printing. Fill in your details, initial each section, sign with your finger and you’re done. O’Town gets your signed copy instantly and you get one by email.</p>
        </div>

        <fieldset className="chips">
          <legend>Who is riding?</legend>
          <div className="chips__row">
            {([["adult", "Just me (18+)"], ["minor", "My child(ren) under 18"], ["both", "Me and my child(ren)"]] as [Kind, string][]).map(([k, l]) => (
              <label key={k} className="chip"><input type="radio" name="kind" checked={kind === k} onChange={() => setKind(k)} /><span>{l}</span></label>
            ))}
          </div>
        </fieldset>

        <div className="inquiry__grid">
          <label className="field"><span>{kind === "adult" ? "Your full name" : kind === "minor" ? "Parent / guardian full name" : "Your full name (parent / guardian)"}</span>
            <input autoComplete="name" value={signer.name} onChange={(e) => setSigner({ ...signer, name: e.target.value })} required /></label>
          {kind !== "minor" && (
            <label className="field"><span>Your date of birth</span>
              <input type="date" max={today()} value={signer.dob} onChange={(e) => setSigner({ ...signer, dob: e.target.value })} required /></label>
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
                <label className="field"><span>Date of birth{minors.length > 1 && <button type="button" className="ws__remove" onClick={() => setMinors(minors.filter((_, j) => j !== i))}>Remove</button>}</span>
                  <input type="date" max={today()} value={m.dob} onChange={(e) => setMinors(minors.map((x, j) => (j === i ? { ...x, dob: e.target.value } : x)))} required /></label>
              </div>
            ))}
            {minors.length < 6 && <button type="button" className="u-link u-link--light ws__add" onClick={() => setMinors([...minors, { name: "", dob: "" }])}>+ Add another child</button>}
          </div>
        )}

        <div className="inquiry__grid">
          <label className="field"><span>Emergency contact name</span>
            <input value={emergency.name} onChange={(e) => setEmergency({ ...emergency, name: e.target.value })} required /></label>
          <label className="field"><span>Emergency contact phone</span>
            <input type="tel" value={emergency.phone} onChange={(e) => setEmergency({ ...emergency, phone: e.target.value })} required /></label>
        </div>

        <div className="ws__doc" tabIndex={0} aria-label="Waiver text">
          {pages.map((p, pi) => (
            <div key={pi} className="ws__page">
              {p.title.map((t) => <p key={t} className="ws__title">{t}</p>)}
              {p.blocks.map((b, bi) =>
                b.t === "h" ? <h3 key={bi}>{b.text}</h3>
                : b.t === "li" ? <p key={bi} className="ws__li">{b.text}</p>
                : (
                  <div key={bi}>
                    <p>{b.text}</p>
                    {b.initial && (
                      <label className="ws__init">
                        <span>Initials{b.initial === "M" ? " (minor release)" : ` (section ${b.initial})`}</span>
                        <input maxLength={4} autoCapitalize="characters" value={initials[b.initial] || ""}
                          onChange={(e) => setInitials({ ...initials, [b.initial!]: e.target.value.toUpperCase() })} required />
                      </label>
                    )}
                  </div>
                ),
              )}
            </div>
          ))}
        </div>

        <div className="ws__sign">
          <p className="ws__label">{kind === "adult" ? "Your signature" : "Parent / guardian signature"}</p>
          <SignaturePad onChange={setSig} />
        </div>

        <label className="ws__check"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>I have read this entire agreement, initialed each section, understand that I am giving up legal rights, and agree to be bound by it{kind !== "adult" ? ", and I am the natural guardian of the child(ren) listed" : ""}.</span></label>
        <label className="ws__check"><input type="checkbox" checked={esign} onChange={(e) => setEsign(e.target.checked)} />
          <span>I agree to sign electronically. My electronic signature has the same effect as a handwritten one.</span></label>

        <input ref={hp} name="website" tabIndex={-1} autoComplete="off" className="ws__hp" aria-hidden />

        <div className="inquiry__foot">
          <button className="btn btn--primary btn--pill btn--lg" type="submit" disabled={state === "sending" || ready === null}>
            {state === "sending" ? "Signing…" : "Sign waiver"} <span aria-hidden>→</span>
          </button>
          {error && <p className="ws__error" role="alert">{error}</p>}
        </div>
      </form>
    </section>
  );
}
