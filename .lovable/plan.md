# MedHealth catalogue: product detail pages + brand rule

## 1. Product detail pages for all 16 products

Every priced product in the catalogue gets its own page, reached by clicking the product card.

Route: `/partners/medhealth-capability-2026/product/:code` (unlisted, noindex, same as the catalogue).

What is on the page:
- Same masthead lockup and coloured top rule as the catalogue, so it reads as one document.
- Back link: "Back to catalogue" (returns to the catalogue, preserving the current selection).
- Large product image (contained, white tile, glyph fallback when there is no image), roughly half the width on desktop and full width on mobile.
- Product name as the H1, clinical group eyebrow above it.
- Price and product code.
- Full `key_specifications` text (the catalogue card only shows the first sentence).
- Category.
- Actions: quantity stepper and "Add to selection" / "Remove", writing to the same selection state as the catalogue, plus a "Review and send" entry point when the selection is not empty.
- The sourcing contact line (phone and email) at the bottom.

Card interaction: tapping the card body navigates to the detail page. Selecting stays on the card via an explicit control (the tick/stepper area), so clicking to read a product no longer silently adds it. The kit sheet rows link to the same detail pages.

Selection persistence: the selection map moves to a small shared context (or sessionStorage) so it survives navigating to a detail page and back.

## 2. Multicoloured MedHealth rule

Sampled from the MedHealth mark, the brand's circle colours are amber `#FCB040`, red `#EC1C24` and blue `#6895C4`, alongside the ink `#231F20`.

- Replace the current top rule (violet, ink, amber) with a single reusable gradient built from the MedHealth circle palette, led by Supply Ministry violet so the house still owns the document: violet, blue, red, amber.
- Apply that exact same rule as the top border of the Clinical kits panel, replacing the current flat violet 1px line, and keep the panel's surrounding border in the same family so both rules read as one theme.
- Define it once in `src/partners/medhealth.ts` as `PARTNER.circle` colours plus a `brandRule` gradient string, used by both places.

## Technical notes
- New file `src/pages/MedHealthProduct.tsx`, new route in `src/App.tsx`.
- New `src/contexts/MedHealthSelectionContext.tsx` wrapping the two MedHealth routes.
- Edits: `src/partners/medhealth.ts` (palette + gradient), `src/pages/MedHealthCapability.tsx` (use gradient, use context, card click through), `src/components/medhealth-catalogue/ProductCard.tsx` (navigate on card click, select via control), `src/components/medhealth-catalogue/KitsRow.tsx` (brand rule top border), `KitSheet.tsx` (rows link out).
- No database or Supabase changes; the detail page reads the same `microsite_products` query by `product_code`.
