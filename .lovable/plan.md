## Goal

Eliminate every contradicting product / category / years / dispatch claim across the site and converge on one canon:

- **2,000+ products**
- **All AT categories** (no number)
- **15+ years** experience
- **48-hour quote turnaround** only — remove all dispatch / delivery time promises

## Canonical phrasing (reuse these everywhere)

| Claim | Approved phrasing |
|---|---|
| Catalogue size | `2,000+ products` |
| Category breadth | `across all AT categories` (or `every assistive technology category`) |
| Experience | `15+ years in assistive technology` |
| Speed | `48-hour quote turnaround` (sub: `Quotes returned within two business days.`) |

## Files and exact changes

### 1. `src/components/editorial/EditorialHero.tsx` — homepage stats trio
Replace the `stats` array (lines 55-59):
- `468 +` → `2,000 +` ; label `Products across all\nAT categories`
- `48 hr` → keep, label change to `Quote\nturnaround`
- `3 yr` → `15 +` ; label `Years in assistive\ntechnology`

### 2. `src/components/editorial/TrustBar.tsx` — homepage four-up
- Catalogue card: `4,400+` → `2,000+`, sub stays as is.
- Turnaround card: change accent from `48-hour` + trail `quotes` is fine; rewrite sub from `Most metro orders dispatched the same week.` → `Quotes returned within two business days.` (drops dispatch promise).

### 3. `src/components/FAQSection.tsx`
- Q "What products do you supply?" answer: `over 2,000 products` stays (already aligned).
- Q "How quickly can you dispatch equipment?" — rewrite question to `How quickly will I get a quote?` and answer to focus on 48-hour quote turnaround, removing the dispatch / priority dispatch wording. Lead times still mentioned at quoting stage.

### 4. `src/components/HeroSection.tsx` (legacy, kept in repo)
Even though `Index.tsx` uses `EditorialHero`, this file still ships. Update so it can't be reintroduced inconsistently:
- Benefit list: `Fast 48-hour dispatch` → `48-hour quote turnaround`.
- Stats trio: `2000` products stays, `48hrs Quick Dispatch` label → `Quote Turnaround`, `15+ Years Experience` stays.

### 5. `src/pages/Index.tsx`
- SEO meta description: replace `48-hour dispatch.` with `48-hour quote turnaround.`
- Testimonial #1 quote: replace `Their quick dispatch program means our clients get what they need when they need it.` with `Their fast quote turnaround means our clients get sorted without the usual procurement delays.`

### 6. `src/pages/ProductDetail.tsx`
- Default SEO description fallback: replace `fast dispatch and expert support` with `fast quote turnaround and expert support`.

### 7. `src/pages/Products.tsx`
- SEO meta description: replace `Fast Australian dispatch.` with `48-hour quote turnaround.`

### 8. `src/pages/Resources.tsx`
- FAQ answer about delivery times: rewrite to focus on quote turnaround (48 hours) and clarify delivery lead times are confirmed at quoting stage. Drop the "48-hour quick dispatch service" claim.

### 9. `src/pages/TermsConditions.tsx`
- Line 48: `We aim for 48-hour dispatch on most items.` → `We aim to return quotes within 48 hours.` Keep the rest of the delivery clause but reword to: `Delivery times vary based on supplier, location and product availability and will be confirmed on quote.`

### 10. `src/components/AboutSection.tsx`
- Value-prop description that says `we prioritize fast dispatch and delivery` → reword to `we prioritise fast quote turnaround and clear lead times.` (also fixes US spelling drift).
- `15+ years in assistive technology` stays (already canon).

### 11. `src/components/ProductSEOContent.tsx`
- The generic FAQ answer about Melbourne metro / 24-48h delivery is a delivery promise. Rewrite to: quote turnaround within 48 hours, with delivery timing confirmed per item at the quoting stage. Removes the `24-48 hours` delivery claim.

## What is intentionally NOT changing

- Memory `mem://design/homepage-section-order` and other architectural memories — copy-only pass.
- Database content — none of these counts live in DB.
- The 6 category cards on the homepage stay as-is (we just stop asserting any number in copy).
- Em-dash policy — already enforced; this pass uses periods/commas.

## Verification after implementation

1. `rg -i "468|4,?400|18 categor|fast dispatch|quick dispatch|48-hour dispatch|dispatched within"` should return zero matches in `src/`.
2. `rg -i "2,?000\+? product"` should return matches in: EditorialHero stats, TrustBar, FAQSection, HeroSection, no others contradicting.
3. Manual visual check of homepage: hero stats, TrustBar four-up, FAQ, testimonials all consistent.
4. No memory updates needed; existing memories already align with this canon.