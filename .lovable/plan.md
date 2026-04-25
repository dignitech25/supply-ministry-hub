Fix the hanging cream rectangle below the nav and bump up logo + text sizes.

Edit `src/components/editorial/EditorialNavigation.tsx`:

1. Remove `overflow-visible` from the `<nav>` element and change its height from `h-[64px]` to `h-20` (80px). This makes the bar fully contain the logo so the cream background no longer drags down past the bar on scroll.

2. Change logo classes from `h-[80px] md:h-[110px] w-auto object-contain` to `h-16 md:h-[72px] w-auto object-contain` so the logo fills the 80px bar with a small breathing margin and stays inside it.

3. Enlarge nav links ("Products", "Suppliers", "About", "Contact"): change `font-geist text-[12px] font-light` to `font-geist text-sm font-medium` for clearer legibility.

4. Enlarge the "Start your quote" CTA: change `text-[12px] font-normal ... px-6 py-2` to `text-sm font-medium ... px-6 py-2.5` so the button is more prominent and proportional to the slimmer bar.

Net effect: clean self-contained nav bar (no cream tab hanging below on scroll), prominent logo filling the bar, and crisper, more readable nav + CTA text.