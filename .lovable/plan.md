# MedHealth catalogue: travelling pill indicator + leaner mobile toolbar

## 1. One travelling "active" pill (scroll or tap)

Today the solid violet fill stays on "All" while scrolling and the section in view only gets a lighter tint. That is wrong. There should be exactly one solid violet pill at any moment, and which pill that is changes as you scroll.

Behaviour:
- Scrolling into Bathing & showering moves the solid fill onto that pill. Same for Dressing & reaching and Transfers & positioning.
- Scrolling back above the first section returns the solid fill to "All".
- Tapping a pill filters as it does now and that tap wins: the tapped pill becomes the active one and scroll no longer reassigns it while a filter or search is applied.
- Only one visual treatment. No separate "spied" style. Same solid violet pill, just re-assigned.

Motion:
- The fill stops being a per-pill background and becomes a single absolutely positioned violet "puck" behind the pill row that animates to the active pill, using a transform-based transition (about 220ms, ease-out) so it slides rather than snaps.
- Pill label colour cross-fades (cream on active, ink on inactive) over the same duration.
- The puck must land exactly under the active pill: measure each pill with getBoundingClientRect relative to the strip, and re-measure on resize, on font load, and when the horizontal pill strip is scrolled, so it stays correct on mobile where the strip scrolls sideways.
- If the active pill sits off-screen inside the scrollable strip, scroll it into view so the indicator is visible.
- Respect prefers-reduced-motion: reposition instantly, no slide.

Technical notes:
- Keep the existing IntersectionObserver on section headings (rootMargin offset by the sticky header height) as the scroll source of truth; it already picks the topmost visible section.
- Replace the two-state styling (selected vs spied) with a single derived activePill: the tapped tab when a filter or search is active, otherwise the scroll-derived category, defaulting to "All".
- Purely visual: scroll never changes tab, never changes filtering or what is rendered.

## 2. Mobile toolbar cleanup

- Hide the "Catalogue home" button and the "Export" button below the sm breakpoint (hidden sm:flex). Both stay unchanged on tablet and desktop.
- Search already flexes, so it takes the full freed width on mobile; drop the stacked column layout so mobile reads as a single full-width search field.
- Catalogue home stays reachable on mobile via the masthead logo lockup, which already resets search and scrolls to top.

## Files
- `src/pages/MedHealthCapability.tsx` (pill row, indicator, toolbar responsive classes)