
## Fix: www vs non-www Canonical Conflict Causing Google De-indexing

### The Problem

Google Search Console shows:
- User-declared canonical: `https://www.supplyministry.com.au/`
- Google-selected canonical: `https://supplyministry.com.au/`

When Google sees the same content accessible at two different URLs (with and without `www`) and there is no permanent redirect between them, it treats them as duplicate pages. If its chosen canonical differs from yours, it ignores your declaration and the page is effectively not indexed under either URL.

The code already does everything right — `SEO.tsx` outputs `www` canonical tags, the sitemap uses `www` URLs, and `robots.txt` references the `www` sitemap. The **only missing piece** is a server-level redirect to enforce the `www` preference.

### The Fix

Add a `_redirects` file to the `public/` folder. Lovable's hosting (and most static hosts including Netlify/Cloudflare Pages) honour this file to perform permanent HTTP 301 redirects at the edge — before content is served.

**`public/_redirects`** (new file):
```
# Redirect all non-www traffic to www permanently
https://supplyministry.com.au/* https://www.supplyministry.com.au/:splat 301!
```

The `301` status tells Google this is permanent. The `!` forces the redirect even if a matching file exists. The `:splat` preserves the full URL path (e.g. `/products`, `/resources`) so every page redirects correctly, not just the homepage.

### Also: Add a static canonical to `index.html`

React Helmet writes canonical tags into the DOM via JavaScript, which means Google may parse the page before React runs and see no canonical at all. Adding a static fallback canonical directly to `index.html` ensures the correct www canonical is present even before JavaScript executes:

**`index.html`** — add inside `<head>`:
```html
<link rel="canonical" href="https://www.supplyministry.com.au/" />
```

This acts as a belt-and-braces fallback on the homepage specifically (React Helmet will override it for inner pages when JS loads).

### Files to Change

| File | Action | Why |
|---|---|---|
| `public/_redirects` | Create (new) | Forces 301 redirect from non-www to www at server level |
| `index.html` | Add one line | Static canonical fallback before JS loads |

### What Happens After Publishing

1. Anyone (or any bot) visiting `supplyministry.com.au/*` is immediately 301-redirected to `https://www.supplyministry.com.au/*`
2. Google sees only one URL per page, matching the declared canonical
3. The canonical conflict is resolved
4. Request re-indexing in Google Search Console using the "Request Indexing" button on the affected URL

### Technical Notes

- The `_redirects` file is processed by Lovable's static hosting layer. No backend code is needed.
- DNS-level www redirect (at your domain registrar) is an alternative, but the `_redirects` file approach works regardless of DNS configuration and is faster to deploy.
- After publishing, use Google Search Console's URL Inspection tool to verify: the "Google-selected canonical" and "User-declared canonical" should both show `https://www.supplyministry.com.au/`
- Re-indexing typically takes 1–7 days after Google re-crawls the corrected URLs.
