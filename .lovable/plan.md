

# SEO/SEM Audit — Supply Ministry

## Overall Score: Good Foundation, Several Gaps

The site has solid SEO fundamentals (SEO component, structured data, dynamic sitemap, canonical enforcement). Below are the issues found, ranked by impact.

---

## Critical Issues

### 1. Homepage FAQ section missing JSON-LD FAQSchema
The `FAQSection` component on the homepage renders 6 FAQ items but has **no FAQPage JSON-LD schema**. This means Google won't display FAQ rich results for the homepage — a missed opportunity for SERP real estate on high-value queries like "NDIS assistive technology supplier."

### 2. Product detail JSON-LD rendered outside Helmet
Lines 284-290 in `ProductDetail.tsx` render `<script type="application/ld+json">` tags directly in the DOM body instead of inside the `<Helmet>` component. While this may work, it risks duplicate/conflicting structured data and is inconsistent with how the SEO component handles JSON-LD on other pages. The SEO component already supports `jsonLd` prop but it's not being used here.

### 3. Missing `support-at-home` page from sitemap
The `/support-at-home` route exists and has an SEO component, but it is **not listed** in the sitemap edge function's `STATIC_PAGES` array. Search engines won't discover it via sitemap.

### 4. Product images missing `alt` text with keywords
Product listing cards use `alt={product.baseName}` which is fine, but the product detail page's main image has no descriptive alt — it uses the raw `displayImage` variable. Should include brand + product name + category for image search visibility.

---

## High-Impact Issues

### 5. No `<meta name="robots">` on admin/internal pages
`/admin/category-qa` and `/quote-confirm` are indexable by default. These should have `noindex` set to prevent thin/internal pages from being crawled and diluting crawl budget.

### 6. Hero H1 geo-targets "Greater Metropolitan Melbourne" only
The H1 says "solutions for your clients across Greater Metropolitan Melbourne" but the meta description says "Australia's trusted...". This mismatch weakens national keyword targeting. The hero copy should align with the broader service area or the meta should be narrowed.

### 7. Resources page blog posts are static/placeholder
Blog posts on `/resources` are hardcoded with fake dates ("December 2024", "November 2024") and no actual content or links. Google sees these as thin content. Either make them real or remove them.

### 8. Duplicate FAQ content
The homepage `FAQSection` and the Resources page both have FAQ sections with overlapping but slightly different questions/answers. This creates keyword cannibalization — both pages compete for the same FAQ queries.

### 9. Products page missing breadcrumb schema
The `/products` listing page has no BreadcrumbList JSON-LD. Only product detail pages have it.

---

## Medium-Impact Issues

### 10. No Open Graph images for product pages
Product detail pages don't pass the product image to the SEO component's `image` prop, so they all fall back to the generic `og-image.jpg`. Sharing a product on social media shows the generic brand image instead of the product photo.

### 11. Pagination not SEO-friendly
Product listing pagination uses client-side state changes with no URL-based `rel="next"` / `rel="prev"` hints. While Google has deprecated these, the paginated content is also not server-rendered, so deeper product pages may not get indexed.

### 12. Missing `hreflang` tags
If targeting only Australia, adding `<link rel="alternate" hreflang="en-AU">` would help Google understand geographic targeting.

### 13. No `aria-current="page"` on navigation links
Minor accessibility/SEO signal — active navigation links don't indicate current page state.

---

## Recommended Implementation Plan

Prioritized by impact and effort:

| Priority | Fix | Effort |
|----------|-----|--------|
| 1 | Add `/support-at-home` to sitemap edge function | 5 min |
| 2 | Add `noindex` to `/admin/category-qa` and `/quote-confirm` | 5 min |
| 3 | Add FAQPage JSON-LD schema to homepage FAQSection | 15 min |
| 4 | Move ProductDetail JSON-LD into SEO component's `jsonLd` prop | 15 min |
| 5 | Pass product image as OG image on product detail pages | 5 min |
| 6 | Add breadcrumb schema to Products listing page | 10 min |
| 7 | Fix product detail image alt text to include brand + name | 5 min |
| 8 | Remove or build out placeholder blog posts on Resources | 30 min |
| 9 | Align hero H1 copy with national targeting strategy | 5 min |
| 10 | Add `hreflang="en-AU"` to SEO component | 5 min |

All 10 fixes can be implemented in a single session. Items 1-7 are the highest-value, lowest-effort wins.

