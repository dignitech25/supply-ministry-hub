

# Apply editorial design system uniformly across all pages

The editorial palette (cream background, ink text, gold accent, Fraunces + Geist typography) currently lives only on the homepage. Every other route still uses the old purple-on-white shell with the legacy `Navigation`, the old `HeroSection`-style buttons, and orange CTAs. This plan rolls the editorial system out site-wide.

## Audit — what's wrong right now

- **Navigation**: only `Index.tsx` uses `EditorialNavigation`. `Products`, `ProductDetail`, `Quote`, `QuoteConfirm`, `RentToBuy`, `Resources`, `SleepChoice`, `SupportAtHome`, `TermsConditions`, `NotFound`, `AdminCategoryQA` all still import the legacy `Navigation`.
- **Background/text colour**: most pages render on `bg-background` (white) with `text-foreground` (black/purple), not `bg-cream text-ink`.
- **Headings**: still use default `Inter` + `font-bold`; the editorial system uses `font-fraunces` for display, with selective `italic` + `text-gold` accents.
- **Buttons**: residual `bg-primary` (purple) and any remaining `bg-orange-*` need to become `bg-ink text-cream hover:opacity-90`.
- **Footer**: kept as-is structurally but recoloured to cream/ink so it doesn't clash with the new pages.

## Changes

### 1. Global page shell

Swap on every non-Index route:

- `<Navigation />` → `<EditorialNavigation />`
- Outer wrapper `bg-background` → `bg-cream`, `text-foreground` → `text-ink`
- Top padding adjusted so content clears the 62px sticky editorial nav

Pages touched:
`Products.tsx`, `ProductDetail.tsx`, `Quote.tsx`, `QuoteConfirm.tsx`, `RentToBuy.tsx`, `Resources.tsx`, `SleepChoice.tsx`, `SupportAtHome.tsx`, `TermsConditions.tsx`, `NotFound.tsx`.
(`AdminCategoryQA.tsx` left as-is — internal tool.)

### 2. Typography pass

For each page above:

- Page-level `h1` / hero headline → `font-fraunces font-light text-ink` with one keyword italicised in `text-gold` where it reads naturally (e.g. Products: "Equipment that *delivers*"; Resources: "Practical *guidance*"; SleepChoice: "Sleep that *restores*"; RentToBuy: "Try before you *commit*"; SupportAtHome: "Support at *home*"; Quote: "Request a *quote*"; TermsConditions: "Terms & *conditions*"; NotFound: "Page not *found*").
- Section `h2` → `font-fraunces font-light` (no italic by default).
- Body copy stays Geist/Inter (already the project default).
- Eyebrow labels (small uppercase) → `font-geist text-[11px] tracking-[0.18em] uppercase text-muted-body`.

### 3. Button + CTA pass

- Replace any remaining `bg-primary` / `bg-orange-*` button surfaces across the listed pages with `bg-ink text-cream hover:opacity-90 rounded-full` (rounded-full only on hero/CTA buttons; secondary inline buttons keep their existing radius).
- Outline/secondary buttons → `border border-ink/20 text-ink hover:bg-ink hover:text-cream`.
- Links inside prose → `text-ink underline decoration-gold underline-offset-4 hover:decoration-ink`.

### 4. Card / surface pass

- Cards on cream pages: `bg-white` → `bg-cream-alt` (slightly deeper cream), `border-border` → `border-cream-border`, shadow softened.
- Inputs on cream backgrounds: `bg-white border-cream-border` with `focus:ring-ink/20`.
- Product cards keep their image area but pick up `border-cream-border` and ink/cream button styling.

### 5. Footer recolour

`Footer.tsx` — change root background to `bg-ink text-cream/80` with `text-cream` for headings and `text-cream/60` for fine print, so the footer reads as the dark counterpart to the cream pages (matches the existing `bg-ink` contact section on the homepage).

### 6. `index.html` body fallback

Set `<body class="bg-cream text-ink">` so navigations between routes never flash white. Update `theme-color` meta to the cream/ink pair.

### 7. SEO + Floating CTA stay as-is

`SEO.tsx`, `FloatingSmartCTA.tsx`, the quote system, and Supabase integrations are not touched beyond colour classes already updated previously.

## Out of scope

- `EditorialHero.tsx`, `EditorialNavigation.tsx`, `SupplierStrip.tsx`, `TrustBar.tsx` — already correct.
- Routing, Supabase data, quote system, product DB.
- AdminCategoryQA internal tool.
- `AccentSwitcher` stays mounted on Index only (review tool).

## Files touched

- `index.html` — body classes + theme-color.
- `src/components/Footer.tsx` — recolour to ink/cream.
- `src/pages/Products.tsx`
- `src/pages/ProductDetail.tsx`
- `src/pages/Quote.tsx`
- `src/pages/QuoteConfirm.tsx`
- `src/pages/RentToBuy.tsx`
- `src/pages/Resources.tsx`
- `src/pages/SleepChoice.tsx`
- `src/pages/SupportAtHome.tsx`
- `src/pages/TermsConditions.tsx`
- `src/pages/NotFound.tsx`

Each page change is mechanical: nav swap → wrapper colour swap → headline typography swap → button class swap → card surface swap. No structural/layout changes, no copy rewrites beyond the single italicised keyword in each h1.

## Verification after change

- Navigate to every route listed: cream background, ink text, the editorial sticky nav at top, ink/cream pill CTAs, gold-italic accent on the page h1, dark-ink footer.
- No purple buttons or orange surfaces remain anywhere in user-facing pages.
- Accent switcher on `/` still recolours every gold accent globally (since pages share `--gold`).

