

# Drop the white chips behind supplier logos

The white rounded backgrounds around each logo are too loud against the violet band. Remove the chip and let the logos sit directly on the violet, with subtle treatment so they stay legible without competing with the rest of the page.

## Change

In `src/components/editorial/SupplierStrip.tsx`, on the `<a>` wrapping each logo:

- Remove `bg-white rounded-md px-4 py-2`.
- Keep `mx-3 md:mx-4 shrink-0 flex items-center justify-center hover:opacity-100 transition-opacity`.
- Add `opacity-80` (so logos sit back slightly and don't overpower the violet); hover lifts to full opacity.

On the `<img>`:

- Keep `h-7 md:h-8 w-auto object-contain loading="lazy"`.
- Bump height slightly to `h-8 md:h-10` to compensate for the lost chip padding so the strip doesn't feel thinner.

Everything else stays: marquee animation, hover-to-pause, edge fade gradients, "Our suppliers" eyebrow + divider, supplier order, links.

## Note on background bleed

The Novis (blue), icare (purple), and Sleep Choice (lavender) logos were originally exported on coloured/white backgrounds. Without the white chip, any baked-in white background in those PNG/JPG files will show as a white rectangle on the violet. If that happens after the change we'll need transparent-background versions of those three logos — I'll flag it after the edit and you can drop in cleaner exports if needed.

## Files touched

- `src/components/editorial/SupplierStrip.tsx` — remove chip styling, adjust opacity and logo height.

## Verification

- Logos scroll directly on the violet band with no white pill behind them.
- Strip reads as a quiet trust signal, not a row of stickers.
- Hover still pauses the marquee; links still open in a new tab.
- Edge fades and eyebrow unchanged.

