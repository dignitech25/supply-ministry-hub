# Clinical kits refinement, MedHealth catalogue

A refinement of the existing Clinical kits block on `/partners/medhealth-capability-2026`. Cream surface, violet top rule, white cards, imagery, subtotals and the existing Request and send flow all stay as they are.

## Section hierarchy

- "Clinical kits" heading strengthened to roughly 30 to 32 px on desktop, everything around it stays restrained.
- Remove the "Fast-start bundles" eyebrow.
- Paragraph becomes: "Ready-made selections for common daily-living needs. Select a kit, then adjust the individual products before sending."
- No extra explanatory panels.

## Featured kits

Four featured cards in one compact desktop row, two columns on tablet, single column on mobile:

1. Lower-Limb Recovery Kit
2. Vehicle Transfer Kit
3. Shower Independence Kit
4. Bed Mobility & Positioning Kit

Each card shows the kit name, one-line description, up to three compact thumbnails, item count, live subtotal, and a single "Select kit" button. The "View kit" and "Add kit" pair is removed. Tapping the card body or thumbnails opens the existing kit-detail sheet; "Select kit" adds the items straight into the current selection without duplicating anything already selected, and every item stays removable and adjustable in Review and send.

## All clinical kits

A restrained "View all clinical kits" link under the featured row opens a sheet listing all seven kits, each with its description, products and a "Select kit" action. The seven kits are exactly as specified, including the bed-stick suitability note on the Bed Mobility & Positioning Kit. Every subtotal is computed from live Supabase prices; no fixed kit prices are stored.

## IC333 premium bed package

After the featured row, one compact premium feature card: bed image, package name, the description "Build a complete electric-bed setup with the appropriate mattress and bedside accessories.", a dynamically calculated starting price, and a single "Configure bed package" button.

The configuration sheet includes the three required base products, exactly one mattress firmness chosen by the user (soft, medium, firm, none preselected), and optional accessories (bed stick, high side rail, low side rail, small bed wedge, leg raiser, none preselected). It carries the note: "Mattress firmness, rails and transfer supports should be selected according to the user's needs and bed-safety assessment." Confirming adds the chosen configuration to the existing selection.

## Data checks already done

All 29 product codes referenced by the seven kits and the bed package resolve to live priced rows in `microsite_products`, including the corrected `SMDL10204-81`, `SMDL10921-16` and `SMBA68024HD`-style codes. The obsolete kit definitions in application code are replaced outright.

## Category navigation

The catalogue holds 53 priced products, which collapse into 44 cards because variant families (for example the three Forte mattress firmnesses and the two reaching-aid lengths) render as one card. The "All (53)" pill therefore does not match the cards on screen. Category tabs and the All count will be generated from the same family-collapsed collection the grid renders, so the counts add up to what is displayed and every priced product remains reachable through a category. The pill row stays a single horizontally scrollable line.

## Technical notes

- `src/lib/medhealth-catalogue.ts`: replace `KIT_RULES` with the seven fixed kits plus descriptions and optional notes, add a featured flag, add the IC333 package definition, keep subtotals derived from fetched prices.
- `src/components/medhealth-catalogue/KitsRow.tsx`: header typography, removed eyebrow, four-up compact cards, single "Select kit" action, "View all clinical kits" trigger.
- New: an all-kits sheet and a bed-package configuration sheet, both reusing the existing sheet pattern from `KitSheet.tsx`.
- `src/components/medhealth-catalogue/KitSheet.tsx`: single primary action, dedupe-aware add.
- `src/pages/MedHealthCapability.tsx`: wire the new actions into the existing selection state and fix the tab counts.
- No database, branding or unrelated page changes.

## Validation

Type check, then a browser pass at desktop, tablet and mobile widths confirming all seven kits resolve their codes, subtotals match live prices, selecting a kit updates Request and send without duplicates, tab counts total the cards shown, and the grid still appears quickly below the compact featured area.
