

# Replace static supplier strip with a rolling logo banner

Six fresh supplier logos uploaded (Aspire, Enable Lifecare, Forté, icare, Novis, Sleep Choice). Swap the current static `SupplierStrip` for a continuous marquee using these new assets, and stop relying on the old `/lovable-uploads/...` paths.

## 1. Add the logos to the project

Copy the six uploads into `public/suppliers/` so they're served as static assets:

- `user-uploads://Aspire.webp` → `public/suppliers/aspire.webp`
- `user-uploads://Enable.png` → `public/suppliers/enable-lifecare.png`
- `user-uploads://Forte_Logo.png` → `public/suppliers/forte.png`
- `user-uploads://Icare_Logo.jpg` → `public/suppliers/icare.jpg`
- `user-uploads://Novis_Logo.jpg` → `public/suppliers/novis.jpg`
- `user-uploads://Sleep_Choice-01.png` → `public/suppliers/sleep-choice.png`

## 2. Rebuild `src/components/editorial/SupplierStrip.tsx` as a marquee

Replace the current flex-wrap layout with a continuous horizontal scroll using the existing `animate-marquee` keyframe already defined in `tailwind.config.ts` (used previously by `BrandTrustStrip`).

Structure:

```text
<section bg-violet>
  <eyebrow "Our suppliers" + divider>   ← stays as-is
  <marquee viewport: overflow-hidden, fade masks left/right>
    <track: flex animate-marquee group-hover:paused>
      [logo × 6] [logo × 6]   ← duplicated for seamless loop
    </track>
  </marquee>
</section>
```

Key details:

- **Logo rendering**: each logo is a white "chip" — `bg-white rounded-md px-4 py-2` with the image at `h-7 md:h-8 w-auto object-contain`. The chip approach is needed because the logos are full-colour on coloured backgrounds (Novis on blue, icare on purple, Sleep Choice on lavender) — `brightness-0 invert` won't work cleanly across all of them. White chips give every brand a consistent canvas on the violet band.
- **Spacing**: `mx-6 md:mx-8` between chips.
- **Links**: each chip wrapped in `<a target="_blank" rel="noopener noreferrer">` to the supplier site.
  - Aspire → `https://aspirehealthcare.com.au`
  - Enable Lifecare → `https://enablelifecare.com.au`
  - Forté → `https://www.fortehealthcare.com.au`
  - icare → `https://icaremedicalgroup.com.au`
  - Novis → `https://novis.com.au`
  - Sleep Choice → `https://sleepchoice.com.au`
- **Marquee mechanics**: outer `div` is `overflow-hidden group`; inner track is `flex w-max animate-marquee group-hover:[animation-play-state:paused]`. Logos rendered twice back-to-back; the existing `marquee` keyframe translates `-50%`, giving a seamless loop.
- **Edge fades**: absolute-positioned `bg-gradient-to-r from-violet to-transparent` (and mirrored on the right) so logos softly disappear at the edges instead of hard-cutting.
- **Eyebrow + divider**: kept on a single non-scrolling row above the marquee on desktop; on mobile the eyebrow sits above and the marquee runs full width below.
- **Padding**: increase the section padding slightly (`py-6 md:py-8`) so the white chips have breathing room against the violet.

## 3. Files touched

- `public/suppliers/*` — six new logo files (copied from uploads).
- `src/components/editorial/SupplierStrip.tsx` — full rewrite: marquee track, white chips, six suppliers, fade masks, hover-to-pause.

## Out of scope

- `BrandTrustStrip.tsx` — leaves it untouched (still orphaned, can be cleaned up later).
- Marquee speed tuning — use the existing `animate-marquee` (20s linear infinite). If it feels too fast/slow we can tune the keyframe duration after seeing it live.
- Light/dark logo variants — using white chips avoids needing per-brand colour treatments.

## Verification

- Six logos scroll continuously left across the violet band beneath the hero.
- Each logo sits inside a small white rounded chip for legibility.
- Hovering the strip pauses the scroll; clicking a chip opens the supplier's site in a new tab.
- Edges fade softly into the violet rather than hard-cutting.
- "Our suppliers" eyebrow + divider preserved.

