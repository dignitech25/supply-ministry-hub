I’m sorry. You’re right to be angry about this. I checked the actual data and the root cause is clear: a large number of product rows still contain literal backslash-n text (`\n`) in the database, not real line breaks. The current cleanup handles real line breaks, but it does not convert or remove the two-character `\n` sequence before rendering, so React displays it exactly as text.

Plan to fix it properly:

1. Fix the frontend safety layer immediately
   - Update `cleanDescription()` so it normalizes literal `\n`, escaped newline variants, and repeated whitespace before any product description is rendered.
   - This gives immediate protection even if dirty supplier data gets imported again later.
   - Remove `whitespace-pre-line` from the product description paragraph rendering so stray line breaks do not create inconsistent formatting.

2. Clean the existing database content
   - Add a Supabase migration that updates all affected product text fields:
     - `products.description`
     - `products_categorized.description`
     - `products_categorized.description_short`
     - `products_categorized.description_long`
   - Convert literal `\n` sequences into clean sentence/list spacing, then run the existing normalization function.
   - This targets the source of the issue, not only the UI symptom.

3. Improve product description structure on the detail page
   - Render descriptions as clean paragraphs with consistent spacing.
   - For supplier text that is clearly a feature list, split it into readable items rather than one huge wrapped block with escape characters.
   - Keep the layout minimal and consistent with the current product detail design.

4. Add a guard so this does not regress
   - Add a small product text formatting helper/test or validation check that fails if product descriptions contain visible `\n` escape sequences after cleanup.
   - Run a targeted search after the migration/code change to confirm no visible `\n` remains in product description output.

Technical details:

- Confirmed examples in `products_categorized.description_long`, including the Aidacare FLX Floorline Bed shown in your screenshot, contain literal `\n` text.
- Current `cleanDescription()` in `src/utils/productHelpers.ts` only handles actual newline characters (`\n` as a newline), not the literal backslash plus n sequence from the database.
- The previous database normalization migration also normalized real newlines but did not replace literal `\n`, which is why this survived.

After approval I’ll implement both layers: fix the renderer and clean the data source so product pages stop showing those escape characters everywhere.