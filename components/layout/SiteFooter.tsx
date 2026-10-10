import Link from "next/link";
import { contact } from "@/content/site";

const pages = [
  { label: "Coaching", href: "/coaching" },
  { label: "Rates", href: "/rates" },
  { label: "Athletes", href: "/athletes" },
  { label: "Stay at O’Town", href: "/stay" },
  { label: "Waiver", href: "/waiver" },
  { label: "Plan your session", href: "/plan" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p className="site-footer__big" aria-label="Learn. Ride. Progress.">Learn. Ride. <span>Progress.</span></p>

        <div className="site-footer__grid">
          <div className="site-footer__brandcol">
            <p className="eyebrow">O’Town Watersports</p>
            <p className="site-footer__tag">Wakeboard &amp; wakesurf coaching with Glen Fletcher on Lake Barton, Orlando.</p>
            <div className="site-footer__quick">
              <a className="btn btn--ink btn--pill" href={contact.phone.href}>Call</a>
              <a className="btn btn--outline btn--pill" href={`mailto:${contact.email}`}>Email</a>
            </div>
          </div>

          <nav className="site-footer__col" aria-label="Footer">
            <p className="eyebrow">Explore</p>
            <ul>{pages.map((p) => <li key={p.href}><Link href={p.href}>{p.label}</Link></li>)}</ul>
          </nav>

          <div className="site-footer__col">
            <p className="eyebrow">Contact</p>
            <ul>
              <li><a href={contact.phone.href}>{contact.phone.label}</a></li>
              <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
            </ul>
          </div>

          <div className="site-footer__col">
            <p className="eyebrow">Visit</p>
            <address>{contact.address}</address>
            <ul>
              <li><a href={contact.directions} target="_blank" rel="noreferrer">Get directions ↗</a></li>
            </ul>
            <p className="eyebrow site-footer__follow">Follow</p>
            <ul className="site-footer__social">
              <li><a href={contact.instagram.href} target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href={contact.facebook.href} target="_blank" rel="noreferrer">Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="site-footer__base">
          <span>© {new Date().getFullYear()} O’Town Watersports</span>
          <span>Lake Barton, Orlando · Open every week of the year</span>
          <a className="site-footer__credit" href="https://amkcode.app" target="_blank" rel="noopener">Site by <b>AMK.code</b></a>
        </div>
      </div>
    </footer>
  );
}
