
## Fix the Favicon SVG

The root problem is the `viewBox` in `public/favicon.svg` is wrong. It reads `104 314 512 512` which means:
- Start at x=104, y=314
- Show a 512x512 window from there (so up to x=616, y=826)

But the actual paths in the SVG span from roughly x=148 to x=586 and y=343 to y=826 — meaning the current viewBox clips the right side of the icon.

The correct viewBox needs to fully contain all 5 paths. Looking at the path data:
- Leftmost point: ~x=148 (bottom-left arrow)
- Rightmost point: ~x=586 (right arrow)  
- Topmost point: ~y=343 (top arrow)
- Bottommost point: ~y=826 (bottom-right arrow)

The correct viewBox should be `"140 330 460 510"` (with some padding), which properly frames the full circular arrow logo.

Additionally, I'll bump the cache-buster version to `?v=4` in `index.html` to force browsers to reload the updated favicon.

### Files to change

1. **`public/favicon.svg`** — Fix `viewBox` to correctly frame all path content: `viewBox="140 330 460 510"`
2. **`index.html`** — Bump version to `?v=4` to force cache refresh

### Why this will work on supplyministry.com.au

- The SVG was technically present and linked correctly, but the broken viewBox likely caused browsers to render it as blank/empty
- When a favicon renders as blank, browsers fall back to a cached version (which in this case was the Lovable heart from before)
- Fixing the viewBox + cache-busting version will force a proper re-render of the Supply Ministry logo

No other files need changing. This is a pure SVG viewport fix.
