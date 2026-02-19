
## Fix Favicon for Safari

### The Root Cause
Safari does not support SVG favicons. The current `index.html` only declares:
```html
<link rel="icon" href="/favicon.svg?v=4" type="image/svg+xml">
```
Safari ignores this entirely and falls back to a default, which is why the Lovable favicon appears.

### The Fix
Add a PNG favicon alongside the existing SVG. Modern browsers will use the SVG (better quality), while Safari will correctly fall back to the PNG.

### Files to Change

**1. `index.html`**
Replace the single favicon link with a multi-format set:
```html
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="icon" href="/favicon.svg?v=5" type="image/svg+xml">
<link rel="apple-touch-icon" href="/favicon.png">
```
- The PNG link goes first so Safari picks it up
- The SVG link follows for modern browsers (Chrome, Firefox, Edge)
- The `apple-touch-icon` ensures iOS Safari home screen saves also use the correct icon
- Version bumped to `v=5` to bust any lingering cache

### What you need to provide
A square PNG file of the Supply Ministry rotating-arrows icon:
- Minimum: 180×180px
- Recommended: 512×512px
- Format: PNG (transparent background preferred, or brand purple #5E45FF background)

This PNG gets saved as `public/favicon.png` and referenced in `index.html`.

### After the fix
- Safari desktop: Shows Supply Ministry icon
- Safari iOS (home screen shortcut): Shows Supply Ministry icon
- Chrome / Firefox / Edge: Continues to use the SVG (higher quality at all sizes)
- Version bump on the SVG link clears any cached Lovable favicon from other browsers
