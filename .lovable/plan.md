

# Supply Ministry Homepage Redesign

A complete visual and structural redesign of the homepage hero, supplier strip, and trust bar following the new design system. This replaces the current purple/orange CTA-driven hero with an editorial, audience-segmented experience built around a vertical tab system.

## Scope

This plan covers **only the homepage above-the-fold redesign**: navigation bar, hero (3-column layout with vertical audience tabs), supplier strip, and trust footer bar. Subsequent sections (How it works, category grid, testimonial, segment cards, footer) are noted as follow-ups but not built in this pass.

## What changes

**Replaced:**
- `HeroSection.tsx` — entirely rebuilt with the 3-column editorial layout
- `Navigation.tsx` — homepage variant with cream background, simplified links, single dark CTA
- `BrandTrustStrip.tsx` — replaced with text-only supplier pills (no marquee logos)

**Added:**
- New trust footer bar component (4 statements on near-black background)
- New design tokens for the editorial palette (deep violet, warm cream, near-black, etc.)
- Google Fonts import for Cormorant Garamond, Fraunces, and Geist

**Preserved (unchanged this pass):**
- All sections below the hero on `Index.tsx` (Featured Products, Categories, About, Sleep Choice, Testimonials, FAQ, Contact)
- All other routes and pages
- Logo asset (used in nav as text per spec, but file kept available)

## Design tokens (added to `index.css` + `tailwind.config.ts`)

```text
--violet:        #3D2D9E    (primary)
--cream:         #F4EFE6    (contrast surface)
--ink:           #1A1209    (footer / nav CTA)
--cream-border:  #DDD7CC
--muted-body:    #7A7060    (body on cream)
--muted-label:   #C4BFB5    (subtle labels)
--pill-highlight:#C4BAFF    (supplier pill border)
```

Mapped to Tailwind as `bg-cream`, `bg-violet`, `bg-ink`, `text-muted-body`, `border-cream-border`, etc. The existing global `--primary` (purple) and other shadcn tokens stay intact so the rest of the site is unaffected.

## Typography setup

Add to `index.html` `<head>`:
- Google Fonts: Cormorant Garamond (200, 200 italic), Fraunces (200, 200 italic), Geist (300, 400, 500)

Tailwind font families:
- `font-display` → Cormorant Garamond
- `font-serif-italic` → Fraunces
- `font-sans` → Geist (overrides current Inter usage on the homepage hero only)

## Component breakdown

**1. `EditorialNavigation.tsx`** (new, used on homepage only)
- 62px height, cream background, bottom border
- Logo as Fraunces italic text "Supply Ministry"
- 4 nav links + single dark pill CTA "Start your quote" → routes to `/quote`

**2. `EditorialHero.tsx`** (new)
- CSS Grid: `52px 1fr 42%`, min-height 520px
- **Column 1**: Vertical tabs with `writing-mode: vertical-rl` + `rotate(180deg)`, controlled component using local `useState` for active audience
- **Column 2**: Pull quote, headline (with italic accent on "changes"), body copy, stats row separated by top border
- **Column 3**: Image placeholder zone (with inline SVG geometric decoration — diagonal lines + concentric circles at 0.05 opacity) + audience panel that swaps content based on active tab with 200ms opacity fade

Audience content stored as a typed array of 4 objects (id, label, name, description, cta).

**3. `SupplierStrip.tsx`** (new)
- Cream background, "Our suppliers" label + vertical rule + 6 text pills
- 4 highlighted pills (violet text, light violet border): Aspire, Forte Healthcare, Novis, iCare Medical
- 2 standard pills (muted): Aidacare, Drive DeVilbiss

**4. `TrustBar.tsx`** (new)
- Near-black background, 4 uppercase trust statements separated by 2px dot dividers
- Wraps to 2 lines on mobile

## Interactions

- Vertical tab click: updates `activeAudience` state → right panel content fades out (opacity 0, 100ms) → swaps → fades in (opacity 1, 100ms). Implemented with a `key` prop + Tailwind `animate-fade-in` (already exists in the project).
- Nav link hover: color transitions to `#1A1209`
- Supplier pill hover: border color darkens
- Audience CTA arrow circle hover: fills with `#C4BAFF` at 20% opacity

## Responsive behavior (<900px)

- Hero grid collapses to single column
- Vertical tabs become a horizontal scroll-row of pills above the left panel (text un-rotated)
- Supplier strip pills wrap to multiple rows
- Trust bar wraps to 2 lines, dots hidden between wrapped statements

## Integration into `Index.tsx`

```text
<EditorialNavigation />          ← replaces <Navigation /> on homepage only
<main>
  <EditorialHero />              ← replaces <HeroSection />
  <SupplierStrip />              ← replaces <BrandTrustStrip />
  <TrustBar />                   ← new
  <FeaturedProducts />           ← unchanged
  ... rest of homepage unchanged
</main>
```

Other pages continue to use the existing `Navigation` component.

## Out of scope (follow-up sections noted in spec)

These are listed in the brief as "build next" and will be tackled in a follow-up once the hero is approved:
- Rolling supplier logo banner (animated)
- "How it works" 3-step section
- Product category grid (6 categories)
- OT testimonial
- "Who we work with" segment cards
- New footer with Dignitech attribution

## Constraints honored

- No gradients, no shadows (except optional subtle hover)
- No coral/orange/red/teal/green — orange CTAs removed from the new hero/nav (existing orange usage elsewhere on the homepage stays for now, to be addressed in the follow-up sections pass)
- Vertical tabs kept as core UX (not simplified)
- Supplier pills text-only, no logos
- Photography zone is a placeholder — no stock imagery used
- Only Cormorant Garamond, Fraunces, and Geist on the new components

## Open question

The brand memory currently mandates orange CTA buttons (`bg-orange-500`) site-wide and the existing logo PNG in the header. This redesign overrides both for the homepage hero/nav. After approval I'll update memory to scope the orange-CTA rule to non-homepage pages and record the new editorial design system as the homepage standard.

