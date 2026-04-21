

# Fix "Featured products" headline spacing

Instrument Serif at the current size renders too tight — letters and the italic accent crowd each other. Two fixes available; pick one.

## Options

**A. Stay on Instrument Serif, fix the spacing** (smallest change)
- Add `tracking-tight` on roman text, `leading-[1.05]` so descenders on the italic don't collide.
- Bump size up to `text-5xl md:text-6xl` so the serif has room to breathe.
- Add a hair of left padding on the italic accent (`ml-1`) so "products" isn't kissing "Featured".

**B. Switch headlines to Geist (sans), keep gold italic accent** (cleaner, more current)
- Drop serifs from section headlines entirely.
- Headline becomes: `font-geist font-light text-5xl md:text-6xl tracking-tight text-ink` with the accent word as `font-geist italic font-normal text-gold`.
- Matches the product-title decision and gives a single typographic voice across the site.
- Keeps Instrument Serif loaded only if you still want it on the hero — otherwise remove it too.

## Recommendation

**Option B (Geist).** You've already moved product titles to Geist and disliked Fraunces and now Instrument Serif at section sizes. The pattern is clear: you want Swiss/minimal, not editorial-serif. Commit to Geist and the design becomes coherent.

## Changes for Option B

### Global headline class swap
Across all section headlines currently using `font-instrument font-normal`:
- `font-instrument font-normal` → `font-geist font-light tracking-tight leading-[1.05]`
- Italic accent span: `italic text-gold` → `font-geist italic font-normal text-gold` (no class change needed if `font-geist` is inherited; explicit is safer)

### Size bump on the main section h2s
For `FeaturedProducts.tsx`, `ProductCategoryCards.tsx`, `AboutSection.tsx`, `FAQSection.tsx`, and the Index.tsx mid-page sections:
- `text-4xl md:text-5xl` → `text-5xl md:text-6xl`

### Hero headline in `EditorialHero.tsx`
- Same swap, keep its existing larger size (already big — just change the family).

### `index.html`
- Remove `Instrument+Serif:ital@0;1` from the Google Fonts URL.
- Keep Geist (already loaded with weights 300/400/500). Add `600` if any headline needs more weight, but `font-light` (300) is the target.

### `tailwind.config.ts`
- Remove `instrument` and `fraunces` and `serif-italic` entries from `fontFamily` once verified.

## Files affected (class swap only)

- `src/components/editorial/EditorialHero.tsx`
- `src/components/FeaturedProducts.tsx`
- `src/components/ProductCategoryCards.tsx`
- `src/components/AboutSection.tsx`
- `src/components/FAQSection.tsx`
- `src/pages/Index.tsx`
- `src/pages/Products.tsx`
- `src/pages/ProductDetail.tsx`
- `src/pages/Quote.tsx`, `QuoteConfirm.tsx`, `RentToBuy.tsx`, `Resources.tsx`, `SleepChoice.tsx`, `SupportAtHome.tsx`, `TermsConditions.tsx`, `NotFound.tsx`
- `index.html`
- `tailwind.config.ts`

## Out of scope

- Gold accent colour and italic treatment — unchanged.
- Layout, spacing of sections, copy — unchanged.
- Product cards, buttons, body — already Geist.

## Verification

- "Featured *products*", "Equipment that *delivers*", "Sleep that *restores*" render in Geist light at a larger, airier size with the gold italic accent intact.
- Letters no longer feel bunched; tracking and line-height give the headline breathing room.
- No Instrument Serif or Fraunces remaining in the DOM or font URL.

## Decision needed

Confirm: **Option A (stay on Instrument Serif, just fix spacing)** or **Option B (Geist-only headlines, recommended)**.

