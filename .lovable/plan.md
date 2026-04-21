

# Replace Fraunces for section headlines

Fraunces at light weight reads as dated/wedding-invitation rather than editorial-modern. Swap it for one of three sharper display options. The accent word stays italic + gold; only the typeface changes.

## Options

**1. Instrument Serif** — contemporary editorial serif (think Vercel, Linear marketing). High contrast, sharp terminals, beautiful italic. Currently the strongest "2025 editorial" choice. Pairs cleanly with Geist.

**2. Newsreader** — Google Fonts, modern transitional serif. Less ornamental than Fraunces, more grounded. Italic is restrained rather than swooshy.

**3. Geist + size/weight contrast (no serif at all)** — drop the serif entirely. "Featured **products**" rendered in Geist at a large size with the accent word in `font-medium italic text-gold`. Cleanest, most current, matches the product-title decision we just made.

## Recommendation

**Instrument Serif.** It keeps the editorial feel (which is the whole point of the redesign) but reads modern instead of nostalgic. The italic on the accent word is where Instrument Serif really earns its place — it's distinctive without being precious.

If you want to go fully Swiss/minimal, pick option 3 (Geist only) and we retire serifs from the site entirely.

## Changes if Instrument Serif is chosen

### `index.html`
Add to the existing Google Fonts `<link>`:
```
family=Instrument+Serif:ital@0;1
```

### `tailwind.config.ts`
Add to `fontFamily`:
```
'instrument': ['"Instrument Serif"', 'serif'],
```

### Global find/replace
Across all section headlines currently using `font-fraunces font-light`:
- `font-fraunces font-light` → `font-instrument font-normal`
- The italic accent span stays `italic text-gold` (Instrument Serif has a gorgeous italic by default)

Files affected (headline class swap only):
- `src/components/editorial/EditorialHero.tsx`
- `src/components/FeaturedProducts.tsx`
- `src/components/ProductCategoryCards.tsx`
- `src/components/AboutSection.tsx`
- `src/components/FAQSection.tsx`
- `src/pages/Index.tsx` (Sleep Choice, Testimonials, Contact section headlines)
- `src/pages/Products.tsx`
- `src/pages/ProductDetail.tsx` (PDP section sub-headings)
- `src/pages/Quote.tsx`, `QuoteConfirm.tsx`, `RentToBuy.tsx`, `Resources.tsx`, `SleepChoice.tsx`, `SupportAtHome.tsx`, `TermsConditions.tsx`, `NotFound.tsx`

### Keep Fraunces loaded?
No — remove it from the Google Fonts URL once the swap is verified, to keep page weight down.

## Out of scope

- Geist usage (product titles, body, buttons) — unchanged.
- Gold accent colour and italic treatment — unchanged.
- Layout, spacing, copy — unchanged.

## Verification

- "Featured *products*", "Equipment that *delivers*", "Sleep that *restores*" all render in Instrument Serif with the gold italic accent intact.
- No Fraunces remaining anywhere in the DOM.
- Page weight drops slightly after Fraunces is removed from the font URL.

## Decision needed

Confirm: **Instrument Serif** (recommended), **Newsreader**, or **Geist-only (drop serifs)**.

