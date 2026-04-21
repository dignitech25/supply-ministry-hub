

# New logo + cream-based navigation

Adopt the new cream-background "Supply Ministry — Connects Care With Solutions" logo as the primary brand asset, and flip the top navigation from violet to cream so the logo can sit on its native background without an awkward coloured panel behind it.

## 1. Add the new logo

Copy `user-uploads://LOGO_A.jpg` into the project as the canonical brand mark:

- `public/brand/supply-ministry-logo.jpg` — used by the nav (and anywhere else the wordmark is needed).

Keep the existing `public/Supply_Ministry_logo.png` in place for now (legacy `Navigation.tsx` still references it) — we can retire it in a follow-up once we confirm nothing depends on it.

Note on the asset: the file you uploaded is a JPG with the cream baked in as the background. That's fine for a cream nav (it'll blend seamlessly). If we ever need it on violet or another colour, we'll need a transparent PNG export of just the icon + wordmark in violet.

## 2. Recolour `EditorialNavigation` to cream

Currently: violet bar, cream wordmark, cream pill button.
New: cream bar, violet logo + violet text, violet pill button. This matches the logo's native palette and gives the site a lighter, more editorial top edge.

Changes in `src/components/editorial/EditorialNavigation.tsx`:

- **Bar**: `bg-violet border-b border-white/10` → `bg-cream border-b border-violet/10`. Keeps the same 62px height and sticky behaviour.
- **Brand mark**: replace the text wordmark (`<Link>Supply Ministry</Link>`) with an `<img>`:
  ```tsx
  <Link to="/" className="flex items-center">
    <img
      src="/brand/supply-ministry-logo.jpg"
      alt="Supply Ministry — Connects Care With Solutions"
      className="h-9 md:h-10 w-auto object-contain"
    />
  </Link>
  ```
  Height `h-9 md:h-10` keeps the logo within the 62px bar with comfortable breathing room. Because the logo's background is cream and the nav is cream, no cropping or chip is needed — they merge.
- **Nav links**: `text-cream/70 hover:text-cream` → `text-violet/70 hover:text-violet`. Same font, weight, size.
- **CTA pill**: `bg-cream text-violet` → `bg-violet text-cream`. Same shape, same hover. This makes the "Start your quote" button the loudest element on the cream bar, which is what we want.
- **Mobile**: layout stays as-is; only colours change. (No mobile menu drawer exists in this component today — out of scope to add one.)

## 3. Side menu / sheet usage

You mentioned "the menu at the side". The editorial layout doesn't currently have a side menu — the only sheet-style sidebar is `ProductFilterSidebar` on `/products`, which is content filters, not site nav. I'd recommend leaving that one untouched (it's already cream-on-cream inside a `Sheet`, which renders on a light surface). If by "side menu" you meant a future mobile drawer for the nav links, flag it and I'll add one in a follow-up using the same cream + violet palette.

## 4. Hero seam

The editorial hero (`EditorialHero`) sits directly under the nav and is violet. With a cream nav above it, the transition becomes cream → violet, which actually frames the hero nicely (like a magazine cover). No change needed to the hero itself.

## 5. Out of scope (intentionally)

- `Navigation.tsx` (legacy header with the purple promo ribbon) — not used on any current route, leaving it alone.
- Footer — stays violet. The cream nav on top + violet footer at the bottom gives a balanced "frame" around the violet body content, which is what you asked for in the previous violet-extension change.
- Replacing the logo on `index.html`/favicon/OG image — separate asset pipeline; can do as a follow-up if you want the new mark used in social cards too.

## Files touched

- `public/brand/supply-ministry-logo.jpg` — new asset (copy of the upload).
- `src/components/editorial/EditorialNavigation.tsx` — swap text wordmark for image, recolour bar/links/CTA from violet→cream / cream→violet.

## Verification

- Top of every page (Home, Products, Resources, Sleep Choice, Support at Home, Quote Confirm, 404, Terms) shows a cream nav bar with the new circular-arrow + box logo and "SUPPLY MINISTRY / CONNECTS CARE WITH SOLUTIONS" wordmark.
- Logo blends cleanly into the cream bar with no visible JPG seam.
- Nav links read in violet; "Start your quote" is a violet pill with cream text.
- The cream nav meets the violet hero with a clean horizontal seam — no awkward stripes.
- Footer remains violet; overall page still reads violet-dominant with cream accents at top and inside content panels.

