## Problem

Your screenshot shows the iMessage / social link preview for `supplyministry.com.au`. It's still rendering the **old branding**:

- Old logo mark (the purple cube-and-arrows icon)
- Old tagline lockup ("Assistive Technology, Simplified / For OTs, Case Managers & Care Teams / supplyministry.com.au")
- White background

The site itself has since moved to the new identity: the **dome / figure mark** with the bold deep-purple "Supply Ministry" wordmark on a **cream background**.

The preview is driven by a single file: **`public/og-image.jpg`** (1536×1024 today, declared as 1200×630 in the meta tags). Every social platform (iMessage, Slack, WhatsApp, LinkedIn, Facebook, X) reads this file to build the link card. As long as it shows the old mark, every shared link will look out of date, regardless of how good the live site looks.

`index.html` and `src/components/SEO.tsx` already reference `https://www.supplyministry.com.au/og-image.jpg` correctly — no markup change is required. Only the image asset needs to be replaced.

## Plan

### 1. Generate a new `og-image.jpg` matching current branding
- **Dimensions:** exactly **1200 × 630 px** (the standard OG/Twitter card size — fixes the current 1536×1024 mismatch with the declared meta dimensions).
- **Background:** brand cream (`#F4EFE6`) to match the site shell and the new logo's native canvas.
- **Logo:** the new Supply Ministry horizontal lockup (dome + figure mark + bold purple "Supply Ministry" wordmark). Source: `public/Supply_Ministry_logo_new.png` (or `Supply_Ministry_horizontal_new.svg` if it renders cleanly).
- **Wordmark/tagline (below logo, brand purple `#5E45FF`):**
  - Headline: **"Assistive Technology, Simplified"** (Geist, semibold)
  - Subline: **"For OTs, Case Managers & Care Teams"** (Geist, regular, smaller, slightly muted purple)
  - Footer line: **"supplyministry.com.au"** (Geist, smaller, muted)
- **Composition:** logo top-third, taglines centered in lower two-thirds, generous padding so nothing gets clipped by Twitter's rounded corners or iMessage's edge crop.
- **No em dashes** anywhere in the copy (per project policy).

The image will be generated via a Python/Pillow script in `/tmp`, written directly to `public/og-image.jpg` as a high-quality JPEG (~85% quality, sRGB).

### 2. QA the result
- Convert the generated JPG to a preview image and inspect it before considering the task done.
- Verify: dimensions = 1200×630, file size reasonable (<400 KB), text is legible, logo is sharp, brand colors correct, no clipping, no em dashes.

### 3. Add a cache-busting query string to the meta tags
Social platforms (especially iMessage, WhatsApp, Facebook) cache OG images aggressively — sometimes for weeks. To force a re-fetch on next share:
- Update `index.html`: change `og:image` and `twitter:image` URLs to `…/og-image.jpg?v=2`
- Update `src/components/SEO.tsx`: change `DEFAULT_OG_IMAGE` constant to the same `?v=2` URL

This guarantees all newly-shared links pull the new image immediately.

### 4. Note about already-shared links
The preview in your screenshot is from a previously-shared message. Apple/iMessage caches that locally per-conversation and **will not** refresh it just because we updated the file. Once published with the new image + cache-buster, **a fresh share of the link in a new message** will show the updated card. We'll call this out explicitly so you know what to expect.

### 5. Publish reminder
The OG image is served from the live custom domain (`www.supplyministry.com.au`). After the change, you'll need to **Publish** the project so social scrapers can fetch the new file from production.

## Files to change

- `public/og-image.jpg` — replaced with new 1200×630 branded image
- `index.html` — bump OG/Twitter image URL to `?v=2`
- `src/components/SEO.tsx` — bump `DEFAULT_OG_IMAGE` to `?v=2`

## Out of scope

- Favicon (separate, already handled)
- Any layout/copy changes to the live site
- Per-page custom OG images (the global default covers your current need)
