

# Restore vertical audience tabs (match reference)

The reference image shows the audience tabs as a narrow **vertical strip on the far left** of the hero — not the horizontal row currently in place. Restore the original three-column desktop layout.

## Target layout (desktop, ≥1024px)

```text
┌──┬─────────────────────────────┬──────────────────────┐
│  │                             │                      │
│T │   "They understood…"        │   [photo zone        │
│A │                             │    cream, geometric  │
│B │   Equipment                 │    SVG, camera icon] │
│S │   that changes              │                      │
│  │   lives                     ├──────────────────────┤
│  │                             │   YOU ARE            │
│  │   We connect the people…    │   An occupational    │
│  │                             │   therapist          │
│  │   ─────────                 │   You know what…     │
│  │   468+   48hr   3yr         │   Find products  →   │
└──┴─────────────────────────────┴──────────────────────┘
```

Three columns: `[~52px tabs] [1fr violet content] [42% cream panel]`.

## Tab strip details (left column)

- Width: ~52px, full height of hero, violet background, right border `border-white/[0.06]`.
- Each tab: equal vertical share, separated by horizontal hairlines (`border-b border-white/[0.06]`).
- Label inside each tab uses `writing-mode: vertical-rl` + `transform: rotate(180deg)` so text reads bottom-to-top.
- Typography: `font-geist uppercase text-[10px] font-light`, letter-spacing `0.16em`.
- States:
  - default: `rgba(255,255,255,0.3)`
  - hover: subtle `bg-white/[0.03]`
  - active: `bg-white/[0.07]` + label colour `rgba(255,255,255,0.8)` + thin cream accent line on the right edge.
- Four tabs in current order: Occupational therapist · Aged care provider · Support coordinator · NDIS participant.

## What stays exactly as-is

- Centre violet content panel (quote, "Equipment that *changes* lives" headline with gold italic, paragraph, stats row with gold suffixes).
- Right cream column (photo placeholder with geometric SVG + Camera icon, then "You are / audience name / description / CTA" panel).
- Mobile layout (horizontal scrollable tab pills) — unchanged.
- All colours, fonts, padding inside the existing two right-hand columns.

## Files touched

- `src/components/editorial/EditorialHero.tsx` — replace the desktop block (`hidden lg:flex lg:flex-col`) with the three-column grid: `lg:grid-cols-[52px_1fr_42%]`. Re-add the vertical tab column with `writing-mode: vertical-rl` rotated labels. Remove the horizontal tab row added in the previous step.

## Out of scope

Mobile layout, navigation menu, hero copy, stats values, gold accent colour, and all other components stay untouched.

