

# Add accent switcher and replace orange CTAs with ink

Two scoped changes for the editorial review pass: a temporary accent-colour toggler so we can audition three palettes against the live page, and a global swap of the leftover orange CTAs to the ink/cream pairing that matches the new design system.

## 1. Three accent variants in `src/index.css`

Inside `:root`, add:

```css
--accent-a: 38 52% 60%;   /* Warm gold #C8A96E */
--accent-b: 142 25% 65%;  /* Soft sage #8FBF9F */
--accent-c: 25 55% 75%;   /* Pale coral cream #E8C4A8 */
```

Change the existing `--gold` token to reference `--accent-a` by default:

```css
--gold: var(--accent-a);
```

Everything that already consumes `hsl(var(--gold))` (hero italic "changes", `+`/`hr`/`yr` stat suffixes, nav links, etc.) will pick up the active accent automatically.

## 2. New `src/components/editorial/AccentSwitcher.tsx`

Create the component exactly as specified in the brief: a fixed-position pill in the bottom-right with an "ACCENT" label and three coloured circular buttons (A/B/C). Clicking a circle calls `document.documentElement.style.setProperty("--gold", accent.var)`, which live-updates every consumer of `--gold` across the page. Active state shown via a 2.5px solid ring + 2px outline in the accent's own colour.

## 3. Mount the switcher in `src/pages/Index.tsx`

Import `AccentSwitcher` and render `<AccentSwitcher />` as the last child inside `<main>`, just before `</main>`. Review-only — flagged for removal before launch.

## 4. Replace orange CTAs with ink/cream

In each of the following files, swap any `bg-orange-500` → `bg-ink`, add `text-cream`, and replace `hover:bg-orange-600` → `hover:opacity-90`. Where the existing class string already includes a different text colour (e.g. `text-white`), drop it in favour of `text-cream`. Where `text-orange-500`/`text-orange-600` is used for icons or accents inline (not on a button), leave it alone — only the CTA button surfaces change.

Files to touch:

- `src/components/AboutSection.tsx`
- `src/components/HeroSection.tsx` (legacy hero — confirm it's not imported by the live homepage; if unused, still update for consistency)
- `src/components/FloatingSmartCTA.tsx`
- `src/components/FloatingQuoteButton.tsx`
- `src/components/ProductCategoryCards.tsx`
- `src/components/ProductCategories.tsx`
- `src/components/QuoteForm.tsx`

Resulting button class pattern: `bg-ink text-cream hover:opacity-90` (keeping any existing `transition-*`, sizing, padding, and shape utilities intact).

## 5. Explicitly out of scope

No changes to: `EditorialHero.tsx`, `EditorialNavigation.tsx`, `SupplierStrip.tsx`, `TrustBar.tsx`, Supabase integrations, routing, the quote system, or any product pages.

## Files touched

- `src/index.css` — add three accent variables, repoint `--gold`.
- `src/components/editorial/AccentSwitcher.tsx` — new file.
- `src/pages/Index.tsx` — import + mount switcher inside `<main>`.
- 7 component files listed above — orange → ink/cream class swap only.

## Verification after change

- Three coloured dots appear bottom-right; clicking each instantly recolours the hero italic "changes", the stat suffixes (`+`, `hr`, `yr`), and the nav links.
- No orange remains on any CTA button across homepage, floating CTAs, about section, category cards, or quote form. Buttons render as dark ink with cream text and a subtle opacity hover.
- Editorial hero, nav, supplier strip, and trust bar are visually unchanged apart from the accent recolour.

