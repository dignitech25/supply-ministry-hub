

# Add gold accent colour to hero

Match the reference screenshot by introducing a warm gold accent for italic emphasis words in the hero.

## Change

Add a new design token and apply it to two places in `EditorialHero.tsx`:

**New token (added to `src/index.css` + `tailwind.config.ts`):**
```text
--gold: #C9A55C   (warm amber/gold for italic accents)
```
Mapped to Tailwind as `text-gold`.

**Applied to:**
1. The italic word **"changes"** in the headline — currently `rgba(244,239,230,0.38)` (washed-out cream), changes to `hsl(var(--gold))`.
2. The italic stat suffixes **`+`**, **`hr`**, **`yr`** — currently `rgba(244,239,230,0.28)`, change to `hsl(var(--gold))`.

The mobile layout uses the same suffix/accent styling, so it gets updated in both the desktop and mobile blocks of `EditorialHero.tsx`.

## Files touched

- `src/index.css` — add `--gold: 36 50% 58%;` HSL token under `:root`
- `tailwind.config.ts` — add `gold: "hsl(var(--gold))"` to `colors`
- `src/components/editorial/EditorialHero.tsx` — replace the two cream-with-alpha colours on the headline accent and stat suffixes (4 occurrences total across desktop + mobile)

## Out of scope

No other colours, layouts, or components change. The cream/violet/ink palette and all other hero details stay exactly as they are.

