# MedHealth Context Band Simplification

## Problem
The cream three-column context band ("Why this selection / How pricing works / What happens next") on `/partners/medhealth-capability-2026` is visually heavy and text-heavy. It sits between the hero and the product catalogue and competes with the core objective: select items and request a quote.

## Goal
Reduce the section to a lightweight supporting strip that still answers the three questions, but does not distract from the catalogue.

## Changes
1. **Condense copy**
   - "Why this selection" → one short line explaining curation for injury rehab / return-to-work OT caseloads.
   - "How pricing works" → one short line about indicative RRP and formal quote confirmation.
   - "What happens next" → one short line about written quote, delivery, setup, and follow-up.
2. **Reduce visual weight**
   - Remove the cream background or replace it with a very subtle border/hairline.
   - Use a single horizontal row on desktop, stacked on mobile.
   - Keep the three-column structure but make each cell an icon + short statement.
3. **Preserve information**
   - No new content is invented; only the existing three messages are shortened and clarified.
   - No changes to the hero, catalogue grid, kits, filters, or quote flow.

## Files to edit
- `src/components/medhealth-catalogue/PartnerContextBand.tsx` (or equivalent component rendering the cream band)
- `src/pages/MedHealthCapability.tsx` if spacing/padding around the band needs adjustment

## Verification
- Screenshot `/partners/medhealth-capability-2026` at desktop and mobile widths.
- Confirm the band is visually lighter and the catalogue is visible above the fold on a typical laptop viewport.
- Confirm no em dashes are introduced in the rewritten copy.
