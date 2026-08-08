# MedHealth Partner Page: Co-Branded Command Centre Redesign

## Goal
Transform `/partners/medhealth-capability-2026` into a dense, scannable command centre that feels native to MedHealth while remaining clearly Supply Ministry's document. Fix the recently-added context band so it integrates into the co-branded field instead of looking tacked on.

## Locked creative direction
- **Scope**: MedHealth partner page only.
- **Palette**: Blended co-branded field. Supply Ministry violet (#3D2D9E) drives every action, button, and primary rule. MedHealth navy (#010A16) is the ink and thin-rule colour. MedHealth amber (#FAB043) is the terminal accent. Warm cream (#F4EFE6 / #FBF8F2) is the ground.
- **Typography**: MedHealth's brand typeface, Raleway, becomes the page typeface. Use it for headings, body, and labels. Supply Ministry's existing site fonts stay untouched everywhere else.
- **Layout energy**: Command centre. Dense, scannable, everything within reach. Dashboard-like efficiency for OTs selecting equipment and building a quote.

## Changes

### 1. Typography system
- Load Raleway via Google Fonts for this page only.
- Apply Raleway to all text within the MedHealth page scope via a CSS custom property block.
- Keep weights intentional: 500 for body, 600 for labels, 700 for headings, 400 for captions.

### 2. Context band integration
- Restore a subtle tinted ground to the band so it belongs to the page, but keep it visually quiet.
- Revert the icon/badge treatment if it feels toy-like; instead use small uppercase labels and single-line statements aligned to a strict three-column grid.
- Use the partner accent (#FAB043) only as a 2px top rule on each column, not as a background fill.

### 3. Command-centre layout
- **Sticky masthead**: Keep Supply Ministry logo leading, MedHealth "Prepared for" lockup secondary, and add a persistent quote-cart summary with count + total on the right.
- **Hero as a compact briefing**: H1, one-line scope, and the three context columns in a single horizontal strip below it.
- **Toolbar**: Search, category chips, "Catalogue home", and "Export" in one tight row that stays accessible.
- **Clinical kits as a priority panel**: Promote kits to a top panel with clear item counts, totals, and "View kit / Add kit" actions.
- **Product grid**: Tighter cards, more items per row, prices and codes highly scannable.
- **Floating review action**: A persistent bottom bar or sticky side panel showing selected items, total, and "Review & send" CTA.

### 4. Co-branding fidelity
- Ensure the page still follows the ownership rule: Supply Ministry leads, MedHealth is referenced.
- Keep the footer disclaimer intact.
- Keep the page noindex.

### 5. Fix the current band
- Remove the white-background, icon-heavy strip that currently looks disconnected.
- Replace it with the integrated band described above before any broader layout changes.

## Files to edit
- `src/components/medhealth-catalogue/PartnerContextBand.tsx`
- `src/pages/MedHealthCapability.tsx`
- `src/components/medhealth-catalogue/Brand.tsx` (if masthead proportions need refinement)
- `src/components/medhealth-catalogue/KitsRow.tsx`
- `src/components/medhealth-catalogue/ProductCard.tsx`
- `src/components/medhealth-catalogue/ReviewSheet.tsx` (or a new sticky quote summary)
- `index.html` or page-level font loading for Raleway

## Verification
- Screenshot desktop and mobile at `/partners/medhealth-capability-2026`.
- Confirm the context band no longer looks out of place and the page reads as one coherent MedHealth-branded command centre.
- Confirm Raleway renders correctly and the Supply Ministry violet remains on every action element.
- Confirm no em dashes are introduced in rewritten copy.
