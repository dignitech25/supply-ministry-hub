## Section 1 — HERO: implementation plan

All copy below is inserted verbatim from the rewrite document. No interpretation, no styling changes beyond what is explicitly stated. Italic-gold last-word pattern is **not** propagated.

### File 1: `src/components/editorial/EditorialHero.tsx`

**1a. Italic eyebrow above the headline — DELETE (not replaced).**

Remove both instances of:
> *They understood the clinical context, not just the catalogue.*

- Desktop block: the `<p className="font-serif-italic italic mb-10 pl-4 max-w-[280px]">` element (and its surrounding wrapper styling, including the left border) — deleted entirely.
- Mobile block: the matching `<p className="font-serif-italic italic mb-6 pl-4">` element — deleted entirely.

No replacement element is inserted.

**1b. Headline — replace.**

Current desktop H1 reads `Equipment / that changes / lives` (with "changes" italic-gold).
Current mobile H1 reads `Equipment that changes lives` (same styling).

Replace both with the supplied line, verbatim, **with no italic-gold treatment** (the rewrite document specifies plain copy):

> Helping people feel safer and more comfortable at home.

Both desktop and mobile H1 will render this single sentence as plain cream text. Existing font, weight, size, and line-height styles on the H1 are preserved.

**1c. Sub-headline — replace.**

Current sub paragraph (both desktop and mobile) reads:
> *We connect the people who care for others with the right assistive technology, sourced ethically, documented carefully, delivered with genuine respect.*

Replace with, verbatim:

> We work with occupational therapists, home care managers, support coordinators, and the families they support. We find the right equipment, deliver it carefully, set it up, and stay close until everyone is happy with it.

Existing paragraph styles preserved on both layouts.

**1d. Stats row — replace all three stats.**

Update the `stats` array. Each stat is split into a numeric/symbol portion and a label. The numeric portion goes into the large editorial display; the label goes into the small uppercase caption underneath. The italic-gold suffix treatment on the number is **kept** structurally (since stats already use this pattern site-wide), but only where there is a natural suffix segment.

| Slot | `number` | `suffix` | `label` |
|---|---|---|---|
| 1 | `5-10` | ` homes a week` | `Across Greater Melbourne` |
| 2 | `24` | ` hour response` | `On every quote we receive` |
| 3 | `2,000` | `+ products` | `From the brands we trust` |

Notes:
- Suffixes here are word phrases, not single characters. The existing italic-gold span will render the suffix in italic gold. If that visually breaks (long phrase wrapping awkwardly at the supplied 36px / 28px sizes on the current viewport), I will flag it after build for your review — I will not change the words.
- Labels drop the existing `whitespace-pre-line` `\n` linebreaks; each new label is a single line.

**1e. Persona tabs — replace all four personas.**

Update the `audiences` array. Tab labels, names, descriptions, and CTA labels are all replaced verbatim. Tab `id`s and `ctaHref`s preserved where the destination is unchanged; one new destination is introduced.

| id | tabLabel / tabLabelLines | name | description | ctaLabel | ctaHref |
|---|---|---|---|---|---|
| `ot` | `Occupational therapist` / [`Occupational`, `therapist`] | `An occupational therapist.` | `You write the recommendation. We will source exactly what you have asked for and put it on one quote. If something is not in our range, ask us. Most of the time we can get it.` | `Find products for your clients.` | `/products` |
| `aged-care` | `Home care manager` / [`Home care`, `manager`] | `A home care manager or case manager.` | `You manage the case. We manage the equipment, the procurement, and the conversations with the family, so the only thing you hear back from them is that they are happy.` | `Browse equipment for home care.` | `/products` |
| `coordinator` | `Support coordinator` / [`Support`, `coordinator`] | `A support coordinator.` | `We will go above and beyond to get your participants the equipment they need, quickly and safely.` | `Source equipment for participants.` | `/products` |
| `participant` | `NDIS participant` / [`NDIS`, `participant`] | `An NDIS participant, or a family member helping someone you love.` | `Bringing new equipment into your home is a big deal. We do not rush. We answer your questions and we make sure you are happy with what arrives.` | `Talk to us about what is needed.` | `/quote` |

Note: the `aged-care` persona's tab label changes from "Aged care provider" to "Home care manager"; the underlying `id` is left as `aged-care` to avoid touching unrelated state. If you want the id renamed too, say the word and I will rename it in this same section.

### File 2: `src/components/editorial/EditorialNavigation.tsx`

**2a. Primary CTA — desktop slot.**

Line 73, inside the `/quote` Link:
- Current: `<span className="hidden md:inline">Start your quote</span>`
- New: `<span className="hidden md:inline">Talk to us</span>`

**2b. Mobile compact slot — UNCHANGED.**

Line 72 (`<span className="md:hidden">Get quote</span>`) remains exactly as-is per the rewrite document ("Unchanged from current site.").

### Out of scope for Section 1

- SEO meta, OG, Twitter, alt text, aria labels: not supplied in this section, not touched.
- Italic-gold treatment on the new headline: not propagated (no instruction given).
- Existing video, hero image, layout, spacing, colors: untouched.
- Audience tab `id` `aged-care` left unchanged to avoid downstream side effects unless you instruct otherwise.
- Floating Smart CTA, footer, supplier strip, trust bar, FAQ, About, featured products: not part of Section 1.

### Confirmation output

After build, I will reply with one line only:

`Section 1 inserted, X lines updated, Y lines deleted.`

Awaiting approval to implement.