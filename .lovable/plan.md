# End-to-End Functionality & Features Audit

## Goal
Produce a single, prioritized audit report covering every interactive feature, page, and data flow on the site. **No code changes in this pass** — the output is a findings document. You then choose what to fix.

## Scope (what gets tested)

### 1. Pages (12 routes)
- `/` (Index), `/products`, `/products/:sku`, `/product/:handle`
- `/quote`, `/quote-confirm`
- `/resources`, `/support-at-home`, `/rent-to-buy`, `/sleep-choice`
- `/terms`, `/admin/category-qa`, `*` (NotFound)

For each: page loads, SEO meta + title, canonical URL, structured data present, no console errors, mobile + desktop layout intact.

### 2. Global navigation & chrome
- Promotional ribbon ("beat any quote by 5%") renders + sparkle animation
- Header: logo links to `/`, search icon opens dialog, cart icon opens drawer, badge count accurate
- Category navigation bar: every category link resolves to a valid filtered products view
- Footer: every link target exists, contact details match canonical (`alex@`, `david@`, phone)
- Floating Smart CTA: "Shop Now" on `/`, "Request Quote" elsewhere, both route correctly

### 3. Quote flow (critical path)
- Add to quote from ProductCard, ProductDetail, FeaturedProducts
- Drawer: quantity +/-, line notes, remove item, persistence via localStorage
- "Request Quote" button → EnhancedQuoteForm
- Form validation (required fields, email format, phone)
- Submit → `submit-quote-with-email` edge function → confirmation page
- Email notification fires (`send-quote-notification`)
- Empty-quote state renders correctly

### 4. Search
- Header search icon opens SearchDialog
- Query returns relevant products from DB
- Result click navigates to `/products/:sku`
- Empty state + no-results state

### 5. Product catalogue
- `/products`: filter sidebar (category, brand, price, etc.), active filter tags, clear filters
- Mobile: filters behind dedicated button (per memory)
- Pagination / infinite scroll behaviour
- Product cards: image fallback, sale badge logic, price display ("From $X" for variants), Add-to-Quote works without navigating

### 6. Product detail
- Variant selector (size/color), price updates per variant
- Add-to-quote with selected variant
- SEO content block renders for high-value products
- Breadcrumbs + related products

### 7. Copy + canonical claims sweep
Re-verify zero regressions on:
- "2,000+ products" everywhere
- No specific category counts
- "15+ years"
- "48-hour quote turnaround" only (no dispatch/delivery promises)
- No em dashes (`—`) anywhere user-facing

### 8. Backend / data integrity
- Supabase tables: `products` vs `products_categorized` row counts + sync status
- Edge functions deployed: `submit-quote-request`, `submit-quote-with-email`, `send-quote-notification`, `sitemap`
- Recent edge function logs for errors
- RLS policies present on user-facing tables

### 9. SEO infrastructure
- `/sitemap.xml` returns valid XML with current product URLs
- `robots.txt` correct
- Canonical domain enforcement (`www.supplyministry.com.au`)
- Per-page `<title>` under 60 chars, meta description 145–160 chars

### 10. Responsive + accessibility quick check
- 430px viewport (current): no horizontal scroll, tap targets ≥40px, drawer usable
- 768px and 1280px breakpoints
- Hero video autoplays on mobile (Safari/Chrome) with poster fallback
- Alt text on all images, ARIA labels on icon-only buttons

## Method
1. **Static audit** via `rg`, file reads, and DB queries (Supabase read tools, edge function logs)
2. **Interactive audit** via the browser tool: navigate each route, click every interactive element, submit a test quote, screenshot anything broken
3. **Console + network capture** during the interactive pass to surface silent errors
4. **Compile findings** into a single report

## Deliverable
A markdown report saved to `/mnt/documents/site-audit-2026-04-26.md` and surfaced in chat with:
- ✅ Working as expected
- ⚠️ Minor issues (cosmetic, low-impact)
- ❌ Broken or misleading (needs fix)
- 🔒 Security / data integrity concerns
- Each finding tagged with: page, component, severity, suggested fix, est. effort

## What this plan does NOT do
- No code changes. After you read the report, you pick what to fix and I'll do those in a follow-up.
- No design overhaul. Strictly functional verification against the current intent.
- No new features. Audit only.

## Estimated cost
- Mostly read tools + browser tool. Browser tool is the expensive part; I'll batch interactions efficiently and avoid speculative clicking.

Approve and I'll run the full sweep and deliver the report.
