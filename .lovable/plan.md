I can see the problem now: the current approach is still using one long rotated string per tab. At this viewport, the longest label is too close to the next tab area, so tweaking padding and letter spacing was the wrong level of fix.

Plan:

1. Replace the desktop left rail labels with a clearer, more robust tab design.
   - Stop rendering each audience label as one long vertical sentence.
   - Use two-line horizontal labels inside each tab instead, for example:
     - Occupational / therapist
     - Aged care / provider
     - Support / coordinator
     - NDIS / participant
   - This removes the overlap risk completely and makes each tab readable at a glance.

2. Give each tab a proper separated block.
   - Keep the four equal-height tab areas.
   - Add internal padding and a stronger divider between tabs.
   - Keep the active cream indicator on the right edge.
   - Use the existing purple, cream, Geist, and muted opacity styling so it still matches the hero.

3. Add accessible labels so nothing is lost.
   - The visible label can be split over two lines.
   - The button will still expose the full audience label for screen readers through `aria-label`.

4. Verify visually in the browser, not just by guessing.
   - Open `/` at the same desktop viewport the user is seeing, around 1366 x 768 or 1336 x 902.
   - Inspect the hero rail after the change.
   - Confirm each audience label sits inside its own tab, with no letters crossing into the next tab and no unclear bunched grouping.

Technical change:

- Update only `src/components/editorial/EditorialHero.tsx`.
- Add an optional display label array to each audience item, or derive it locally.
- Replace the `writingMode: "vertical-rl"` and `rotate(180deg)` span with a small stacked label block.
- Leave mobile tabs unchanged.