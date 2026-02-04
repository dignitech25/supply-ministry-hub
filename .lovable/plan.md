

# SEO Audit Report for supplyministry.com.au

## Executive Summary

This audit identified **8 SEO issues** across your site, ranging from critical infrastructure problems to optimization opportunities. The most impactful issues relate to domain canonicalization, missing structured data, and incomplete social sharing metadata.

---

## Issues Found

### 1. Domain Canonicalization (www vs non-www) - CRITICAL
**Status:** Already identified but requires hosting-level fix

**Problem:** The crawler reports duplicate title/meta descriptions because both `supplyministry.com.au` and `www.supplyministry.com.au` are being indexed as separate pages.

**Current mitigation:** Canonical tags are implemented in `SEO.tsx` pointing to the non-www version.

**Required action:** Add `www.supplyministry.com.au` as a secondary domain in **Project Settings > Domains** so it automatically 301 redirects to the primary domain.

---

### 2. Missing Structured Data (JSON-LD) - HIGH
**Status:** Not implemented

**Problem:** No structured data markup exists on the site. This limits rich snippet opportunities in search results for:
- Organization/LocalBusiness
- Product listings  
- FAQ sections (Resources page has FAQs)
- Breadcrumbs

**Recommendation:** Add JSON-LD schema for:
- Organization schema on all pages
- Product schema on product detail pages
- FAQPage schema on Resources page
- BreadcrumbList schema on product pages

---

### 3. Incorrect Open Graph Image - HIGH
**Status:** Pointing to Lovable default

**Problem:** The OG image in `index.html` points to `https://lovable.dev/opengraph-image-p98pqg.png` - a generic Lovable image, not a Supply Ministry branded image.

**Files affected:** 
- `index.html` (line 14)
- `src/components/SEO.tsx` (doesn't set og:image dynamically)

**Recommendation:** 
- Create a branded OG image (1200x630px recommended)
- Update default in `index.html`
- Add dynamic og:image support in SEO component for product pages

---

### 4. Missing Twitter Image Tags - MEDIUM
**Status:** Not implemented

**Problem:** While `twitter:card` is set to `summary_large_image`, there's no `twitter:image` tag defined. Twitter won't display rich cards properly.

**Files affected:**
- `index.html`
- `src/components/SEO.tsx`

---

### 5. AdminCategoryQA Page Missing SEO Component - LOW
**Status:** Page has no meta tags

**Problem:** The `/admin/category-qa` page doesn't use the SEO component. While this is an admin page, it should still have:
- `noindex` directive to prevent indexing
- Proper title tag

**File:** `src/pages/AdminCategoryQA.tsx`

---

### 6. QuoteConfirm Page Should Be noindex - LOW
**Status:** Currently indexable

**Problem:** The `/quote-confirm` page is a transactional confirmation page that shouldn't appear in search results. It currently has a generic SEO setup that allows indexing.

**File:** `src/pages/QuoteConfirm.tsx`

---

### 7. Sitemap Is Static - MEDIUM
**Status:** Only contains 6 pages

**Problem:** The sitemap at `public/sitemap.xml` is manually created with only 6 static URLs. It doesn't include:
- Product detail pages (dynamic)
- The `/quote` page (missing from sitemap)

**Current sitemap entries:**
- `/` (Home)
- `/products` (Catalog)
- `/quote` - Actually included
- `/resources`
- `/sleep-choice`
- `/terms`

**Missing:** Dynamic product pages cannot be pre-generated in a static file, but for a catalog site this limits discoverability.

---

### 8. Image Alt Attributes - GOOD
**Status:** Properly implemented

All major image components have meaningful alt text:
- Hero image: "Smiling senior woman using assistive technology with confidence"
- Brand logos: Individual brand names
- Product images: `${brand} ${productName}`
- Logo: "Supply Ministry"

---

## Summary Table

| Issue | Severity | Fix Location | Effort |
|-------|----------|--------------|--------|
| www redirect | Critical | Lovable Settings | 2 min |
| Missing JSON-LD | High | SEO.tsx + pages | 2-3 hrs |
| Wrong OG image | High | index.html + SEO.tsx | 30 min |
| Missing twitter:image | Medium | index.html + SEO.tsx | 15 min |
| Admin page noindex | Low | AdminCategoryQA.tsx | 5 min |
| QuoteConfirm noindex | Low | QuoteConfirm.tsx | 5 min |
| Static sitemap | Medium | Infrastructure | Complex |
| Image alts | Good | N/A | Done |

---

## Recommended Fix Priority

**Immediate (Today):**
1. Configure www domain redirect in Lovable Settings
2. Update OG image to branded Supply Ministry image
3. Add twitter:image meta tag

**This Week:**
4. Add noindex to admin and confirmation pages
5. Implement Organization JSON-LD schema

**Future Enhancement:**
6. Add Product and FAQ structured data
7. Consider dynamic sitemap solution

---

## Technical Implementation Details

### SEO.tsx Enhancement
The SEO component should be extended to support:
- `og:image` prop with default fallback
- `twitter:image` tag
- `noindex` boolean prop for pages that shouldn't be indexed
- JSON-LD structured data injection

### Structured Data Templates
Organization schema should include:
- Business name, logo, contact info
- Social profiles
- Service area (Greater Melbourne, Victoria, Australia)
- NDIS provider status

Product schema should include:
- Name, description, brand
- SKU, price, availability
- Product images

