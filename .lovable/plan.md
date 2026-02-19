
## Fix: Replace favicon.png with the uploaded Supply Ministry logo

### What I'll do

Copy the uploaded `Supply_Ministry.png` file directly to `public/favicon.png`, overwriting the current placeholder.

### Files to Change

**`public/favicon.png`** — Replace with `user-uploads://Supply_Ministry.png`

That's it. `index.html` is already correctly configured with:
```html
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="icon" href="/favicon.svg?v=5" type="image/svg+xml">
<link rel="apple-touch-icon" href="/favicon.png">
```

After publishing, Safari will pick up the new PNG immediately.
