## Goal
Make the homepage Supplier Strip look uniform, calm, and editorial — matching the violet/cream brand instead of a jumble of colored logos with white boxes.

## Problems identified
- **`icare.jpg` and `novis.jpg`** are JPEGs with baked-in **white backgrounds** → show as white rectangles on the violet strip.
- **Aspect ratios vary 1.9:1 → 4.7:1** → at fixed `h-10`, Aspire and Sleep Choice dominate while Enable Lifecare looks tiny.
- **Full-color logos on violet** read as cluttered (blue Novis, red icare, green Forté).
- **Inconsistent internal padding** in source PNGs throws vertical alignment off.

## Fix — two parts

### 1. Normalize the asset files (one-time image processing)
Run a Python/PIL script to generate cleaned versions in `public/suppliers/normalized/`:
- **Remove white backgrounds** from `icare.jpg` and `novis.jpg` → save as transparent PNG (threshold near-white pixels to alpha).
- **Trim transparent padding** on every logo so the artwork bounding box is tight.
- **Fit each logo into a uniform 240×80 transparent canvas**, scaled to fit (preserving aspect ratio), centered. This guarantees identical visual footprint regardless of source aspect ratio.
- **Convert to monochrome cream tone** (`hsl(40 33% 94%)` at ~85% opacity): replace all non-transparent pixels with the cream color, preserving alpha. This gives the editorial "all logos look like they belong" treatment used by premium B2B sites.

Output: 6 PNGs at `public/suppliers/normalized/{name}.png`, each 240×80, transparent, monochrome cream.

### 2. Update `src/components/editorial/SupplierStrip.tsx`
- Point `src` paths to the new `/suppliers/normalized/*.png` files.
- Replace the per-logo `h-8 md:h-10 w-auto` with a **fixed-box** treatment: `h-8 md:h-10 w-[120px] md:w-[140px] object-contain` so every slot is the same width and logos sit on an identical grid.
- Tighten spacing: `mx-5 md:mx-7`.
- Bump default opacity to `opacity-70` and hover to `opacity-100`.
- Keep marquee, edge fades, and pause-on-hover unchanged.

## Result
A clean, uniform row of cream-tinted supplier marks on violet — same height, same width slot, same color, same opacity. No white boxes, no visual hierarchy fights.

## Files touched
- **Created**: 6 normalized PNGs under `public/suppliers/normalized/`
- **Edited**: `src/components/editorial/SupplierStrip.tsx`

## Optional alternative
If you'd rather keep the original brand colors (full-color logos), I can skip the monochrome step and only (a) strip the white backgrounds from icare/novis and (b) normalize to a uniform box size. Tell me after seeing the result.