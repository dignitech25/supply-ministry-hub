
## Update All URLs to www.supplyministry.com.au as Primary Domain

### What this does (non-technical summary)
Right now, all the SEO metadata, social sharing tags, and the sitemap reference `https://supplyministry.com.au` (no `www`). Google treats `supplyministry.com.au` and `www.supplyministry.com.au` as two different websites — so we need to pick one and use it everywhere consistently. We're choosing `https://www.supplyministry.com.au` as the canonical (authoritative) version.

The non-www version will still work — visitors going to `supplyministry.com.au` will be automatically redirected by Lovable to the www version. No broken links, no lost traffic.

### What will NOT be changed
- Email addresses like `alex@supplyministry.com.au` — these are contact details, not website URLs, and should stay as-is
- Links to external services (sleepchoice.com.au, etc.)

---

### Files to Change

**1. `src/components/SEO.tsx`** — The central SEO component used by every page
- Change `SITE_URL` constant from `https://supplyministry.com.au` to `https://www.supplyministry.com.au`
- Change `DEFAULT_OG_IMAGE` from `https://supplyministry.com.au/og-image.jpg` to `https://www.supplyministry.com.au/og-image.jpg`
- Update `organizationSchema` — `url` and `logo` fields

**2. `src/pages/ProductDetail.tsx`** — Has its own local `SITE_URL` constant
- Change `SITE_URL` from `https://supplyministry.com.au` to `https://www.supplyministry.com.au`

**3. `public/sitemap.xml`** — All 6 `<loc>` entries need `www.` prefix added
- Update lastmod dates to today (2026-02-19) while we're here

**4. `index.html`** — Static OG/Twitter meta tags at the top of the HTML file
- `og:url` → `https://www.supplyministry.com.au/`
- `og:image` → `https://www.supplyministry.com.au/og-image.jpg`
- `twitter:image` → `https://www.supplyministry.com.au/og-image.jpg`

**5. `public/robots.txt`** — Sitemap reference URL
- Change `Sitemap: https://supplyministry.com.au/sitemap.xml` → `https://www.supplyministry.com.au/sitemap.xml`

---

### Summary of Impact

| File | Change |
|---|---|
| `src/components/SEO.tsx` | SITE_URL + OG image + organization schema (affects all pages) |
| `src/pages/ProductDetail.tsx` | Local SITE_URL constant |
| `public/sitemap.xml` | All 6 `<loc>` entries + updated lastmod |
| `index.html` | og:url + og:image + twitter:image |
| `public/robots.txt` | Sitemap pointer |

After this, every canonical tag, OG tag, JSON-LD schema, and sitemap entry will consistently signal `www.supplyministry.com.au` as the one true home of the site — which is what Google needs to correctly index and rank it.
