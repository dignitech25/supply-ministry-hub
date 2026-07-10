## What's actually happening

The site's `public/favicon.png` is already the Supply Ministry purple arc/figure mark, not Lovable. Two things are going wrong on Google:

1. **Google caches favicons aggressively.** Search result icons are refreshed on Google's schedule (often weeks). If the site went live with the default Lovable heart icon and the favicon was replaced later, the old icon can linger in SERPs until Google re-crawls `/favicon.ico`. There is no "force refresh" button for this.
2. **The current favicon has heavy whitespace padding.** The PNG contains the arc mark inside a large empty margin, so at 16–32 px in a browser tab or Google result, the actual glyph is tiny and visually weak, which is likely why it still reads as "not a real brand icon."

## Plan

1. Generate a new tightly cropped favicon (full-bleed purple mark on a solid brand background, no whitespace padding, square, 512×512) and write it to `public/favicon.png`, replacing the current padded version.
2. Also write it out as `public/favicon.ico` so the legacy `/favicon.ico` request (which Google's crawler and some browsers still hit) serves the Supply Ministry mark instead of falling through to a default.
3. Update `index.html` to reference both, bump the cache-buster query, and add an explicit `apple-touch-icon` at the same crop.
4. Leave the rest of the head, OG image, and logo assets untouched.

## Files touched

- `public/favicon.png` — replaced (tight crop, no padding)
- `public/favicon.ico` — new (same mark, multi-size ICO)
- `index.html` — icon `<link>` tags updated with new `?v=` and an `image/x-icon` link for `.ico`

## What the user should expect after deploy

- Browser tab icon and iOS home-screen icon update immediately after publish (hard refresh may be needed once).
- Google search result favicon updates only when Googlebot next re-crawls the site — typically days to a few weeks. There is no way to force it; requesting re-indexing in Search Console for the homepage is the closest lever, and I can trigger that via the connected Search Console once the favicon is live.
