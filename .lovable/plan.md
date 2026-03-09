

## Smart Floating CTA Button

Replace the current two persistent CTAs (Shop Now in nav + floating Request Quote) with a single smart floating button that adapts based on context.

### Behavior

| Page | Button Label | Action |
|------|-------------|--------|
| Homepage (`/`) | Shop Now | Navigate to `/products` |
| Products listing (`/products`) | Request Quote | Navigate to `/quote` |
| Product detail (`/products/:sku`) | Request Quote | Navigate to `/quote` |
| All other pages | Request Quote | Navigate to `/quote` |

### Changes

1. **Refactor `FloatingQuoteButton.tsx`** into a `FloatingSmartCTA` component that uses `useLocation()` to detect the current route and switch its label, icon, and destination accordingly. On the homepage it shows "Shop Now" with an ArrowRight icon; everywhere else it shows "Request Quote" with the MessageSquare icon. Keeps the existing scroll-triggered visibility (appears after 600px scroll on homepage, immediately on other pages).

2. **Remove "Shop Now" from `CategoryNavigation.tsx`** on both desktop and mobile. The category links remain, but the orange Shop Now button is removed since the floating CTA now handles it.

3. **Update `Index.tsx`** (or wherever FloatingQuoteButton is rendered) to use the renamed component.

### Result
One clean, context-aware floating CTA instead of two competing persistent buttons. The nav bar stays minimal with just category links, search, and cart.

