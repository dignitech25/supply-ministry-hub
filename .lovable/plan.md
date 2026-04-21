

# Shift accent to lavender + extend violet across the site

Two related changes: (1) replace the gold accent with the light lavender `#C4BAFF`, and (2) make the deep violet (the colour behind "Equipment that changes lives") the dominant brand surface across the rest of the site, especially on product pages and the footer, so the design feels less cream-heavy.

## 1. Accent colour swap — lavender `#C4BAFF`

- `--gold` token in `src/index.css` becomes `#C4BAFF` (HSL ~`249 100% 87%`).
- Same token drives every italic accent already (`text-gold`), so "*changes*", "*products*", "*delivers*", "*started*", testimonial stars, hover states, etc. all switch automatically.
- Stars in testimonials currently `fill-gold` — they'll become lavender. Acceptable because they sit on the new dark violet background (next section).
- Remove `AccentSwitcher` from the homepage — it was a temporary tool and the gold options are no longer relevant.
- Drop the unused `--accent-a/b/c` legacy tokens from `index.css`.

## 2. Violet as the dominant surface

The hero violet (`#3D2D9E`) becomes the main brand surface. Cream stays only as a supporting panel colour for content cards/cards-on-violet, not as the page background.

### Global page background
- `Index.tsx`, `Products.tsx`, `ProductDetail.tsx`, `Resources.tsx`, `SleepChoice.tsx`, `SupportAtHome.tsx`, `RentToBuy.tsx`, `Quote.tsx`, `QuoteConfirm.tsx`, `TermsConditions.tsx`, `NotFound.tsx`: outermost wrapper switches `bg-cream text-ink` → `bg-violet text-cream`.
- Section-level `bg-cream` / `bg-cream-alt` blocks within these pages stay as designed only where the section is intentionally a "content card" sitting on violet (e.g. testimonials, FAQ). Otherwise they're removed so the violet shows through.

### Footer
- `Footer.tsx`: `bg-ink` → `bg-violet`. Border above the legal line: `border-cream/20` → `border-cream/15`. Text colours unchanged (cream/cream-60).

### Navigation
- `EditorialNavigation.tsx`: `bg-cream border-b border-cream-border` → `bg-violet border-b border-white/10`.
- "Supply Ministry" wordmark: `text-ink` → `text-cream`.
- Nav links: `text-gold` → `text-cream/70 hover:text-cream` (the lavender accent is reserved for italic display words, not nav links).
- "Start your quote" pill: `bg-ink text-cream` → `bg-cream text-violet` (inverted so the CTA pops on violet).

### Product pages — the big shift
- `Products.tsx` page wrapper: `bg-violet text-cream`.
- Product grid sits inside `bg-cream rounded-3xl` "content sheet" panels with generous padding so cards still read on cream — the violet frames them like a magazine spread.
- `ProductCard.tsx`: card surface stays cream/white; outer page is violet. Title and price remain `text-ink` (cream card). No change to the card itself.
- Filter sidebar background: `bg-cream-alt` → keep (it's inside the cream sheet).
- `ProductDetail.tsx`: top hero strip (image + title + price) gets a `bg-violet text-cream` band, then specs/description sit on a cream sheet below. Title moves to `text-cream`; price `text-cream`; "Add to quote" CTA becomes `bg-cream text-violet`.

### Homepage sections — tighten cream usage
- Hero (`EditorialHero`): unchanged (already violet).
- `SupplierStrip`, `TrustBar`: backgrounds switch from cream to violet, logos and text in cream/70.
- `FeaturedProducts`, `ProductCategoryCards`: stay on cream — these are the "content sheets" framed by violet above and below.
- `AboutSection`: switch to `bg-violet text-cream`, italic accent in lavender.
- Sleep Choice section: keep `bg-cream` (content card).
- Testimonials: `bg-cream-alt` → `bg-violet text-cream`. Testimonial cards inside switch from `bg-cream` to `bg-cream` still (cards on violet) — gives the magazine "polaroid on a poster" feel.
- FAQ: keep on cream.
- Contact `#contact` block: currently `bg-ink` → `bg-violet`. CTA pill stays `bg-cream text-violet`.

### Promotional ribbon
- `Navigation.tsx` ribbon: `bg-primary` → `bg-violet` (consistent — `--primary` purple is a different hue from the editorial violet, so we standardise on violet).

## 3. Token cleanup

In `src/index.css`:
- `--gold: 249 100% 87%;` (lavender — this is the only accent token now).
- Remove: `--accent-a`, `--accent-b`, `--accent-c`, `--pill-highlight` (unused after switcher removal — or repoint `--pill-highlight` to `--gold`).
- `--violet` unchanged (`249 56% 40%` / `#3D2D9E`).

In `tailwind.config.ts`:
- Remove unused `'supply-lavender'` and `'supply-lavender-dark'` legacy palette entries (they were the old purple system).

In `src/components/editorial/AccentSwitcher.tsx`:
- Delete the file. Remove its import + usage from `Index.tsx`.

## 4. Files touched

- `src/index.css` — token swap + cleanup
- `tailwind.config.ts` — palette cleanup
- `src/components/editorial/EditorialNavigation.tsx` — violet bar, inverted CTA
- `src/components/Footer.tsx` — violet footer
- `src/components/Navigation.tsx` — ribbon to violet
- `src/components/editorial/SupplierStrip.tsx` — violet band
- `src/components/editorial/TrustBar.tsx` — violet band
- `src/components/AboutSection.tsx` — violet section
- `src/pages/Index.tsx` — wrapper background, testimonials + contact bands, remove AccentSwitcher
- `src/pages/Products.tsx` — violet frame, cream content sheet
- `src/pages/ProductDetail.tsx` — violet hero band, cream specs sheet, inverted CTA
- `src/pages/Resources.tsx`, `SleepChoice.tsx`, `SupportAtHome.tsx`, `RentToBuy.tsx`, `Quote.tsx`, `QuoteConfirm.tsx`, `TermsConditions.tsx`, `NotFound.tsx` — violet page wrapper, cream content sheets
- `src/components/editorial/AccentSwitcher.tsx` — delete

## Out of scope

- Layout, copy, components, routing — unchanged.
- Product card internals — unchanged.
- Quote system, Supabase, SEO — unchanged.

## Verification

- Italic accent words across the site render in lavender `#C4BAFF`, not gold.
- Page backgrounds for Products, ProductDetail, Resources, etc. are violet with cream content panels — cream is the panel, not the page.
- Footer is violet, not near-black.
- Nav bar is violet with a cream "Start your quote" pill.
- AccentSwitcher widget is gone.
- Hero is unchanged (already violet) and now reads as the establishing shot for a violet-led identity.

