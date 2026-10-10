# O'Town Watersports: website

Website for O'Town Watersports: Glen Fletcher's wakeboard and wakesurf coaching on Lake Barton, Orlando.
Live at **https://otownwatersports.com**. Built with Next.js (static export) and hosted free on Cloudflare.

## Editing content (no code needed)
| What | File |
|---|---|
| Contact, Glen's bio, rates, experiences, boat, rider list and order | `content/site.ts` |
| Rider bios | `content/riderBios.ts` |
| Rider results (with sources) | `content/riderResults.ts` |
| Photos and videos | `public/` (see below) |

Commit to `main` and Cloudflare rebuilds and publishes in about 3 minutes.

## Folder map
```
app/                  pages (one folder per URL) + globals.css (all styling)
  page.tsx            home
  athletes/           /athletes and /athletes/[rider]
  coaching/ rates/ stay/ plan/ waiver/
components/
  layout/             header, footer, smooth anchor scrolling
  home/               hero slider, 360° boat viewer, boat polaroids
  riders/             rider spotlight, rider carousel
  media/              photo/video gallery viewer, video dialog
  forms/              inquiry form, waiver document, print button
  ui/                 small effects: reveal on scroll, magnetic buttons, accordion
content/              all text and facts (edit here, not in components)
lib/                  image URL helper, Instagram feed
scripts/              build-images.mjs: makes resized WebP copies of every photo
public/               original photos, videos, boat frames, waiver PDF
  _headers            browser caching rules (Cloudflare)
  _redirects          old WordPress URLs → new pages
docs/ASSETS.md        where each photo came from and permission to publish
wrangler.jsonc        Cloudflare settings
```

## How images work
Put original photos in `public/` and reference them as `/images/name.jpg`.
At build time `scripts/build-images.mjs` creates WebP versions at 7 widths in `public/_img/` (not committed).
Pages automatically load the right size for each screen. Those files are cached for a year.

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # builds the static site into out/
```

## Hosting
- **Site:** Cloudflare Workers (static assets), account info@otownwatersports.com. Build `npm run build`, deploy `npx wrangler deploy`.
- **Domain:** registered at Register.com (Network Solutions); nameservers point to Cloudflare. All DNS is managed in Cloudflare.
- **Email:** currently hosted at GreenGeeks (`mail.otownwatersports.com`). The MX record points there.

## Design system
- Colours from the O'Town neon sign: Ink `#0B1116`, Neon cyan `#22C7E8`, Electric blue `#2B7DE9`, Pearl `#F4F2EE`, Stone `#E9E5DD`
- Type: Archivo condensed (headings) + Manrope (text), self-hosted
