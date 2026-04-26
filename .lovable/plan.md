## Goal
Replace the current favicon (full compass mark with 4 directional arrows) with a cleaner version showing **just the central "person under the arc" figure** extracted from your Supply Ministry logo, served as both SVG and PNG.

## Background
- Current `public/favicon.svg` contains 5 paths: 4 directional arrow shapes forming a compass + 1 central figure (the stylized person/monogram inside the arc).
- The horizontal logo SVGs already contain the same central figure path we need.
- Current `index.html` references `/favicon.svg`, `/favicon.png`, and `/apple-touch-icon` (PNG) with `?v=7` cache-busting.
- Brand purple `#5E45FF` is preserved.

## Implementation Steps

### 1. Generate new `public/favicon.svg`
Create a minimal SVG containing **only the central figure path** from the existing logo (the path with `d="m 303.2602,509.91752 ..."` that draws the stylized figure inside the arc).
- Tight viewBox cropped around just the figure for maximum clarity at 16x16 / 32x32.
- Single `fill="#5E45FF"` path, inline (no `<style>` tag) for reliable favicon rendering.

### 2. Generate new `public/favicon.png` (also serves as Apple touch icon)
Render the new SVG to a 512x512 PNG using rsvg-convert / ImageMagick in the sandbox:
- `public/favicon.png` — 512x512, overwriting the existing file.

### 3. Bump cache-busting version in `index.html`
Update all favicon `?v=7` references to `?v=8` so browsers pick up the new files immediately:
- `<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=8">`
- `<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=8">`
- `<link rel="shortcut icon" href="/favicon.png?v=8">`
- `<link rel="apple-touch-icon" sizes="180x180" href="/favicon.png?v=8">`

### 4. QA
- Render the new favicon.svg to a 32x32 preview and visually inspect that the figure reads clearly at small size (not muddy or cropped).
- Verify the 512x512 PNG renders cleanly.
- Confirm all 4 `index.html` link tags are updated.

## Files Changed
- `public/favicon.svg` — replaced with figure-only mark
- `public/favicon.png` — re-rendered from new SVG at 512x512
- `index.html` — cache-bust `v=7` → `v=8` (4 link tags)

## Out of Scope
- Changing the in-app header logo (still uses `Supply_Ministry_logo_new_cropped.png`).
- Adding extra favicon sizes (16x16, 192x192) — SVG + single PNG covers all modern browsers and iOS.
- Updating OG / Twitter share images.