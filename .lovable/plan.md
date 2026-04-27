## Goal
Lift body-copy contrast across the site so paragraphs are comfortably readable on both cream and purple sections, without changing the overall brand feel.

## Current problem
- **On purple (`bg-violet`)**: paragraphs use `text-cream/60`, `/70`, `/75`. At ~60–75% opacity over saturated purple, contrast falls below WCAG AA for body text.
- **On cream (`bg-cream`)**: `text-muted-body` is `#7A7060` (warm taupe). Elegant, but reads as washed-out at 14–18px.
- **Italic accents** in headings use `text-gold` = `#C4BAFF` (lavender). Per your choice, we will switch these to warm cream/white for max readability and a clean monochrome feel on purple.

## Changes

### 1. Token updates (`src/index.css`)
Adjust the two tokens driving most of the issue:
- `--muted-body`: `35 12% 43%` → `30 15% 28%` (about `#544637` — still warm and editorial, but ~AA-compliant on cream).
- `--gold`: `249 100% 87%` → `36 32% 93%` (alias to cream `#F4EFE6`). This makes every existing `text-gold` / `fill-gold` automatically render as warm cream on purple, no per-component edits required for accents.
- Leave `--pill-highlight` pointing at the old lavender so any decorative pill chips keep their tint (we can revisit if you prefer).

Dark-mode block: no changes (homepage doesn't use dark mode).

### 2. Sweep low-opacity cream body copy
Replace washed-out paragraph opacities with a single readable value (`text-cream/85`) on these paragraph-level usages. Headings, eyebrow labels (`/60` uppercase micro-labels), and footer captions stay untouched per your "body copy only" scope.

Files and specific lines to update:
- `src/pages/Index.tsx`
  - L127 testimonials subhead `text-cream/75` → `text-cream/85`
  - L188 contact section paragraph `text-cream/75` → `text-cream/85`
  - (Leave L125, L186 eyebrow `cream/60` and L209 footer caption `cream/50` as-is — they're labels, not body.)
  - (Leave contact email links L200, L205 `cream/70` — they have hover-to-solid-cream and are link affordances; bump only if you want.)
- `src/components/AboutSection.tsx`
  - L55 lead paragraph `text-cream/75` → `text-cream/85`
  - L72 value-card description `text-cream/70` → `text-cream/85`
- `src/components/editorial/EditorialHero.tsx` — audit any `cream/60-75` body paragraphs and lift to `/85` (eyebrow labels stay).
- Quick `rg` sweep across `src/pages/*.tsx` and `src/components/**` for `text-cream/(60|65|70|75)` on `<p>` elements; lift to `/85`. Leave matches on `<span>` eyebrow labels, captions, and link hovers.

### 3. No change to
- `text-gold` usages — they automatically become warm cream via the token change.
- Eyebrow micro-labels (`text-cream/60`, `text-muted-body uppercase tracking-[0.18em]`) — these are intentional low-emphasis labels and meet AA at their small + tracked sizing.
- Buttons, borders, dividers.

## Verification
After applying:
- Spot-check homepage hero, About, Sleep Choice, Testimonials, Contact, FAQ.
- Confirm italic accent words ("solutions", "Choice", "say", "started") read as warm cream on purple.
- Confirm cream-section paragraphs (Sleep Choice steps, About story, founders) read noticeably darker.
- Run a quick contrast pass (cream/85 on `--violet` ≈ AA; new muted-body on cream ≈ AA).

## Out of scope
- Accent color experiments (gold/amber, darker periwinkle) — can revisit if you want a non-monochrome look later.
- Eyebrow labels and footer captions.
- Dark mode tokens.
