
# Pass 1 Copy Implementation

Status check against spec:
- **EditorialHero**: Already largely done in prior approval, with three deviations to correct.
- **TrustBar, AboutSection, Index testimonials**: Not yet updated. Full implementation required.

All copy inserted verbatim. No em dashes. No italic-gold pattern on any updated heading. No trailing periods added to lines that don't have them in the spec.

---

## Section 1: EditorialHero fix-ups (`src/components/editorial/EditorialHero.tsx`)

Current state already matches spec for headline, sub, descriptions, eyebrow, CTAs (text), and tab labels. Three corrections:

1. **Remove trailing periods** added in error to identity lines and CTA labels in the `audiences` array. Spec lines have no trailing period:
   - `name`: `An occupational therapist` / `A home care manager or case manager` / `A support coordinator` / `An NDIS participant, or a family member helping someone you love`
   - `ctaLabel`: `Find products for your clients` / `Browse equipment for home care` / `Source equipment for participants` / `Talk to us about what is needed`

2. **Stat 2 format** — spec is Number `24hr`, Label `response`, Sub `On every quote we receive`. Current is `24` + ` hour response`. Update to:
   - `{ number: "24hr", suffix: " response", label: "On every quote we receive" }`

3. **Headline trailing period** — current ends in `.`. Spec line: `Helping people feel safer and more comfortable at home` (no period). Remove from both desktop and mobile h1.

4. **Sub-paragraph** — spec ends sentence 2 without period? Spec text: `...stay close until everyone is happy with it.` — this DOES have a period. Keep as-is.

No other Hero changes. Italic-gold suffix styling on stats is pre-existing and not a heading pattern; leave untouched.

Confirmation line: `Section 1 inserted, 6 lines updated, 0 lines deleted.`

---

## Section 2: TrustBar (`src/components/editorial/TrustBar.tsx`)

Replace the `proofs` array entirely. Keep four-column layout. The component currently uses `headlineLead` + `headlineAccent` (italic gold) + `headlineTrail` to apply italic-gold to one fragment.

Per spec, none of the new headlines use italic-gold. **Update component logic** so headlines render as plain text. Simplest: change `proofs` shape to `{ eyebrow, headline, sub }` and render headline as a single plain `<h3>` span (no italic, no gold). Remove `headlineLead`/`headlineAccent`/`headlineTrail` fields and the italic span markup.

New columns:
- Col 1: eyebrow `For occupational therapists` / headline `We can source you anything` / sub `If it is not in our range, ask. We will find it.`
- Col 2: eyebrow `For the family` / headline `We talk to the people who matter` / sub `We stay in touch with the family directly, so nothing gets lost in translation.`
- Col 3: eyebrow `24 hour response` / headline `We get back to you the same day` / sub `Every quote, every time.`
- Col 4: eyebrow `15+ years` / headline `We have been in this work a long time` / sub `Most of the situations that come up, we have seen before.`

Confirmation: `Section 2 inserted, 4 lines updated, 0 lines deleted.`

---

## Section 3: AboutSection (`src/components/AboutSection.tsx`)

### Mission block
- Eyebrow: `About us` (was `About`)
- Headline: replace `Connecting care with <span italic gold>solutions</span>` with plain text `We exist to support people at their most vulnerable, and the families who care for them` — no italic-gold span.
- Lead paragraph: `We bring assistive technology into the homes of people who need it, with the care and consideration that should already be standard.`
- Insert new paragraph directly after the lead: `Bringing equipment into someone's home is a moment, not a transaction. After fifteen years in this sector, we know what it feels like when it is handled badly. We started Supply Ministry to do it differently.`

### Values grid
Keep four cards, keep icons (Heart, Award, Clock, Users). Replace `values` array entries:
- Card 1: heading `The way we work` / body `We are working in someone's bedroom on what is often a hard day. We never forget that.`
- Card 2: heading `What goes into the home` / body `We send equipment we would put in our own parents' homes. The brands we work with know that is the test.`
- Card 3: heading `Why we move fast` / body `When someone cannot get out of bed safely, the days matter. We answer quickly because the people waiting for us cannot wait.`
- Card 4: heading `After fifteen years` / body `We have seen most of the situations that come up. When something is unfamiliar we say so, and we find out.`

