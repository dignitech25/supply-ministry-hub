

# Strip em dashes site-wide + apply description rewrite policy to all products

Two rules being locked in:

1. **No em dashes (`—`) anywhere on the site, ever.** Not in copy, not in product descriptions, not in headings, not in placeholders. This is a permanent project rule going forward.
2. **The description cleanup isn't just IC333.** Every product description in the database needs the same treatment — squashed punctuation fixed, marketing slop removed, dead "download here" text stripped, specs reformatted, no em dashes.

## 1. Save the rule to project memory

Add a new core rule to `mem://index.md` and a dedicated memory file:

- `mem://style/no-em-dashes` — "Never use em dashes (—) anywhere on the site. Use a period, comma, colon, or 'and' instead. Applies to UI copy, headings, product descriptions, placeholders, alt text, meta descriptions, and any AI-generated text."

This means I (and future sessions) will never reach for `—` again, including in the product rewrite below.

## 2. Sweep existing site copy for em dashes

Search the codebase for any literal `—` character and replace each one with appropriate punctuation (period, comma, colon, or rewording). Files to sweep:

- All `.tsx` / `.ts` files under `src/` (components, pages, hooks, utils)
- `index.html` (meta tags, OG description)
- `public/sitemap.xml` if any descriptions live there
- Edge function source under `supabase/functions/` (email templates etc.)

Each hit gets fixed in place. No structural changes — just punctuation swaps that preserve meaning. For the IC333 rewrite I drafted previously, every `—` becomes a colon or period.

## 3. Database-wide product description cleanup

Scope: **every row** in `public.products` (`description`) and `public.products_categorized` (`description_short`, `description_long`) where the text shows any of these slop signals:

- Em dashes (`—`)
- Numbers with stray spaces in thousands separators (e.g. `12, 000`)
- Run-together specs (e.g. `340mmKing Single`)
- Dead inline links (`Download ... Here` with no URL behind them)
- ALL-CAPS marketing taglines glued to the start of a sentence (e.g. `ELEGANT + FUNCTIONALThe IC333...`)
- Missing spaces after commas, colons, or sentence-ending punctuation

### Approach

A SQL-based normalisation pass is the only sane way to hit thousands of rows. Two phases:

**Phase A — Mechanical cleanup (safe, applies to every row):**

A single migration runs regex-based `UPDATE` statements that:

1. Replace every `—` with `. ` (then collapse double-spaces / fix capitalisation).
2. Fix `\d, \d{3}` patterns back to `\d,\d{3}` (e.g. `12, 000` to `12,000`).
3. Insert a newline between glued spec lines (`(\d+\s*mm)([A-Z])` to `$1\n$2`).
4. Strip dead "Download ... Here" / "Click Here" fragments that aren't followed by a URL.
5. Strip ALL-CAPS marketing leaders (`^[A-Z0-9 +&]{6,}` followed by a Title-Case word) and re-join cleanly.
6. Normalise whitespace (collapse runs of spaces, trim, ensure single space after punctuation).

These run on `products.description`, `products_categorized.description_long`, and `products_categorized.description_short` for every row. Idempotent — safe to re-run.

**Phase B — Per-product rewrite (curated, in batches):**

Mechanical cleanup will fix formatting but won't rewrite genuinely bad copy (like the IC333 one). For that, I'll work through the catalogue in batches grouped by product family (shared base SKU, e.g. all `IC333%`, all `RM%`, all `KCAREXR%`), since variants in a family share the same description. After running the inventory query, I'll process families largest-first so we get the most coverage per rewrite.

For each family I'll:
- Read the current description.
- Write a clean short (1 sentence) and long (3–5 short paragraphs + spec block) version following the same template as the IC333 rewrite.
- Apply via an insert-tool `UPDATE` scoped to that SKU prefix.

Batch size suggestion: 10–15 product families per turn, so each batch is reviewable. I'll show you the rewritten copy before applying, or apply directly and you can flag any you want changed — your call (see question below).

## 4. Out of scope (intentionally)

- Brand names, category names, and titles — leaving alone unless you ask.
- The "Bed Assessment Script" PDF — still needs the file from you.
- Image alt text — clean but not a rewrite target unless you want one.

## Files touched

- `mem://style/no-em-dashes` — new memory file.
- `mem://index.md` — add core rule + memory entry.
- Any `src/**` / `index.html` / `supabase/functions/**` files containing `—` — punctuation swap.
- `supabase/migrations/<timestamp>_normalise_product_descriptions.sql` — Phase A regex cleanup across both product tables.
- Per-batch insert-tool `UPDATE`s for Phase B family rewrites (no migration; data only).

## Verification

- `grep -R "—" src/ index.html supabase/functions/` returns zero matches.
- `SELECT count(*) FROM products WHERE description LIKE '%—%'` returns 0 after Phase A.
- Same query against `products_categorized` for both description columns returns 0.
- Spot-check IC333, plus 5 other random product families — descriptions read like a person wrote them, specs are on their own lines, no dead links, no all-caps leaders.
- New core rule visible in `mem://index.md` so future edits respect the no-em-dash policy automatically.

## One question before I start Phase B

For the per-family rewrites: do you want me to (a) show you each batch of rewritten copy in chat for sign-off before applying, or (b) just apply them and you'll flag any you want adjusted afterwards? Option (b) is much faster across a few hundred families; option (a) is safer if tone matters product-by-product.

