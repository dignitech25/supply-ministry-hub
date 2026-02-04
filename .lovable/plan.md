
# Create Proper Branded OG Image

## Overview
Replace the incorrect OG image with one that uses your actual Supply Ministry logo on a clean background.

## Design Specifications
- **Dimensions**: 1200x630 pixels (optimal for social sharing)
- **Background**: Clean white (`#FFFFFF`) or very light purple tint (`#F8F7FF`)
- **Content**: Your actual logo from `Supply_Ministry_horizontal_no_phrase_updatedA-4.svg` centered
- **Logo sizing**: Scaled to be prominent but with breathing room (approximately 60-70% of width)
- **No additional text or taglines** - just your logo

## Technical Approach

### Option A: Use AI Image Generation
Generate a new OG image with the exact specifications:
- White/light background at 1200x630
- Your logo centered and prominent
- Brand purple (#5E45FF) preserved

### Option B: Create via HTML/Canvas (More Precise)
Create a simple HTML page that renders the logo on the correct background, then screenshot at the right dimensions. This ensures pixel-perfect logo rendering.

## Files to Update

| File | Change |
|------|--------|
| `public/og-image.jpg` | Replace with properly branded image |

## Result
When shared on social media (Facebook, LinkedIn, Twitter/X), links to supplyministry.com.au will display:
- Your actual purple logo with rotating arrows icon
- "Supply Ministry" text exactly as designed
- Clean professional appearance matching your brand

## Next Steps After Implementation
1. Test by sharing the published URL on social media or using Facebook Debugger
2. Clear any cached social previews if needed

