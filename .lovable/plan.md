## Goal
The four vertical audience labels in the left rail of the desktop hero ("Occupational therapist", "Aged care provider", "Support coordinator", "NDIS participant") feel bunched up and run into each other. Add visual breathing room so each label sits cleanly within its tab.

## File
`src/components/editorial/EditorialHero.tsx` — the desktop vertical tab list (lines ~70–102).

## Changes

1. **Add vertical padding inside each rotated label** so the text doesn't reach the top/bottom edges of its tab (which is what makes adjacent labels look glued together).
   - Add `py-6` (or `paddingTop`/`paddingBottom` on the rotated span) so each label has clear whitespace above and below it.

2. **Loosen the letter-spacing slightly** from `0.16em` to `0.22em` so the characters within each label breathe a bit, matching the airier editorial feel of the rest of the hero.

3. **Strengthen the divider lines between tabs** from `border-white/[0.06]` to `border-white/[0.10]` so the tab boundaries are perceptible without becoming heavy. This makes it visually clear where one label ends and the next begins.

4. **Nudge inactive label opacity up a touch** (from `rgba(255,255,255,0.3)` to `rgba(255,255,255,0.4)`) so all four labels are evenly legible — currently the contrast difference also contributes to a "crowded" feel where active label dominates.

No copy changes, no layout/grid changes, mobile horizontal tabs stay as-is.

## Verification
- View `/` at desktop width (≥960px). The four vertical tabs should each have visible padding above/below the text, the dividers between them should be subtly visible, and the labels should no longer appear to run into one another.