### Founders
Update `founders` array. Remove `experience` and `specialization` fields and the JSX rows that render them (delete the two `<div>` blocks with "Experience:" and "Specialization:" labels and the dividers/spacing they leave behind).
- Alex Hampel: role `Co-Founder`, description `Alex has over 45 years in assistive technology, retail, and customer experience. He knows what good service feels like from the other side of the counter, and that is how he runs every interaction at Supply Ministry. If an OT sends through a recommendation, Alex is usually the person who reads it first.`
- David Hyman: role `Co-Founder`, description `David has over 20 years across technology and health. He is focused on finding better ways to work so that vulnerable people and the families supporting them get what they need without unnecessary delays. If something is not working, David is the one who fixes the process.`

The "Meet the founders" sub-heading currently uses italic-gold on `founders`. Spec doesn't address this heading. Per Pass 1 directive "do not propagate italic-gold to lines not specified" applies only to **lines provided in this pass**. The "Meet the founders" line was not provided as a copy update, so leave its current styling untouched.

### Our Story
Heading text unchanged (still `Our story` with italic-gold on `story` — not in spec scope, leave alone).
- Para 1: `Supply Ministry started because Alex and David had both spent years watching how equipment gets into people's homes, and too often it was not handled well. Late deliveries, wrong specs, families left confused, OTs spending their time resolving problems they did not create.`
- Para 2: `So they built something simple. One supplier that reads the recommendation carefully, sources the right equipment, delivers it into the home, and picks up the phone when something is not right. That is still the whole idea.`

### CTA button
- Text: `Talk to us` (was `Get in Touch`)
- Behaviour: currently scrolls to `#contact` element. Keep behaviour (the contact section on Index has `id="contact"`).

Confirmation: `Section 3 inserted, ~16 lines updated, 4 lines deleted.`

---

## Section 4: Testimonials in Index (`src/pages/Index.tsx`)

Within the testimonials `<section id="testimonials">` block:
- Eyebrow: keep `Testimonials`.
- Headline: replace `What our clients <span italic gold>say</span>` with plain text `What people say about working with us` — no italic-gold span. Keep h2 typography classes.
- Sub `<p>` line "Trusted by leading healthcare providers across Australia": delete the `<p>` element entirely.

Replace the inline testimonials array with:
1. company `Community Practice`, role `Occupational Therapist, north-eastern Melbourne`, quote `It feels like working with someone who has actually been in a client's home.`
2. company `Aged Care Provider`, role `Home Care Manager, Melbourne metropolitan`, quote `I called on Tuesday. The bed was in her room on Friday. The family rang me to say thank you, which never happens.`
3. company `NDIS Plan Management`, role `Support Coordinator, eastern Melbourne suburbs`, quote `I started using them on one client. Now they do everything.`

Keep `rating: 5`, keep card layout, star rendering, and quote-mark styling.

Confirmation: `Section 4 inserted, 10 lines updated, 1 line deleted.`

---

## Out of scope (Pass 2)

FAQSection, Quote.tsx, Footer.tsx, the Sleep Choice / contact / category / featured product blocks in Index, all other pages, product card copy, navigation labels, form labels, meta/SEO. Not touched.

## Technical notes

- No file outside the four listed will be modified.
- No styling, layout, animation, or color changes beyond removing italic-gold spans on the four updated headings (Hero h1 already plain; AboutSection mission h2; TrustBar headlines; Index testimonials h2).
- TrustBar component shape simplified (`headlineLead/Accent/Trail` → `headline`) to fully eliminate the italic-gold rendering path for those headlines.
- Founder card JSX simplified (remove Experience and Specialization rows).
- No em dashes introduced; verified none in supplied copy.
