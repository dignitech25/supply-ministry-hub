I found the issue: the visible text is the accessibility skip link from `index.html`. It is supposed to stay hidden until keyboard focus, but it is being exposed in the preview and several pages do not provide the matching `main-content` anchor. That makes the page feel like it is stuck or loading badly, especially on `/products`.

Plan:

1. Make the skip link reliably hidden by default
   - Replace the current Tailwind-only `sr-only` behavior with a dedicated CSS class in `src/index.css`.
   - Keep it accessible for keyboard users by showing it only on focus.
   - This prevents `Skip to main content` from hanging visibly on normal page loads.

2. Add the missing main content anchor across routed pages
   - Add `id="main-content"` to real `<main>` elements on `/products`, product detail states, `/support-at-home`, `/rent-to-buy`, terms, quote confirm, and other routed pages with a main element.
   - For pages that currently use sections without a main wrapper, either add a main wrapper or give the first primary content container the anchor.
   - This makes the skip link actually work instead of pointing at an anchor that only exists on the homepage.

3. Clean up loading perception on `/products`
   - Keep the product loading skeleton, but ensure the route itself is not perceived as blank or stuck.
   - Review the `/products` fetch cycle for unnecessary repeated URL/state updates that can cause extra loading passes.
   - Do not change product data or filters unless needed.

4. Add a safer lazy-load failure path
   - Update `ErrorBoundary` so stale Vite chunks or failed lazy route imports show a clear refresh message, or reload once automatically.
   - This addresses the earlier page-load failures if the preview cache is holding old module files.

Technical notes:

- No `_redirects` changes. Lovable handles SPA routing automatically.
- No change to the visible site design, except removing the unwanted visible skip link.
- Keep the skip link for accessibility, but make it behave correctly.
- Avoid em dashes in all new copy.