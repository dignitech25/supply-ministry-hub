# Remove duplicated Description and Clinical Use Cases on product pages

## What you are seeing

On the ComfiMotion page the same information appears twice: once in the upper "Description" and "Clinical Use Cases" cards (built from the supplier feed), and again lower down in the richer "About This Product", "Key Features" and "Common Clinical Use Cases" sections.

## Important constraint found in the code

The richer lower sections are not driven by the product database. They come from a hand-written content file that currently contains **one product only**: the Aspire ComfiMotion Activ Care bed. Every other product renders nothing there.

So deleting the upper two cards outright would strip 512 of 513 product pages of all descriptive content, which would hurt both users and search rankings.

## Proposed approach

Make the upper cards conditional rather than deleted:

- When a product **has** enhanced content (currently ComfiMotion), hide the upper "Description" and "Clinical Use Cases" cards entirely. Only the richer sections show. No duplication.
- When a product **does not** have enhanced content, the upper cards stay exactly as they are today, so all other products keep their descriptions.

This applies automatically to every product page, and every future product we write enhanced content for gets the clean single-copy layout with no further code changes.

Scope is the main Supply Ministry site only. The MedHealth partner catalogue stays exactly as it is. Specifications and the pricing/quote block are untouched. The page meta description keeps using the feed description, so SEO metadata is unaffected.

## Technical detail

- `src/pages/ProductDetail.tsx`: gate the Description card and the Clinical Use Cases card on `!hasProductSEOContent(parent.slug)`. Compute that flag once and reuse it for the existing footer condition.
- No changes to `ProductSEOContent.tsx`, the data layer, the sitemap script, any Supabase table, or anything under the MedHealth partner routes.
- Verify on `/products/BEB046745` (enhanced: upper cards gone) and one ordinary product (upper cards still present), then run a type check.

## If you would rather go further

If you want every product to have "About This Product / Key Features / Common Clinical Use Cases" instead of the feed description, that is a separate content-generation task: it needs those three fields added to the product data and populated for 513 families. Say the word and I will plan that next.
