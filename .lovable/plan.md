# Port the MedHealth selection portal into this site

Replace the current `/partners/medhealth-capability-2026` page with the interactive catalogue from the uploaded package: live search, category tabs with counts, clinical kits, quantity steppers, a sticky selection bar, a review and send modal, and CSV export.

## What gets copied

The archive contains a `migration/supply-ministry-hub/` folder built specifically for this project. Only those six files are used. Everything else in the zip is the other project's own scaffolding and is ignored.

```text
src/lib/medhealth-catalogue.ts
src/components/medhealth-catalogue/Brand.tsx
src/components/medhealth-catalogue/ProductCard.tsx
src/components/medhealth-catalogue/KitsRow.tsx
src/components/medhealth-catalogue/ReviewSheet.tsx
src/pages/MedHealthCapability.tsx   (overwrites the existing page)
```

No route change is needed. `src/App.tsx` already maps that path to `MedHealthCapability`, lazily loaded. The page keeps `noindex, nofollow` and stays out of navigation and the sitemap.

## Two corrections the package needs

These are required, not optional. The code as shipped would fail at runtime on this project.

1. **The enquiry form is missing required fields.** The review modal collects only name, client reference and delivery suburb, then inserts into `quote_requests` with no email or phone and with nulls for last name and timeline. On this project those four columns are NOT NULL, and the anonymous insert policy also requires a valid email, a phone of 5 to 30 characters, and a non-empty timeline. Every submission would be rejected. Fix: add email and phone inputs to the modal (both required, matching the existing styling), send the surname as entered or fall back to the first name when only one word is given, and send a fixed timeline value of "Not specified". No database change, no policy change.

2. **An em dash in the generated quote text.** `formatRequirements` builds each line with an em dash. Replaced with a plain hyphen to hold the site-wide ban.

## Data

Reads `microsite_products` where `collection = 'medhealth'`, filtered to `status = 'priced'`. Confirmed in the database: 16 priced rows, so the grid, tab counts and kits all populate. Submissions write to the existing `quote_requests` table with `organization` set to MedHealth and the line items stored in `metadata`.

## Verification

Load the page, confirm 16 products render across the category tabs, run a search, select items, open the review modal, submit a live test enquiry, confirm the row lands in `quote_requests`, then delete the test row. Check the CSV export downloads and the page is still `noindex`.