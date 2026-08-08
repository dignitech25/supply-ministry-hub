# Fix the Shower Mat image

## What is actually wrong

The MedHealth catalogue renders images fine. Of the 16 priced products, 15 decode correctly. One does not:

- `SMBA12740` Shower Mat Transparent: its `image_url` in `microsite_products` is a **truncated base64 string** (5,055 chars, length not a multiple of 4, ends mid-stream). No amount of padding makes it decode, so the browser treats it as a broken image. That is why this one card looks wrong while the others are fine.

There is no fallback anywhere: that SKU does not exist in `products` or `products_categorized`, so nothing else in the database holds a good copy.

## Fix

Replace the corrupt value in the database with a valid image, then confirm the card renders. Two ways to get a valid image, pick one:

1. You send me the real Shower Mat Transparent product photo (upload in chat). I encode and store it. Best fidelity.
2. I use the Bath Mat Transparent photo already in the database for the sibling product in the same range. Visually near identical transparent suction mat, but not the exact product shot.

Until a good image is in place, I will also make the card degrade cleanly rather than showing a broken box.

## Technical detail

- One `UPDATE` on `public.microsite_products` setting `image_url` for `product_code = 'SMBA12740'`.
- Verify by decoding the stored string server side and by loading `/partners/medhealth-capability-2026` in a browser check.
- The existing `onError` fallback in `ProductCard.tsx` already swaps to the category glyph; I will confirm it fires for this card so a bad value never leaves an empty box.
- No changes to layout, copy, kits, filters, or the quote submission flow.
