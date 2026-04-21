

# Make vertical left-side tabs appear at your preview width

## Root cause

The hero in `EditorialHero.tsx` gates the three-column layout (vertical tabs on the left) behind Tailwind's `lg:` prefix, which is `min-width: 1024px`. Your current preview viewport is **1000px wide**, so it falls into the `lg:hidden` mobile branch — the one that renders the horizontal pill tabs across the top. The vertical layout is in the code, it just isn't being shown at this width.

## Fix

Lower the breakpoint at which the vertical layout activates so it appears at ~960px and above (covers your 1000px preview and all real desktop sizes), while keeping a true mobile fallback below that.

Concretely in `src/components/editorial/EditorialHero.tsx`:

1. **Desktop block** — change the wrapper from
   `hidden lg:grid lg:grid-cols-[52px_1fr_42%]`
   to
   `hidden min-[960px]:grid min-[960px]:grid-cols-[52px_1fr_42%]`.
2. **Mobile block** — change the wrapper from
   `lg:hidden`
   to
   `min-[960px]:hidden`.
3. No layout, copy, colour, or tab-styling changes inside either block — the existing vertical tab strip (52px wide, rotated `writing-mode: vertical-rl` labels, cream active indicator) is already correct and will simply now be visible at 960px+.

## Verification after the change

At 1000px the page should immediately show:

- A 52px-wide violet column on the far left containing four rotated labels (Occupational therapist · Aged care provider · Support coordinator · NDIS participant) reading bottom-to-top.
- The headline column in the middle.
- The cream image + audience panel on the right.

Below 960px (e.g. phones), the horizontal pill tabs continue to be used.

## Files touched

- `src/components/editorial/EditorialHero.tsx` — two className swaps on the two top-level layout wrappers (lines 66 and 263). Nothing else.

## Out of scope

Tab visual design, navigation, hero copy, gold accents, mobile pill design, and all other components stay exactly as they are.

