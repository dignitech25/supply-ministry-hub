# MedHealth capability microsite

A single, self-contained page on the Supply Ministry site: a capability document prepared for the MedHealth injury-rehabilitation and OT team. Supply Ministry owns the page; MedHealth is referenced only as the recipient (palette mood plus a "Prepared for" badge, no logo, no partnership claim).

## Route and visibility

- New page at an unlisted slug: `/partners/medhealth-capability-2026`. Unlisted is not private: anyone with the link can open it, so the on-page "prepared for" framing and the footer disclaimer are what actually limit exposure.
- `noindex, nofollow` set on the page, and the page is kept out of the sitemap and site navigation. No links to it from the header, footer or any existing page.

## Data

All products come from `public.microsite_products` filtered to `collection = 'medhealth'`, ordered by `sort_order`. Nothing is hardcoded. Confirmed currently in the table: 16 priced items across Bathing & showering (9), Dressing & reaching (5), Transfers & positioning (2), plus 22 source-on-request items.

- `status = 'priced'` renders as product cards grouped by `clinical_group`, each showing name, category tag, AUD price (no cents when whole, e.g. $96 and $21.99), the first sentence of `key_specifications`, and the product code small at the base.
- `status = 'source_on_request'` renders as name chips in the "Source anything" section, no prices.
- The stat panel count is derived from the priced rows, not typed in.
- Empty result renders a calm empty state, never an error.

## Enquiry form

Writes to the existing `public.quote_requests` table via the Supabase client, mapping first_name, last_name, email, phone, organization, category, requirements, timeline, and `source_url` set to the live page URL. No new table. The table already has an anonymous-insert policy, so no database change is expected; if a live insert is blocked, the only change made is an insert permission for anonymous visitors on that one table. Client-side validation with zod, success confirmation state, and a retry message on failure.

## Page structure

1. Masthead: Supply Ministry wordmark top-left (largest element), small "Prepared for MedHealth" badge top-right, sticky sub-nav with anchor links (The range / Source anything / Bed & mattress trials / Funding / How to order) and a violet "Request a quote" button.
2. Hero: tag line, headline on the baseline list being priced, sourced and on one invoice, subhead on the provider-first model, two CTAs, then a thin promise strip (source what is not listed, beat any comparable quote, one quote one invoice, Melbourne metro delivery, GST-free on eligible items, 7-night trials).
3. The range: stat panel, lede on indicative RRP incl GST and confirmation on the quote, then grouped priced cards.
4. Source anything: explainer plus chips.
5. Sleep Choice bed and mattress trials: the five-step sequence, pre-trial call through to buy, rent-to-buy or free collection, invoice only if kept.
6. Funding flexibility: the single full-width teal tinted section, four cards.
7. How to order: two cards (what to send us / what comes back), the enquiry form, then the contact line.
8. Footer: the disclaimer verbatim as supplied.

## Design

One theme block at the top of the file holds every token, so a second partner is a config change rather than a rebuild: `--sm`, `--sm-hover`, `--sm-cream`, `--sm-cream-2` for Supply Ministry, and `--p-ink`, `--p-ink-soft`, `--p-accent`, `--p-accent-pale` for the partner layer. The partner tokens carry a comment marking them as placeholders to verify against a real MedHealth screenshot before the link is sent.

Violet drives every button, link and accent. Petrol is used as type only. Teal appears as a full-strength ground in the funding section only. Cream ground throughout, Outfit 300 to 800, 14 to 16px card radii, pill buttons, generous whitespace, mobile-first, WCAG-AA contrast. Australian English, short sentences, no invented specs, prices or funding detail beyond the table and the brief.

## Technical notes

- New file `src/pages/MedHealth.tsx` plus a small `src/pages/medhealth/` set of section components if the file grows past a comfortable length; route registered lazily in `src/App.tsx`.
- Outfit is loaded via a Google Fonts link in `index.html` and applied through a page-scoped class so the rest of the site keeps its existing typefaces.
- Tokens are declared as CSS custom properties scoped to the page wrapper rather than added to the global theme, so the partner palette cannot leak into the main site.
- Data fetched with the existing TanStack Query setup and the shared Supabase client; loading skeletons for the card grid.
