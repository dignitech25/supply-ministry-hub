

# Restore supplier logos in the strip, remove Drive DeVilbiss

The current `SupplierStrip` shows supplier names as text pills. The original `BrandTrustStrip` component still holds the actual PNG logos uploaded earlier (Novis, Aidacare, Forté, icare, Sleep Choice). Reuse those assets in the editorial strip and drop Drive DeVilbiss.

## Changes

### `src/components/editorial/SupplierStrip.tsx`

Replace the text-pill layout with logo images. Keep the violet band, "Our suppliers" label, and divider.

- Suppliers array becomes:
  ```ts
  const suppliers = [
    { name: "Novis", src: "/lovable-uploads/cc605216-27d1-40e0-a4c3-bed5d920fd14.png", url: "https://novis.com.au" },
    { name: "Aidacare", src: "/lovable-uploads/67943b8c-a970-4bf5-8df6-0e555261eb62.png", url: "https://aidacare.com.au" },
    { name: "Forté Healthcare", src: "/lovable-uploads/496b4f80-f607-49dd-9fac-beeabae55741.png", url: "https://www.fortehealthcare.com.au" },
    { name: "icare Medical", src: "/lovable-uploads/46b949d7-43d7-423f-9add-ed3ac3bb0669.png", url: "https://icaremedicalgroup.com.au" },
    { name: "Sleep Choice", src: "/lovable-uploads/3203fff7-35d5-4c26-814d-17666d297a02.png", url: "https://sleepchoice.com.au" },
  ];
  ```
- Aspire and Drive DeVilbiss removed (no logo asset on hand for Aspire; Drive DeVilbiss removed per request).
- Each item renders as an `<a>` wrapping an `<img>`:
  - Height `h-6 md:h-7` so the strip stays compact (~13px vertical padding preserved).
  - Classes: `object-contain opacity-70 hover:opacity-100 transition-opacity`.
  - On the violet background, add `brightness-0 invert` so the logos render as cream/white silhouettes and read consistently across brands. (If any logo looks wrong inverted, we'll switch that one to a white-version asset later.)
  - `loading="lazy"`, `alt={name}`, `target="_blank" rel="noopener noreferrer"`.
- Spacing between logos: `gap-6 md:gap-8` instead of the current pill gap.
- "Our suppliers" eyebrow label and the thin divider stay exactly as they are.

## Files touched

- `src/components/editorial/SupplierStrip.tsx` — swap text pills for logo images, drop Drive DeVilbiss and Aspire.

## Out of scope

- `BrandTrustStrip.tsx` (unused on the editorial homepage now, but left in place — can be deleted in a follow-up if confirmed orphaned).
- Adding an Aspire logo — not on hand. If you have a PNG/SVG, upload it and I'll add it.

## Verification

- The supplier strip on the homepage shows five real logos (Novis, Aidacare, Forté, icare, Sleep Choice) in cream/white on violet.
- Drive DeVilbiss is gone.
- Each logo links to the supplier's site in a new tab.
- "Our suppliers" eyebrow and divider unchanged.

