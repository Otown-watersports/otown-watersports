import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/archivo/wdth.css";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import SmoothAnchors from "@/components/layout/SmoothAnchors";
import Reveal from "@/components/ui/Reveal";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://otownwatersports.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "O’Town Watersports | Wakeboard & Wakesurf Lessons in Orlando, FL",
  description:
    "Wakeboarding in Orlando: private wakeboard and wakesurf lessons with pro coach Glen Fletcher on Lake Barton. One-to-one coaching, camps and overnight stays for beginners to pros, every week of the year.",
  keywords: ["wakeboarding Orlando", "wakeboard lessons Orlando", "wakesurf lessons Orlando", "wakeboard school Florida", "wakeboard camp Orlando", "learn to wakeboard", "wakeboard coaching", "Glen Fletcher", "Lake Barton", "O’Town Watersports", "Supra SL 450", "Meagan Ethell", "Rusty Malinoski", "Jamie Huser", "Camden Marsden"],
  openGraph: {
    title: "O’Town Watersports",
    description: "Wakeboard and wakesurf coaching on Lake Barton, Orlando.",
    siteName: "O’Town Watersports",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["SportsActivityLocation", "LocalBusiness"],
      "@id": `${SITE}/#business`,
      name: "O’Town Watersports",
      description: "Private wakeboard and wakesurf coaching with Glen Fletcher on Lake Barton, Orlando. Camps and overnight stays on site.",
      areaServed: { "@type": "City", name: "Orlando" },
      knowsAbout: ["Wakeboarding", "Wakesurfing", "Wakeboard coaching"],
      url: SITE,
      image: `${SITE}/opengraph-image.jpg`,
      logo: `${SITE}/brand/otown-logo-solid.png`,
      telephone: "+1-407-529-7727",
      email: "info@otownwatersports.com",
      priceRange: "$175–$450",
      address: { "@type": "PostalAddress", streetAddress: "5220 E Colonial Dr", addressLocality: "Orlando", addressRegion: "FL", postalCode: "32807", addressCountry: "US" },
      hasMap: "https://www.google.com/maps/search/?api=1&query=5220+E+Colonial+Dr,+Orlando,+FL+32807",
      sameAs: ["https://www.instagram.com/fletcherotown/", "https://www.facebook.com/otownwatersports/"],
      employee: { "@id": `${SITE}/#glen` },
      makesOffer: [
        { "@type": "Offer", name: "1 set, 30 minute wakeboard or wakesurf lesson", price: "175", priceCurrency: "USD" },
        { "@type": "Offer", name: "Full day: two 45 minute sessions, trampoline and video review", price: "450", priceCurrency: "USD" },
      ],
    },
    { "@type": "Person", "@id": `${SITE}/#glen`, name: "Glen Fletcher", jobTitle: "Head wakeboard coach", worksFor: { "@id": `${SITE}/#business` }, sameAs: ["https://www.instagram.com/fletcherotown/"] },
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: "O’Town Watersports", publisher: { "@id": `${SITE}/#business` } },
  ],
};

export const viewport: Viewport = { themeColor: "#0B1116", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <SmoothAnchors />
        <Reveal />
      </body>
    </html>
  );
}
