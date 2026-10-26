import { contact } from "@/content/site";

/**
 * Single source of truth for the digital business card (/card).
 * Drives the visible info, the .vcf, the QR code, metadata and the Wallet pass fields.
 */
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://otownwatersports.com";

export const card = {
  name: "O’Town Watersports",
  nameVcard: "O'Town Watersports",
  tagline: "See you on the water.",
  disciplines: "Wakeboarding • Wakesurfing • Foiling",
  city: "Orlando, FL",
  phoneDisplay: "(407) 529-7727",
  phoneE164: "+14075297727",
  tel: "tel:+14075297727",
  sms: "sms:+14075297727",
  email: contact.email,
  website: "https://www.otownwatersports.com",
  websiteLabel: "www.otownwatersports.com",
  /** Booking button opens a text message to O'Town with a pre-filled note (owner request). Website form alternative: /plan */
  bookingUrl: "sms:+14075297727?&body=Hi%20O%E2%80%99Town!%20I%E2%80%99d%20like%20to%20book%20a%20session.",
  instagram: contact.instagram.href,
  instagramHandle: contact.instagram.label,
  /** TikTok handle supplied by the owner. The URL follows TikTok's standard profile format but has NOT been opened/verified yet. */
  tiktok: { handle: "@otownw", url: "https://www.tiktok.com/@otownw", verified: false },
  address: { street: "5220 E Colonial Dr", city: "Orlando", region: "FL", zip: "32807", country: "USA" },
  /** Area label shown on the card. Repo copy says Lake Barton; the brief says Baldwin Park — confirm with Glen/Melissa. */
  areaLine: "Orlando, FL",
  maps: contact.directions,
  cardUrl: `${SITE}/card`,
  site: SITE,
  share: { title: "O'Town Watersports", text: "Wakeboarding, wakesurfing & foiling in Orlando. See you on the water!" },
  /** Wallet is OFF until real Apple credentials exist as server secrets and a signed endpoint is deployed. See docs/WALLET.md */
  walletEnabled: false,
  walletPassUrl: "/api/wallet/pass",
} as const;
