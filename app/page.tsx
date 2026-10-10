import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/home/HeroSlider";
import RiderSpotlight from "@/components/riders/RiderSpotlight";
import BoatViewer from "@/components/home/BoatViewer";
import BoatPolaroids from "@/components/home/BoatPolaroids";
import MediaGallery from "@/components/media/MediaGallery";
import { boat, contact, experiences, glen } from "@/content/site";
import { getLatestReels } from "@/lib/instagram";
import { imgUrl } from "@/lib/img";

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
);

export const dynamic = "force-static";

export default async function Home() {
  const reels = await getLatestReels(6);
  const boatLabel = `the O’Town ${boat.make}${boat.model ? ` ${boat.model}` : ""}`;

  return (
    <>
      <HeroSlider />

      {/* Statement */}
      <section className="statement" aria-label="About O’Town">
        <div className="wrap statement__grid">
          <h2 className="display display--xl" data-reveal>Beginners welcomed.<br /><span className="accent">Pros challenged.</span></h2>
          <div className="statement__side" data-reveal>
            <p className="lede">
              O’Town is a private coaching school on Lake Barton in downtown Orlando. One boat, one coach, one rider at a time: on the water, on the trampoline and in video review.
            </p>
            <dl className="facts">
              <div><dt>20+</dt><dd>years of coaching</dd></div>
              <div><dt>1:1</dt><dd>sessions, by appointment</dd></div>
              <div><dt>365</dt><dd>days a year on the lake</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* Glen */}
      <section className="glen" id="glen" aria-labelledby="glen-title">
        <div className="glen__copy wrap-left" data-reveal>
          <p className="eyebrow eyebrow--dark">{glen.role}</p>
          <h2 id="glen-title" className="display display--name display--ink">Glen<br />Fletcher</h2>
          <ul className="dash-list dash-list--ink">
            {glen.points.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <p className="glen__aside">{glen.aside}</p>
          <div className="actions">
            <Link href="/coaching" className="btn btn--ink btn--pill btn--lg">Coaching with Glen <Arrow /></Link>
            <a className="u-link" href={contact.instagram.href} target="_blank" rel="noreferrer">{contact.instagram.label}</a>
          </div>
        </div>
        <div className="glen__media">
          <Image src="/images/glen-helm.jpg" alt="Glen Fletcher at the helm, handle in hand, watching the lake" fill quality={85} sizes="(max-width: 900px) 100vw, 55vw" />
          <figure className="glen__inset">
            <Image src="/images/glen-driving.jpg" alt="Glen driving the boat, looking back toward his rider" fill quality={85} sizes="280px" />
            <figcaption>Every set, from the driver’s seat.</figcaption>
          </figure>
        </div>
      </section>

      <RiderSpotlight />

      {/* Experiences — expanding panels */}
      <section className="experiences section" id="experiences" aria-labelledby="exp-title">
        <div className="wrap">
          <div className="section-head section-head--row" data-reveal>
            <div>
              <p className="eyebrow eyebrow--dark">Experiences</p>
              <h2 id="exp-title" className="display display--lg display--ink">Where would you<br />like to start?</h2>
            </div>
            <Link href="/rates" className="u-link">See rates &amp; booking policy</Link>
          </div>
          <div className="xp">
            {experiences.map((x) => (
              <article key={x.key} className="xp__panel" tabIndex={0}>
                <Image src={x.image} alt={x.alt} fill quality={85} sizes="(max-width: 900px) 100vw, 60vw" style={{ objectPosition: x.position }} />
                <div className="xp__shade" aria-hidden />
                <span className="xp__index">{x.index}</span>
                <h3 className="xp__title">{x.title}</h3>
                <div className="xp__body">
                  <h3 className="xp__title-m">{x.title}</h3>
                  <p className="xp__who">{x.who}</p>
                  <p>{x.body}</p>
                  {x.key === "training-stay"
                    ? <Link href="/stay" className="btn btn--primary btn--pill">See the stay <Arrow /></Link>
                    : <Link href={`/plan?activity=${x.key}`} className="btn btn--primary btn--pill">Ask about this <Arrow /></Link>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Boat */}
      <section className="boat" aria-labelledby="boat-title">
        <div className="wrap">
          <div className="boat__head" data-reveal>
            <div>
              <p className="eyebrow eyebrow--cyan">New for {boat.year} · {boat.make} {boat.model}</p>
              <h2 id="boat-title" className="display display--lg">A brand new boat.<br />Experienced hands.</h2>
            </div>
            <p className="boat__copy">
              O’Town now rides behind a new {boat.year} {boat.make} {boat.model}: a clean, consistent wake to learn and progress on. What matters just as much is who’s driving: speed, line length and timing, tuned to the rider behind the boat.
            </p>
          </div>
          <div className="boat__row">
            <div className="boat__viewer">
              <BoatViewer frames={boat.frames} label={boatLabel} />
            </div>
            <BoatPolaroids />
          </div>
          <div className="boat__foot">
            <p>Proudly riding behind a {boat.year} {boat.make}{boat.model ? ` ${boat.model}` : ""}.</p>
            <a className="btn btn--glass btn--pill" href={boat.link} target="_blank" rel="noreferrer">
              Explore the {boat.make}{boat.model ? ` ${boat.model}` : ""} <Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* Life at O'Town — bento */}
      <section className="life section" id="life" aria-labelledby="life-title">
        <div className="wrap">
          <div className="section-head section-head--row" data-reveal>
            <div>
              <p className="eyebrow eyebrow--dark">Life at O’Town</p>
              <h2 id="life-title" className="display display--lg display--ink">Between sets.</h2>
            </div>
            <p className="lede lede--narrow">The dock, the trampoline, the house on the lake, and whoever’s riding next.</p>
          </div>
          <MediaGallery className="bento" items={[
            { kind: "image", cls: "bento__a", src: "/images/dock-bougainvillea.jpg", alt: "Bougainvillea over the trampoline and dock, riders sitting at the water’s edge, the boat moored", caption: "The dock and the trampoline", sizes: "(max-width: 900px) 100vw, 50vw", position: "50% 62%" },
            { kind: "video", cls: "bento__b", src: "/video/stay-walkthrough.mp4", poster: "/video/stay-walkthrough-poster.jpg", alt: "The open kitchen and lounge upstairs at O’Town", caption: "Inside the house", portrait: true },
            { kind: "image", cls: "bento__c", src: "/images/tubing.jpg", alt: "Two friends laughing on a tube on the lake", caption: "Tubing off the back of the boat", sizes: "(max-width: 900px) 50vw, 25vw", position: "50% 45%" },
            { kind: "image", cls: "bento__d", src: "/images/games-room.jpg", alt: "The downstairs lounge with a table-tennis table and board racks", caption: "Downstairs lounge", sizes: "(max-width: 900px) 50vw, 25vw" },
            { kind: "video", cls: "bento__e", src: "/video/clip-dock.mp4", poster: "/video/clip-dock-poster.jpg", alt: "Palm trees opening onto the dock and Lake Barton", caption: "Out the back door" },
            { kind: "image", cls: "bento__f", src: "/images/dock-guitar.jpg", alt: "An acoustic guitar on the dock at sunrise, the trampoline and boat beyond", caption: "Mornings on the dock", sizes: "(max-width: 900px) 50vw, 25vw", position: "50% 50%" },
            { kind: "video", cls: "bento__g", src: "/video/clip-riding-2.mp4", poster: "/video/clip-riding-2-poster.jpg", alt: "A rider grabbing the board high above the wake", caption: "Another set", position: "50% 42%" },
          ]} />
        </div>
      </section>

      {/* Instagram */}
      <section className="ig" aria-labelledby="ig-title">
        <div className="wrap ig__head">
          <h2 id="ig-title" className="display display--md display--ink">Latest from the lake</h2>
          <a className="u-link" href={contact.instagram.href} target="_blank" rel="noreferrer">Follow {contact.instagram.label}</a>
        </div>
        <ul className="ig__rail">
          {reels.map((p) => (
            <li key={p.id}>
              <a href={p.href} target="_blank" rel="noreferrer" className="ig__card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgUrl(p.image, 384)} alt="" loading="lazy" width={360} height={640} />
                <span className="ig__cap">{p.caption}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Closing call to action */}
      <section className="cta-band" aria-labelledby="cta-title">
        <Image src="/images/bg-bec-boat.jpg" alt="" fill sizes="(orientation: portrait) 640px, 100vw" quality={85} style={{ objectPosition: "50% 62%" }} />
        <div className="wrap cta-band__inner">
          <h2 id="cta-title" className="display display--xl">Your next set<br />starts here.</h2>
          <div className="actions">
            <Link href="/plan" className="btn btn--primary btn--pill btn--lg">Plan your session <Arrow /></Link>
            <Link href="/rates" className="btn btn--glass btn--pill btn--lg">See rates</Link>
          </div>
        </div>
      </section>
    </>
  );
}
