import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MediaGallery from "@/components/media/MediaGallery";
import VideoDialog from "@/components/media/VideoDialog";
import { contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Stay at O’Town | Wakeboard Camps & Overnight Stays in Orlando",
  description: "Stay on Lake Barton for a wakeboard camp or training stay with Glen Fletcher: stocked kitchen, laundry, high speed Wi-Fi and supervision for young riders. Tailored to your dates.",
  alternates: { canonical: "/stay" },
};

type Amenity = { t: string; d: string; img?: string; alt?: string; pos?: string; icon?: React.ReactNode; cls: string };

const I = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
);

const amenities: Amenity[] = [
  { cls: "amen--rooms", t: "Rooms on the lake", d: "Bedrooms in the house on Lake Barton, including bunks for teams and camps.", img: "/images/new/stay-bunks.jpg", alt: "Bunk beds in a bright room at O’Town", pos: "50% 40%" },
  { cls: "amen--kitchen", t: "Stocked kitchen", d: "We stock the kitchen around your preferences and allergies. Meals aren’t cooked for you, so you cook what you like, when you like.", img: "/images/new/stay-kitchen.jpg", alt: "The kitchen at O’Town with fridge, oven and counters", pos: "50% 60%" },
  { cls: "amen--minors", t: "Supervision for minors", d: "Parents can send young riders to train. Riders under 18 are supervised during their stay.",
    icon: <I><path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></I> },
  { cls: "amen--laundry", t: "Washer and dryer", d: "Laundry on site, so wet gear and riding clothes are never a problem.",
    icon: <I><rect x="4" y="3" width="16" height="18" rx="2.5" /><circle cx="12" cy="13" r="4.5" /><path d="M7.5 6.5h.01M10.5 6.5h.01" /></I> },
  { cls: "amen--wifi", t: "High speed Wi-Fi", d: "Fast internet throughout the house, for school, work or watching back your sets.",
    icon: <I><path d="M2.5 9a14 14 0 0 1 19 0" /><path d="M5.5 12.5a9.5 9.5 0 0 1 13 0" /><path d="M8.7 16a5 5 0 0 1 6.6 0" /><path d="M12 19.5h.01" /></I> },
  { cls: "amen--dock", t: "Steps from the dock", d: "The boat, the dock and the trampoline are right outside. Train, rest, go again.", img: "/images/new/dock-trampoline.jpg", alt: "The dock and trampoline on Lake Barton right outside the house", pos: "50% 82%" },
];


