## Goal
Replace the current `TrustBar` (9px, 28% opacity violet-on-violet text that "hangs flaccidly") with a confident **cream Proof Bar** that uses real estate properly and signals authority.

## Files
- **Rewrite:** `src/components/editorial/TrustBar.tsx`
- **No other files change** (Index.tsx already imports TrustBar at the right slot)

## Design

**Surface:** `bg-cream` with `text-ink`, `border-y border-cream-border`. Creates an editorial break between the violet SupplierStrip and the violet FeaturedProducts section.

**Spacing:** `py-10 md:py-14` (replacing 12px), container-wrapped.

**Layout:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12` with vertical dividers between columns on desktop (`lg:border-l lg:border-cream-border lg:first:border-l-0 lg:pl-8`).

## Content (4 quantified columns)

Each column = eyebrow label + bold headline (with italic gold accent on key word) + sub-line.

1. **Clinician trusted** → "OT-*referred*" → Specs and trial documentation included
2. **Procurement** → "Aged care and *NDIS-ready*" → Compliant quotes, plan-manager friendly
3. **Turnaround** → "*48-hour* quotes" → Most metro orders dispatched same week
4. **Catalogue** → "*4,400+* products" → Sourced from Australia's leading AT suppliers

Note: "NDIS-ready quotes" describes quote format, not registration status (compliant with the no-NDIS-approval rule).

## Typography
- Eyebrow: `font-geist text-[10px] tracking-[0.18em] uppercase text-muted-body`
- Headline: `font-geist text-xl md:text-2xl font-light tracking-tight text-ink leading-tight` with italic `text-gold` accent on the key word
- Sub-line: `text-sm text-muted-body leading-relaxed`

## Responsive
- <640px: single-column stack, left-aligned, no dividers
- 640–1024px: 2x2 grid
- ≥1024px: 4-column row with vertical dividers

## Compliance
- ✅ "NDIS-ready" not "NDIS approved" (per `mem://business/ndis-approval-status`)
- ✅ Zero em dashes (per core memory)
- ✅ No funding/compliance guarantees (per `mem://business/compliance-and-funding-policy`)
- ✅ Uses only existing design tokens

## Out of scope
- Pre-existing `resend@2.0.0` edge function build errors (unrelated)
- Section ordering in `Index.tsx`
- SupplierStrip and FeaturedProducts