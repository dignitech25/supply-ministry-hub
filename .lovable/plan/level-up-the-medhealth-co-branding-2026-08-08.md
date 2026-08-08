# Level up the MedHealth co-branding

Right now the page reads as a Supply Ministry catalogue with a MedHealth wordmark dropped into the H1 and the footer. The palette is a hand-mixed blend, and MedHealth's own brand language is barely present. The goal is a page that feels like it was built specifically for MedHealth's team, while still clearly being Supply Ministry's document.

## The ownership rule stays

Supply Ministry leads the masthead and owns every action colour (buttons, active tabs, selection bar). MedHealth's palette sets the ground and mood only. The footer disclaimer stays as-is: prepared for, not endorsed by.

## What changes

**1. A proper "Prepared for" lockup, not a logo in a headline**

Replace the current masthead with a two-part lockup: Supply Ministry mark on the left, a thin vertical rule, then a small "Prepared for" label above the MedHealth wordmark on the right. Pull the MedHealth logo out of the H1 so the headline is plain type and reads cleanly. The badge chip becomes "Dedicated catalogue, August 2026".

**2. Colour weight correction**

The current top gradient bar runs through four colours and lands on MedHealth amber, which is louder than MedHealth's own site uses it. Reduce to a two-tone rule: Supply Ministry violet into MedHealth's deep teal, with amber used only as a thin terminal accent. Ground the page in warm cream throughout, with exactly one full-strength tinted band (the kits row) for variation.

**3. A partner context band above the catalogue**

A short cream-on-teal band that names why this selection exists: the clinical scope it was built around (injury rehabilitation and return-to-work OT), how pricing works, and how a quote comes back. Three short lines, no bullet clutter. This is the piece that signals research rather than a generic catalogue.

**4. Fluency details**

- Section headings and category chips adopt MedHealth's ink colour rather than the blended navy.
- Kit cards get a "Built for MedHealth caseloads" line.
- The review sheet confirmation names MedHealth explicitly so the sent quote feels routed, not generic.

**5. Make it a template, not a one-off**

Move every partner-specific value into a single commented config object at the top of one file: partner name, ink, ground, accent, rule, logo path, scope line, footer disclaimer. Everything below is structurally invariant, so the next partner is a config entry.

## Technical notes

- New file `src/partners/medhealth.ts` holding the config object; `MedHealthCapability.tsx` reads from it and maps it onto the existing CSS custom properties so no component needs restyling from scratch.
- `Brand.tsx` gains a `PartnerLockup` component for the masthead pairing.
- New small component for the context band under `src/components/medhealth-catalogue/`.
- No database, route, or data-fetching changes. `noindex, nofollow` and the unlisted route stay.
- No em dashes anywhere in the copy.

## Before I build

I will verify MedHealth's current live brand colours and confirm the trading entity name before writing any hex values or the scope line, rather than keeping the existing guessed blend.
