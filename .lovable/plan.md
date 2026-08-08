# MedHealth catalogue: masthead, sticky offset, scroll-spy

## 1. Mobile presence for the MedHealth mark

Today the partner mark renders at `text-[16px]` below `sm`, against a 40px Supply Ministry logo (`h-10`), so it reads as roughly 40 percent of the lead mark and disappears inside the ministack.

Proposal, mobile only (under 640px), desktop and tablet untouched:

- MedHealth mark: **16px to 24px** (`text-[24px]`, the logo is sized in `em` off font-size), keeping `sm:text-[19px]` as is.
- Supply Ministry mark on mobile: stays at **40px** (`h-10`). Ratio becomes 24:40, about 60 percent. Present, still clearly secondary.
- Partner mark opacity: raise from `0.9` to **1.0** on mobile so it is not additionally muted at small size.
- "Prepared for" eyebrow: keep 9px uppercase, tighten the gap under it from 7px to **5px** so the ministack does not grow taller.
- Divider hairline: unchanged at 32px, still separates cleanly.

Guardrail: the partner mark never exceeds 60 percent of the Supply Ministry mark height at any breakpoint.

## 2. Sticky masthead and toolbar offset

Current: masthead is `sticky top-0`, toolbar is `sticky top-[65px]`. The masthead lockup uses `flex-wrap`, so on narrow viewports it can wrap and grow past 65px, and the toolbar then collides with it.

Recommended approach: **restructure into a single shared sticky container**. Wrap masthead and toolbar in one `sticky top-0 z-40` element; they stack normally inside it, so no offset math exists to be wrong. Preferred over measuring because:

- It removes the failure mode instead of tracking it. No ResizeObserver, no state, no re-render on resize, no first-paint flash at a stale offset.
- The two bars already share a background family and a border, so they read as one control surface.
- Raleway webfont load and logo image load both change masthead height after first paint. A measured value has to survive those; a shared container does not care.

Details:
- One wrapper: `sticky top-0 z-40`. The gradient rule stays above it, non-sticky.
- Masthead keeps its cream background and bottom hairline; toolbar keeps its translucent white background and bottom border. Backgrounds stay opaque enough that content does not show through the seam.
- The intro heading block currently sits between the two bars. It moves **below** the sticky wrapper so it scrolls away normally.
- Remove `top-[65px]` and the second `sticky` entirely.
- Fallback only if the shared container reads wrong visually: measure the masthead with a ResizeObserver and drive the toolbar offset from a CSS custom property. Second choice.

## 3. Scroll-spy on the category pills

Goal: pills highlight the section in view, without changing what is filtered.

Approach: **IntersectionObserver on each group section**, not just the heading, with a `rootMargin` defining a reading band just under the sticky header.

- Each group `<section>` gets a ref, registered in an observer created once per set of visible groups.
- `rootMargin: "-<headerHeight>px 0px -55% 0px"` so a section counts as active only while it occupies the band directly under the sticky bars. Header height comes from the shared sticky container (measured once, or exposed as a CSS variable), which item 2 makes straightforward.
- On change, pick the entry closest to the top of the band and set `spyGroup`. Sections map to pills through the existing `normaliseCategory` / `groupOf` helpers, since section keys are raw `clinical_group` values and pills are the normalised `CATEGORIES`.
- Observer is disabled when `tab !== "All"` or a search query is active, since only one group is on screen then and spy adds nothing.

Tap state vs scroll state:
- `tab` stays the single source of truth for filtering. `spyGroup` is display only.
- A pill uses the solid violet "selected" style only when `tab === c`. When `tab === "All"`, the pill matching `spyGroup` gets a **distinct lighter treatment**: violet text, violet border, pale violet fill. Different enough that it never looks like a filter is applied.
- Tapping a pill sets `tab` and scrolls to top. Spy is suppressed at that point, so tap always wins.
- Returning to "All" re-enables spy, which recomputes on the next scroll frame.
- `aria-pressed` stays bound to `tab` only. The scroll indicator is decorative, so screen readers are never told the filter changed when it did not.
- Optional, low cost: keep the spied pill visible in the horizontally scrolling pill row on mobile via `scrollIntoView({ inline: "nearest", block: "nearest" })`, guarded so it never scrolls the page.

## Technical notes

Files touched:
- `src/components/medhealth-catalogue/Brand.tsx` — mobile sizing of `MedHealthLogo`, ministack gap.
- `src/pages/MedHealthCapability.tsx` — shared sticky container, removal of `top-[65px]`, heading block repositioned, section refs, observer wiring, pill spy styling.
- Possibly a small `useScrollSpy` hook under `src/hooks/` if the observer logic outgrows the page component.

No data layer, no Supabase, no copy changes. No em dashes.