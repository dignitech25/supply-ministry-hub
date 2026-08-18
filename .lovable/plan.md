# Ability Action Australia catalogue page

A second partner catalogue at `/partners/ability-action-catalogue`, built from the same components as the MedHealth page, themed in Ability Action Australia's brand, with the bed and mattress package removed.

## What the user sees

Same page and behaviour as the MedHealth catalogue: hero, clinical kits, product grid with detail pages, search, selection cart, Review and send, and PDF plus Excel export. Only the branding changes, and the IC333 bed package card and configurator do not appear.

- Masthead: Supply Ministry leads, "Prepared for" plus the Ability Action Australia logo sits clearly secondary.
- Palette taken from their live site, not guessed: magenta `#D70761` as the partner accent, navy `#001C42` as partner ink. Supply Ministry violet `#3D2D9E` still drives every button, link and action, so the page reads as our document referencing them.
- Brand rule at the top of the page and above Clinical kits becomes violet into magenta into navy for this account.
- Products, prices and kits are identical to MedHealth (same `microsite_products` rows, `collection = 'medhealth'`).
- Requests still email david@ and alex@supplyministry.com.au, with the partner name in the subject and body so the two accounts are distinguishable.
- Unlisted, `noindex, nofollow`, no links from the site, not in the sitemap. Unlisted is not private: anyone with the link can open it.

## Technical approach

Rather than copying 3,300 lines, the existing catalogue becomes partner-driven config, which is also how a third partner gets added later.

1. `src/partners/types.ts` plus `src/partners/registry.ts`: a `PartnerConfig` shape (name, slug, logo, ink, accent, accentPale, rule, ground, brand rule stops, preparedFor, disclaimer, `showBedPackage`) and two entries, `medhealth` and `ability-action`. `src/partners/medhealth.ts` keeps exporting `PARTNER`, `HOUSE`, `BRAND_RULE` for compatibility but sources from the registry.
2. `src/partners/PartnerThemeProvider.tsx`: context providing the active `PartnerConfig`, plus `usePartner()`. Every component under `src/components/medhealth-catalogue/` and the two pages swap their static `PARTNER` and `BRAND_RULE` imports for `usePartner()`. `HOUSE` stays global since it is Supply Ministry's own identity.
3. Routes in `src/App.tsx`: existing MedHealth routes wrapped in `PartnerThemeProvider partner="medhealth"`; new routes `/partners/ability-action-catalogue` and `/partners/ability-action-catalogue/product/:code` wrapped with `partner="ability-action"`. Both share the existing `MedHealthSelectionProvider`, with the storage key namespaced per partner so carts do not bleed between pages. Page components are renamed to `PartnerCatalogue` and `PartnerProduct` and product links are built from the active partner's base path.
4. Bed package: gated on `showBedPackage`. When false, `KitsRow` omits the IC333 card, `AllKitsSheet` omits it, and `BedPackageSheet` is never mounted. MedHealth is unchanged.
5. Logo: the uploaded Ability Action Australia mark is saved to `public/ability-action-logo.png` and referenced from the registry entry. `Brand.tsx`'s partner logo component becomes generic.
6. Exports: `src/lib/medhealth-export.ts` takes the partner config as an argument so PDF and Excel mastheads, title, colours and footer disclaimer follow the active partner. Supply Ministry logo and violet stay fixed.
7. Email: `medhealth-request-notify` accepts a partner name and label, defaulting to MedHealth so existing calls keep working; `ReviewSheet` passes the active partner.
8. Copy: no em dashes, Australian English, no NDIS approval or funding claims, no invented specs. Footer disclaimer for this account reads "Supply Ministry Pty Ltd, a Dignitech brand. Prepared by Supply Ministry for the Ability Action Australia team."

## Verification

Type check plus production build, then a Playwright pass over both partner URLs at mobile and desktop widths confirming: MedHealth still shows the bed package and its own colours, Ability Action shows neither, product detail links resolve under the correct base path, and both exports download with the right branding.
