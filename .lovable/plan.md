

# Finish the homepage editorial rollout properly

The homepage is still a hybrid of two design systems. The top of the page uses the editorial system, but several below-the-fold sections are still legacy purple/orange or default Tailwind styling. The uploaded screenshot confirms the contact CTA block is still the old purple gradient with an orange button, which is why the homepage does not read as a uniform editorial page yet.

## What is still wrong on `/`

### Legacy homepage shell still present
- `src/pages/Index.tsx` still uses `bg-background` at the page root instead of `bg-cream`.
- The homepage contact section is still the old purple gradient block:
  - `bg-gradient-to-br from-primary to-primary/85`
  - orange CTA button
  - white text styling
- The Sleep Choice section and Testimonials section still use old typography, old cards, and old brand colours.

### Below-fold sections are still old-system components
These homepage sections are still rendering with legacy styling:
- `src/components/FeaturedProducts.tsx`
- `src/components/ProductCategoryCards.tsx`
- `src/components/AboutSection.tsx`
- `src/components/FAQSection.tsx`

Common issues across them:
- `bg-background`, `bg-soft-gray`, `bg-card`
- `font-bold` instead of editorial display styling
- `text-primary` / `bg-primary`
- orange CTA buttons
- default white cards and standard borders instead of cream surfaces

## Implementation scope

Do not rebuild:
- `EditorialHero.tsx`
- `EditorialNavigation.tsx`
- `SupplierStrip.tsx`
- `TrustBar.tsx`

Only bring the rest of the homepage into the same editorial system those components already use.

## Changes

### 1. Fix the homepage root shell
In `src/pages/Index.tsx`:
- Change outer wrapper from `bg-background` to `bg-cream text-ink`
- Keep the existing homepage structure and section order
- Keep `AccentSwitcher` mounted for review

### 2. Rebuild the homepage mid-page sections into the editorial language
Apply the same visual system already established by the hero/nav:

#### Sleep Choice block in `Index.tsx`
Convert to editorial styling:
- cream section background
- Fraunces heading with lighter weight
- muted body copy using `text-muted-body`
- `bg-cream-alt border border-cream-border` card
- step numbers restyled away from `bg-primary`
- primary CTA changed to `bg-ink text-cream hover:opacity-90`
- outline CTA changed to `border border-ink/20 text-ink hover:bg-ink hover:text-cream`

#### Testimonials block in `Index.tsx`
Convert to editorial styling:
- editorial heading treatment
- cream/cream-alt surfaces
- `border-cream-border`
- star colour driven by `text-gold` instead of orange
- quote marks and metadata recoloured to muted ink/gold tones
- remove remaining `text-primary` usage

#### Contact block in `Index.tsx`
This is the main visible failure from the screenshot and needs a full restyle:
- remove the purple gradient entirely
- replace with an editorial section, preferably `bg-ink text-cream`
- use understated uppercase eyebrow
- restyle headline with Fraunces/light weight
- CTA button becomes ink/cream or cream/ink depending on final section contrast
- contact names, email, phone, and hours recoloured to match editorial palette
- keep all links functional

### 3. Editorial-pass the reusable homepage components

#### `src/components/FeaturedProducts.tsx`
- section background: `bg-cream`
- headings: Fraunces/light
- product cards: `bg-cream-alt border-cream-border`
- price styling: replace `text-primary` emphasis with editorial ink/gold treatment
- “Add to Quote” button: `bg-ink text-cream hover:opacity-90`
- outline buttons updated to editorial outline styling
- loading skeleton section should also sit on cream, not white

#### `src/components/ProductCategoryCards.tsx`
- section background: `bg-cream`
- heading and subcopy restyled to editorial typography
- category cards: `bg-cream-alt border-cream-border`
- orange icon treatment removed in favour of muted ink/gold-accent styling
- bottom CTA panel brought into editorial surface styling

#### `src/components/AboutSection.tsx`
- replace default bold headings with Fraunces/light
- update cards and story panel to editorial cream surfaces
- reduce `bg-primary/10` / `text-primary` dependency in value/founder icon treatments
- keep content intact, only change visual language

#### `src/components/FAQSection.tsx`
- editorial heading styling
- cream background
- accordion rows with softer cream borders and ink text
- muted body copy adjusted to `text-muted-body`

### 4. Keep accent behaviour consistent
Anything that should respond to the accent switcher should use `text-gold`, `border-gold`, or `hsl(var(--gold))` where appropriate. That includes:
- decorative emphasis in headings
- stars or small accents in testimonial/review styling
- subtle dividers/highlights where gold is already part of the editorial system

### 5. What not to touch
Leave untouched:
- editorial hero
- editorial nav
- supplier strip
- trust bar
- routing
- Supabase logic
- quote system behavior
- product pages

## Files to update

- `src/pages/Index.tsx`
- `src/components/FeaturedProducts.tsx`
- `src/components/ProductCategoryCards.tsx`
- `src/components/AboutSection.tsx`
- `src/components/FAQSection.tsx`

## Verification

After the change, the homepage should read as one coherent design system from top to bottom:
- no purple gradient contact section
- no orange CTA buttons
- no white/default cards breaking the cream palette
- no obvious `text-primary` / `bg-primary` legacy styling in homepage sections
- contact block visually matches the editorial homepage instead of the old site
- accent switcher still updates gold-accented details consistently

