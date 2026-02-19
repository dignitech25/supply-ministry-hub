
## Add LocalBusiness JSON-LD Schema to Homepage

### What This Does

A `LocalBusiness` JSON-LD schema tells Google structured facts about Supply Ministry — name, phone numbers, email, business hours, and service area — in a machine-readable format. This is what powers Google's Knowledge Panel, local search results, and the "Business details" cards that appear when users search for a business by name. Without it, Google has to infer these details from page text, which is unreliable.

### What Will Be Added

A new exported constant `localBusinessSchema` in `src/components/SEO.tsx`, then passed into the homepage `<SEO>` component alongside the existing `organizationSchema` using the `jsonLd` array prop (which already supports multiple schemas).

The schema will include:

| Field | Value |
|---|---|
| `@type` | `MedicalBusiness` (a subtype of `LocalBusiness`, appropriate for assistive technology / healthcare equipment) |
| `name` | Supply Ministry |
| `url` | https://www.supplyministry.com.au |
| `logo` | /Supply_Ministry.svg |
| `telephone` (Alex) | +61452002450 |
| `telephone` (David) | +61404593090 |
| `email` | david@supplyministry.com.au |
| `openingHours` | Mo-Fr 08:30-17:00 |
| `areaServed` | Australia (Country type) |
| `priceRange` | $$ |
| `currenciesAccepted` | AUD |
| `knowsAbout` | Assistive Technology, Mobility Equipment, NDIS Equipment, Aged Care Equipment |

Note: Supply Ministry has no single physical shopfront address visible anywhere in the codebase or contact details — it appears to operate as a service/distribution business across Australia. The schema will therefore omit `address` (which would require a street address) but include all other fields. If a physical address exists, it can be added later.

### Files to Change

| File | Change |
|---|---|
| `src/components/SEO.tsx` | Add `export const localBusinessSchema` constant |
| `src/pages/Index.tsx` | Import `localBusinessSchema` and pass `[organizationSchema, localBusinessSchema]` to the `<SEO jsonLd={...}>` prop |

### Technical Detail

The homepage `<SEO>` component currently renders no `jsonLd` prop. Adding `jsonLd={[organizationSchema, localBusinessSchema]}` will output two separate `<script type="application/ld+json">` blocks in the `<head>` — both are valid and recommended by Google (one per schema type). The `SEO` component already handles arrays via the `jsonLdScripts` mapping on line 36–38, so no changes to the component rendering logic are needed.
