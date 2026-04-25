Slim the editorial nav bar and make the logo prominent.

Edit `src/components/editorial/EditorialNavigation.tsx`:
1. Change `<nav>` height from `h-[88px]` to `h-[64px]` and add `overflow-visible` so the logo can extend past the bar.
2. Change logo classes from `h-14 md:h-16 w-auto object-contain` to `h-[80px] md:h-[110px] w-auto object-contain` (keeps proportions, ~1.7x larger).
3. Reduce CTA padding from `py-[9px]` to `py-2` so it fits cleanly in the thinner bar.
4. Keep `sticky top-0 z-50` so the overflowing logo still sits above page content.

Net effect: the bar reads as a thinner strip (~64px) while the logo punches above and below it as the dominant brand element.