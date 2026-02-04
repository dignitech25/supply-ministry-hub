

# Fix Favicon Consistency During Domain Redirect

## The Problem
The favicon is currently defined as an inline data URI in `index.html` rather than referencing an external file. This can cause inconsistent behavior during redirects between `www.supplyministry.com.au` and `supplyministry.com.au`.

## The Solution
Change the favicon reference to use the existing `public/favicon.svg` file instead of the inline data URI. External file references are more reliable across redirects and caching.

## What Will Be Done

### Update `index.html`
Change line 24 from:
```html
<link rel="icon" href="data:image/svg+xml,%3Csvg..." type="image/svg+xml">
```
To:
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

## Technical Details

| File | Change |
|------|--------|
| `index.html` | Replace inline data URI with file reference |

## Why This Fixes It
- External file references are cached consistently by browsers
- The same favicon file will be served regardless of which domain initially loads
- Cleaner, more maintainable approach

