

## Support at Home Page

### What this adds
A new informational page at `/support-at-home` for OTs, case managers, and community care coordinators. It explains that Supply Ministry works with whoever is managing a case to identify available funding, optimise how it applies to equipment, and get things moving without waiting on slow SAH approval processes. The page is clean, professional, prose-only -- no bullet lists, banners, forms, or widgets.

### Content structure

1. **Headline** -- Names the SAH approval delay problem directly
2. **Two to three paragraphs** -- Acknowledges SAH has slowed the path from clinical need to equipment arrival; cases sitting in queues while clients wait
3. **What Supply Ministry does** -- Works with whoever manages the case to look at what funding is already available, map how it applies to equipment now, and move things forward
4. **Sleep Choice connection** -- Where the clinical decision is still open, a 7-night in-home trial through Sleep Choice (sleepchoice.com.au) confirms the right setup before any supply commitment, keeping the recommendation clean and the funding conversation straightforward
5. **Contact prompt** -- Simple text inviting people to get in touch, with david@supplyministry.com.au. No form, no button, no widget

### Files to create or modify

**1. New file: `src/pages/SupportAtHome.tsx`**
- Uses `Navigation`, `Footer`, and `SEO` components (same pattern as `SleepChoice.tsx`)
- Subtle heading area with `bg-gradient-card`, matching other informational pages
- Body in a `max-w-3xl` container with short `<p>` blocks
- Sleep Choice mention links to `https://sleepchoice.com.au` (external) and `/sleep-choice` (internal)
- Contact section: quiet `bg-muted/30` block with a `mailto:` link, no CTA button
- No `<ul>` or `<li>` elements anywhere on the page
- SEO title under 60 characters, meta description 145-160 characters
- Compliance note respected: no promises about funding coverage or guarantees

**2. `src/App.tsx`** -- Add route
- Import `SupportAtHome`
- Add `<Route path="/support-at-home" element={<SupportAtHome />} />`

**3. `src/components/Footer.tsx`** -- Add nav link
- Add "Support at Home" to the Quick Links list alongside About Us, Products, and Sleep Choice

**4. `src/components/CategoryNavigation.tsx`** -- Add to main nav
- Desktop: add a "Support at Home" text link in the navigation bar
- Mobile: add it as a secondary link below the Shop Now button

### Design approach
- No hero banner or image -- heading area only with soft gradient background
- All body text in short paragraphs, no lists
- Mobile responsive via existing Tailwind container and max-width utilities
- No new dependencies required

