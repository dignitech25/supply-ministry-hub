## Goal
Export the rolling supplier banner from this site as a self-contained, portable bundle that drops into any React/Tailwind project, plus a plain HTML/CSS version for non-React sites. Keeps the 6 supplier logos and links exactly as they are now.

## What gets packaged

A zip written to `/mnt/documents/rolling-banner-bundle.zip` containing:

```text
rolling-banner-bundle/
├── README.md                  # install + usage instructions for both flavours
├── react/
│   ├── SupplierStrip.tsx      # the component (Tailwind, no project-specific tokens)
│   ├── tailwind-snippet.txt   # keyframe + animation lines to paste into tailwind.config
│   └── assets/
│       ├── aspire.png
│       ├── enable-lifecare.png
│       ├── forte.png
│       ├── icare.png
│       ├── novis.png
│       └── sleep-choice.png
└── html/
    ├── index.html             # standalone demo page
    ├── supplier-strip.css     # pure CSS marquee + edge fades, no Tailwind needed
    └── assets/                # same 6 PNGs
```

## Portability changes vs. current code

The live `SupplierStrip.tsx` uses project-only tokens (`bg-violet`, `text-cream`, `from-violet`). In the exported version those become drop-in values so it works without your design system:

- `bg-violet` → inline style `background: #5E45FF` (your brand purple, matches current look) with a prop to override.
- `text-cream` / `cream/0.55` → CSS variables with sensible defaults (`#FBF8F1`).
- Edge-fade gradients use the same background colour via CSS var, so changing the bg automatically updates the fades.
- Marquee keyframes provided both as a Tailwind snippet AND inlined in `supplier-strip.css` so neither flavour requires editing global config if you don't want to.
- Pause-on-hover, lazy loading, accessibility labels, and the duplicated track for seamless looping all preserved.

## Tailwind snippet (what users paste)

```text
keyframes: {
  marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } }
},
animation: { marquee: 'marquee 20s linear infinite' }
```

## Delivery

After the zip is generated I'll surface it with a `<lov-artifact>` tag so you can download it directly from chat. No changes are made to this project's source.

## Out of scope

- Copying into a specific other Lovable project (you chose generic export).
- Rebranding the colour palette beyond exposing the CSS var override.
- Adding a build step / npm package; this is a copy-paste bundle.
