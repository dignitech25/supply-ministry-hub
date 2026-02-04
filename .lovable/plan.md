

# Replace OG Image with Your Branded Version

## Overview
Copy your uploaded branded OG image to replace the current placeholder at `public/og-image.jpg`.

## What Will Change

| File | Action |
|------|--------|
| `public/og-image.jpg` | Replace with your uploaded branded image |

## Technical Notes
- The image will be placed in `public/` folder since it's referenced directly in meta tags
- File format: Will save as PNG (your upload format) but may need to rename to match existing `.jpg` reference in `index.html`
- All existing meta tag references in `index.html` and `SEO.tsx` already point to `/og-image.jpg`

## After Implementation
Once published, when anyone shares a link to supplyministry.com.au on Facebook, LinkedIn, Twitter/X, or messaging apps, they'll see:
- Your rotating arrows icon
- "Supply Ministry" brand name
- "CONNECTS CARE WITH SOLUTIONS" tagline
- "Assistive Technology, Simplified" messaging
- Your website URL

## Verification Steps
1. Publish the changes
2. Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to verify
3. Share a link on any platform to confirm the preview

