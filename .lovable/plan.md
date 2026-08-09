# Fix price display when there is no real discount

## Problem
On product pages (e.g. `/products/BEB046745`) the price block renders both a "discounted" price and a struck-through "RRP" price whenever both `price_discounted` and `price_rrp` fields are populated, even if the two values are identical. This makes a $4,199 RRP product look like it is on sale when it is not.

## Root cause
`src/pages/ProductDetail.tsx` and `src/components/ProductCard.tsx` use a simple truthiness check (`priceDiscounted && priceRrp`) to decide whether to show the RRP strikethrough. They do not check whether the discounted price is actually lower than the RRP.

## Fix
Replace the truthiness branch with a genuine discount check: only show the struck-through RRP when `priceDiscounted < priceRrp`. When the values are equal (or no discounted price exists), render a single price.

Use the existing `isOnSale(priceRrp, priceDiscounted)` helper from `src/utils/productHelpers.ts` to keep the logic consistent across the site.

## Files to change
1. `src/pages/ProductDetail.tsx` — update the price block inside the hero product-info column.
2. `src/components/ProductCard.tsx` — update the price block in product cards for consistency.

## Verification
- Open `/products/BEB046745` and confirm only one price is shown (e.g. "$4,199") with no struck-through RRP line.
- Confirm products that do have a real discount still show the discounted price plus struck-through RRP.
- Run `bunx tsgo --noEmit` to ensure no TypeScript errors.
