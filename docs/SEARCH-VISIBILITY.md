# Search visibility follow-up

The site already exports readable HTML, canonical URLs, robots.txt, a sitemap,
and business structured data. None of these guarantees inclusion in an AI answer.

## Owner account steps after deployment

1. Verify `otownwatersports.com` in Google Search Console and Bing Webmaster Tools.
   Submit `https://otownwatersports.com/sitemap.xml` in each.
2. In Search Console, inspect `/` and `/coaching`. Confirm the selected canonical
   matches the live domain, check the rendered page, and request indexing after
   publishing. Use the actual inspection result to diagnose exclusions.
3. Confirm the Google Business Profile links to this domain and uses the same
   O’Town Watersports name, address and phone number displayed on the site.
4. If a crawler receives a challenge or 403, inspect Cloudflare security events
   for that request. The permissive robots.txt does not override firewall rules.
   Do not disable site-wide security or allow unverified bots based only on a
   claimed user agent.
5. Track non-brand impressions and clicks for Orlando wakeboard/wakesurf lessons
   in Search Console. Compare equivalent periods after recrawling; a single AI
   response is not a reliable visibility measurement.

## Content maintenance

- Edit coaching questions in `content/site.ts` (`lessonFaqs`). The visible answers
  and FAQ structured data share this source. FAQ markup describes the page; it
  does not promise a Google rich result or an AI recommendation.
- Keep prices, contact details and business structured data consistent when they
  change. Do not add unsupported ratings, awards, opening hours or availability.
- Existing service URLs should be improved before adding near-duplicate pages
  targeting spelling variants of the same search.

References:
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/monitor-debug/search-console-start
