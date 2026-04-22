

# Fix hero image cropping heads on mobile

On mobile, the hero photo uses `object-cover` inside a fixed `h-[280px]` frame. Because the subjects' heads sit near the top of the photo, the default centered crop is slicing them off.

## Change

In `src/components/editorial/EditorialHero.tsx`, mobile layout block only:

- On the mobile hero `<img>`, add `object-top` alongside the existing `object-cover` so the crop anchors to the top of the photo (keeps heads in frame, trims from the bottom instead).
- Bump the mobile container from `h-[280px]` to `h-[340px]` so there's enough vertical room to show both subjects comfortably without aggressive cropping.

Desktop layout is unaffected — the right-column panel is tall enough that heads aren't being clipped there.

## Files touched

- `src/components/editorial/EditorialHero.tsx` — mobile image: add `object-top`, increase container height to `h-[340px]`.

## Verification

- On a 390–430px wide viewport, both people's heads are fully visible in the hero photo.
- No awkward empty space above the subjects; crop now trims from the floor/legs area instead.
- Desktop hero unchanged.

