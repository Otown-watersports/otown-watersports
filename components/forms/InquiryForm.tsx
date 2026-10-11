"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { contact } from "@/content/site";

const activities = [
  { value: "first-session", label: "First session" },
  { value: "coaching", label: "Coaching" },
  { value: "wakesurf", label: "Wakesurf" },
  { value: "training-stay", label: "Training stay" },
  { value: "other", label: "Group / other" },
];
const levels = ["Never ridden", "Beginner", "Intermediate", "Advanced", "Pro"];

/** Sends the inquiry through the site (POST /api/inquiry). If that is ever unavailable it falls back to the visitor's own mail app. */
export default function InquiryForm() {
  const [activity, setActivity] = useState("first-session");
  const [level, setLevel] = useState("Beginner");
  const [status, setStatus] = useState<"idle" | "invalid" | "sending" | "sent" | "opened" | "error">("idle");
  const [msg, setMsg] = useState("");
  const hp = useRef<HTMLInputElement>(null);
  const [first, setFirst] = useState("");
  const sentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== "sent") return;
    const el = sentRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const top = el.getBoundingClientRect().top;
    if (top < 80 || top > window.innerHeight * 0.6) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [status]);
  const params = useSearchParams();

  useEffect(() => {
    const a = params.get("activity");
    if (a && activities.some((x) => x.value === a)) setActivity(a);
  }, [params]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { setStatus("invalid"); form.reportValidity(); return; }
    const f = new FormData(form);
    const data = {
      activity, level,
      name: String(f.get("name") ?? ""), email: String(f.get("email") ?? ""),
      dates: String(f.get("dates") ?? ""), message: String(f.get("message") ?? ""),
      website: hp.current?.value ?? "",
    };
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { setFirst(data.name.trim().split(/\s+/)[0] ?? ""); form.reset(); setActivity("first-session"); setLevel("Beginner"); setStatus("sent"); return; }
      if (res.status === 400) { setMsg(((await res.json().catch(() => ({}))) as { error?: string }).error ?? ""); setStatus("invalid"); return; }
      throw new Error("unavailable");
    } catch {
      const lines = [
        `Name: ${data.name}`, `Email: ${data.email}`,
        `Interested in: ${activities.find((a) => a.value === activity)?.label}`, `Riding level: ${level}`,
        `Preferred dates: ${data.dates}`,
        data.message ? `\nWhat I'd like to work on:\n${data.message}` : "",
      ].filter(Boolean);
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`Session inquiry: ${data.name}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
      setStatus("opened");
    }
  }

  if (status === "sent") {
    return (
      <div className="inquiry-sent" ref={sentRef} tabIndex={-1} role="status" aria-live="polite">
        <svg className="inquiry-sent__icon" viewBox="0 0 80 80" width="88" height="88" aria-hidden>
          <circle className="inquiry-sent__ring" cx="40" cy="40" r="36" fill="none" strokeWidth="3" />
          <path className="inquiry-sent__plane" d="M20 42 58 24 46 58 38 46 20 42Z M38 46 58 24" fill="none" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <p className="eyebrow eyebrow--cyan inquiry-sent__eyebrow">Message sent</p>
        <h3 className="display display--md inquiry-sent__title">Thanks{first ? `, ${first}` : ""}!</h3>
        <p className="inquiry-sent__text">Your inquiry is on its way to Glen and the team. We’ll email you soon to confirm a time.</p>
        <p className="inquiry-sent__text inquiry-sent__text--soft">Need us sooner? Call <a href={contact.phone.href}>{contact.phone.label}</a>.</p>
        <button type="button" className="btn btn--outline-light btn--pill inquiry-sent__again" onClick={() => setStatus("idle")}>Send another inquiry</button>
      </div>
    );
  }

  return (
    <form className="inquiry" onSubmit={onSubmit} noValidate>
      <fieldset className="chips">
        <legend>I’m interested in</legend>
        <div className="chips__row">
          {activities.map((a) => (
            <label key={a.value} className="chip">
              <input type="radio" name="activity" value={a.value} checked={activity === a.value} onChange={() => setActivity(a.value)} />
              <span>{a.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="chips">
        <legend>My riding level</legend>
        <div className="chips__row">
          {levels.map((l) => (
            <label key={l} className="chip">
              <input type="radio" name="level" value={l} checked={level === l} onChange={() => setLevel(l)} />
              <span>{l}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="inquiry__grid">
        <label className="field"><span>Name</span><input name="name" autoComplete="name" required placeholder="Your name" /></label>
        <label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" required placeholder="you@email.com" /></label>
        <label className="field field--full"><span>Preferred dates</span><input name="dates" required placeholder="e.g. 12 to 14 March, mornings" /></label>
        <input ref={hp} name="website" tabIndex={-1} autoComplete="off" className="ws__hp" aria-hidden />
        <label className="field field--full"><span>What are you working on? <em>optional</em></span><textarea name="message" rows={3} placeholder="Getting up for the first time, a 180, your first invert…" /></label>
      </div>

      <div className="inquiry__foot">
        <button type="submit" className="btn btn--primary btn--pill btn--lg" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send inquiry"}
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
        </button>
        <p className="inquiry__note">We’ll reply by email to confirm availability.</p>
      </div>
      <p className="inquiry__status" role="status" aria-live="polite">
        {status === "invalid" && (msg || "Please add your name, a valid email and your preferred dates.")}
        {status === "opened" && <>Your email app should now be open. Nothing happened? Email <a href={`mailto:${contact.email}`}>{contact.email}</a>.</>}
      </p>
    </form>
  );
}