export default function StayPage() {
  return (
    <>
      <section className="stay-hero" aria-labelledby="stay-h1">
        <div className="stay-hero__copy">
          <p className="eyebrow eyebrow--dark">Stay at O’Town</p>
          <h1 id="stay-h1" className="display display--hero display--ink">Wake up<br />on the lake.</h1>
          <p className="stay-hero__lede">Camps and overnight stays, tailored to your needs. Live at O’Town, ride with Glen and train every day on Lake Barton.</p>
          <div className="actions">
            <Link className="btn btn--primary btn--pill btn--lg" href="/plan?activity=training-stay">Send your dates <span aria-hidden>→</span></Link>
            <a className="u-link" href={contact.phone.href}>Call {contact.phone.label}</a>
          </div>
          <ul className="stay-hero__facts">
            <li><b>Camps</b><span>and overnight stays</span></li>
            <li><b>On the lake</b><span>steps from the dock</span></li>
            <li><b>Tailored</b><span>to your dates and level</span></li>
          </ul>
        </div>
        <div className="stay-hero__media">
          <Image src="/images/new/stay-bedroom-lake.jpg" alt="A bright bedroom at O’Town with a window looking straight onto Lake Barton" fill priority quality={85} sizes="(max-width: 900px) 100vw, 55vw" style={{ objectPosition: "60% 45%" }} />
          <span className="stay-hero__tag">Bedroom, lake view</span>
        </div>
      </section>

      <section className="section stay" aria-labelledby="stay-title">
        <div className="wrap">
          <div className="section-head section-head--row">
            <div>
              <p className="eyebrow eyebrow--dark">What’s included</p>
              <h2 id="stay-title" className="display display--lg display--ink">Everything you<br />need between sets.</h2>
            </div>
            <p className="lede lede--narrow">Each stay is built around the rider: your dates, your level and how much time you want on the water.</p>
          </div>
          <ul className="amen">
            {amenities.map((a, i) => (
              <li key={a.t} className={`amen__card ${a.cls}${a.img ? " amen__card--photo" : ""}`}>
                {a.img ? (
                  <div className="amen__media"><Image src={a.img} alt={a.alt ?? ""} fill quality={85} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 40vw" style={{ objectPosition: a.pos }} /></div>
                ) : (
                  <span className="amen__icon">{a.icon}</span>
                )}
                <div className="amen__text">
                  <span className="amen__n">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{a.t}</h3>
                  <p>{a.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="stay-gallery" aria-label="Inside O’Town">
        <div className="wrap">
          <MediaGallery className="sg" items={[
            { kind: "image", cls: "sg__a", src: "/images/new/stay-kitchen-dining.jpg", alt: "The open kitchen and dining area upstairs at O’Town", caption: "Kitchen and dining", sizes: "(max-width: 700px) 100vw, 50vw", position: "50% 55%" },
            { kind: "video", cls: "sg__b", src: "/video/stay-walkthrough.mp4", poster: "/video/stay-walkthrough-poster.jpg", alt: "Walking through the kitchen and lounge at O’Town", caption: "Walk through the house", portrait: true },
            { kind: "image", cls: "sg__c", src: "/images/new/dock-start-rope.jpg", alt: "A rider on the dock with the Supra SL 450 waiting on Lake Barton", caption: "Rope in hand, boat ready", sizes: "(max-width: 700px) 50vw, 25vw", position: "40% 60%" },
            { kind: "image", cls: "sg__d", src: "/images/new/trampoline-flip-2.jpg", alt: "A rider flipping on the lakeside trampoline", caption: "The trampoline on the dock", sizes: "(max-width: 700px) 50vw, 25vw", position: "50% 40%" },
            { kind: "image", cls: "sg__h", src: "/images/new/stay-lounge.jpg", alt: "The living room with sofas, a TV and the dining table", caption: "Living room", sizes: "(max-width: 700px) 100vw, 50vw", position: "50% 55%" },
            { kind: "image", cls: "sg__e", src: "/images/new/tube-ride.jpg", alt: "Friends tubing on Lake Barton", caption: "Tubing on the lake", sizes: "(max-width: 700px) 50vw, 25vw", position: "50% 50%" },
            { kind: "image", cls: "sg__f", src: "/images/games-room.jpg", alt: "The downstairs lounge with a table-tennis table and board racks", caption: "Games room", sizes: "(max-width: 700px) 50vw, 25vw" },
          ]} />
        </div>
      </section>

      <section className="cta-band cta-band--short stay-cta" aria-labelledby="stay-info-title">
        <Image src="/images/new/dock-trampoline.jpg" alt="" fill sizes="(orientation: portrait) 640px, 100vw" quality={85} style={{ objectPosition: "50% 62%" }} />
        <div className="wrap cta-band__inner">
          <p className="eyebrow eyebrow--light">Pricing</p>
          <h2 id="stay-info-title" className="display display--xl">Tailored to<br />your stay.</h2>
          <p className="stay-cta__lede">Every camp and stay is priced around your dates, group size and coaching. Call and we’ll put it together with you.</p>
          <div className="actions">
            <a className="btn btn--primary btn--pill btn--lg" href={contact.phone.href}>Call {contact.phone.label}</a>
            <Link className="u-link u-link--light" href="/plan?activity=training-stay">Send your dates</Link>
          </div>
          <p className="stay-cta__note">Riders under 18 need the <Link href="/waiver">waiver</Link> signed by a parent or guardian before arriving.</p>
        </div>
      </section>
    </>
  );
}
