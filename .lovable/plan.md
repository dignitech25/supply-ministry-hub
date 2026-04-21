

# Switch product titles from Fraunces to Geist

Use Geist for product titles so technical names like "Pride Pathrider 10 Deluxe Scooter" read cleanly. Reserve Fraunces for hero/section headlines and the gold-italic accent word.

## Changes

### `src/components/FeaturedProducts.tsx`
- Product card title `<h3>`: `font-fraunces` → `font-geist font-medium tracking-tight text-ink`
- Price line: `font-fraunces` → `font-geist font-medium` (keeps numerals tidy; "From" stays in same family)
- Section heading ("Featured *products*") stays Fraunces — unchanged.

### `src/components/ProductCard.tsx`
- Product title `<h3>`: keep current size, swap to `font-geist font-medium tracking-tight text-ink`
- Price block: switch the bold price line to `font-geist font-semibold text-ink` (drop the `text-supply-lavender` purple — replace with `text-ink`).

### `src/pages/Products.tsx`
- Any product card title rendered inline on the catalogue grid: same swap to `font-geist font-medium tracking-tight`.
- Filter labels and facet headings stay as they are.

### `src/pages/ProductDetail.tsx`
- Product `<h1>` title: `font-fraunces` → `font-geist font-medium tracking-tight text-ink` (size unchanged).
- Price display: `font-geist font-semibold text-ink`.
- Section sub-headings on the PDP ("Specifications", "Description", etc.) stay Fraunces light — they're editorial section headers, not product names.

## Out of scope

- `EditorialHero.tsx`, `EditorialNavigation.tsx`, `SupplierStrip.tsx`, `TrustBar.tsx`
- All section-level h2 headings (stay Fraunces light with the gold-italic accent)
- Footer, FAQ, About, Sleep Choice, Testimonials headings
- Buttons, eyebrows, body copy (already Geist/Inter)
- Routing, Supabase, quote system

## Files touched

- `src/components/FeaturedProducts.tsx`
- `src/components/ProductCard.tsx`
- `src/pages/Products.tsx`
- `src/pages/ProductDetail.tsx`

## Verification

- "Pride Pathrider 10 Deluxe Scooter" and other product names render in Geist (clean sans), not Fraunces.
- Section headlines ("Featured *products*", "Equipment that *delivers*") still in Fraunces with gold italic accent.
- No purple lavender price text remains on product cards.

