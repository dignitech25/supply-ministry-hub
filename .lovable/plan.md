## Plan

I agree the current result is still wrong. The problem is that `/Supply_Ministry_logo_new.png` is not a header-ready logo file. It is a 1376 x 768 image with a large cream canvas baked into it, so CSS sizing either makes the real logo tiny or creates the cream overhang.

The fix should not be another width/height guess. I will make the latest logo usable as an actual header asset.

## What I will change

1. Create a clean cropped version of the latest logo asset
   - Use `/public/Supply_Ministry_logo_new.png` as the source, not the old logo.
   - Crop out the excess canvas around the real artwork.
   - Remove or minimize the baked cream background so it sits cleanly on the existing cream header.
   - Save it as a new asset, for example `/public/Supply_Ministry_logo_new_cropped.png`.

2. Update the header to use the cropped latest logo
   - In `src/components/editorial/EditorialNavigation.tsx`, point the image to the new cropped latest-logo file.
   - Size it directly and predictably, for example `w-[220px] sm:w-[280px] md:w-[340px] h-auto`, instead of forcing a huge canvas into an 80px bar.

3. Keep the header clean
   - Keep the nav at `h-20`.
   - Keep overflow contained so nothing can hang below the header.
   - Keep the larger nav text and CTA styling that already looked better.

4. Verify visually before calling it done
   - Check the homepage header at the current desktop viewport.
   - Confirm the latest logo is used, the visible logo is large enough, and there is no cream tab or overhang.

## Expected result

- The logo uses your latest design, not the old one.
- The logo appears properly large in the header.
- No hanging cream rectangle.
- No stretching, tiny artwork, or canvas-based sizing hack.