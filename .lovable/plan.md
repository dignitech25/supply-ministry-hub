## Goal

Use your latest logo file (`/Supply_Ministry_logo_new.png`) in the header at a properly visible size, while keeping the cream bar clean (no hanging rectangle).

## Why the previous attempts failed

The latest logo PNG is 1376 x 768 with the actual artwork sitting in a small region inside a large cream-colored canvas baked into the image. So:
- Sizing by height made the visible logo tiny.
- Sizing it big made the canvas overflow and create the hanging cream tab.

The fix is to use the latest file but constrain it inside the bar with clipping, and size it generously so the visible artwork actually fills the header.

## Changes (single file: `src/components/editorial/EditorialNavigation.tsx`)

1. Switch the logo source back to your latest asset
   - From: `/Supply_Ministry_logo.png`
   - To: `/Supply_Ministry_logo_new.png`

2. Size the logo so the visible artwork is prominent, while clipping the canvas
   - Apply `h-20` to the `<img>` so it matches the bar height exactly (80px).
   - Apply a generous responsive width so the inner artwork is large:
     - `w-[260px] sm:w-[320px] md:w-[400px]`
   - Keep `object-contain` so nothing gets distorted.

3. Prevent the cream canvas from creating the overhang
   - Add `overflow-hidden` to the `<nav>` element.
   - Keep `<nav>` at `h-20` (no `overflow-visible`).
   - Inner wrapper stays `h-full`.
   - This ensures the image canvas cannot push the bar background down past 80px.

4. Keep the recently approved typography improvements
   - Nav links: `text-base font-medium`
   - CTA "Start your quote": `text-base font-semibold` with `px-7 py-3`

## Expected result

- Your latest logo is back in the header.
- The visible logo artwork is clearly large and readable.
- The cream header bar stays a clean 80px strip with no hanging rectangle, on all screen sizes.
- Menu and CTA stay at the larger, more readable size you already approved.

## Recommended follow-up (optional, not part of this change)

For the cleanest long-term result, re-export the new logo as a tightly cropped transparent PNG (no cream background, minimal padding). Once you upload that, we can drop the width-compensation hack and just size by height.
