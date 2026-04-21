

# Apply gold accent to horizontal menu

Bring the top navigation in line with the warm gold accents now used in the hero ("changes", `+`, `hr`, `yr`).

## Change

In `src/components/editorial/EditorialNavigation.tsx`:

- **Nav links** (Products · Suppliers · About · Contact) — change default colour from `text-muted-label` (washed-out cream `#C4BFB5`) to `text-gold` (`#C9A55C`). Hover stays `text-ink` for clear feedback.
- Keep everything else identical: cream background, ink-on-cream Fraunces logo, dark pill "Start your quote" CTA, 62px height, sticky.

No new tokens needed — `--gold` already exists from the previous step.

## Files touched

- `src/components/editorial/EditorialNavigation.tsx` — single className change on the nav link `<a>` element.

## Out of scope

Logo wordmark, CTA pill, layout, spacing, and the rest of the page all stay exactly as they are.

