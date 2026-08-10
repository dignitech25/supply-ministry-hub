# MedHealth catalogue: missing product images

## What happened

The images are not broken in the code. They are missing in the data.

`microsite_products` now holds 53 items, but only 26 have an `image_url`. The 27 rows added in the recent data expansion were loaded without images, so those cards fall back to the category glyph placeholder.

Missing images by group:
- Bed and positioning: 11 (Icare IC333 bed, boards, side rails, bed stick, wedges, Forte Icon mattress x3)
- Kitchen and household: 6 (Uccello kettle, jar/can openers, PrepWorks, Bissell vacuum, kitchen workstation)
- Mobility and vehicle: 6 (Rollator Latitude aluminium and carbon fibre, all sizes)
- Seating: 2 (Pride C6 lift recliner, Aspire perching stool)
- Toileting: 2 (over toilet frame, toilet surround)

There is also a secondary display issue: three variant families (both rollators and the Forte mattress) have no image on any variant, and the main `products` table has no matching SKUs to borrow from, so nothing can be inherited automatically.

## Proposed fix

1. Family image inheritance: if the representative variant has no image, use the first variant in the family that does. Prevents a whole family showing a placeholder when only one SKU has a photo.
2. Restore the missing photos into `microsite_products.image_url` as base64, same format as the existing 26. This needs the source images.
3. Keep the glyph placeholder as the fallback for anything still without a photo, so cards stay the same height and the grid does not break.

## What I need from you

The images themselves. Either upload a folder named by product code (for example `SMDLPTKD.jpg`), or confirm a supplier source I should pull them from. Without a source I can only ship step 1 and 3.

## Technical detail

- `src/lib/medhealth-catalogue.ts`: add image inheritance inside `buildFamilies`.
- `src/components/medhealth-catalogue/ProductCard.tsx` and `src/pages/MedHealthProduct.tsx`: use the resolved family image.
- Data restore via a Supabase migration or updates keyed on `product_code`.
