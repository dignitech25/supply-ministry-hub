## Goal
Tighten the supplier strip: make icare and Enable Lifecare as crisp/bright as the others, and lift Novis so it doesn't sit visually low.

## Diagnosed issues
1. **Enable Lifecare looks dull** — its normalized PNG tops out at alpha `230/255` (~10% see-through baked in), so against the strip's 70% base opacity it renders dimmer than peers. It's also the shortest mark (36px tall vs ~70px for others) so it reads smaller.
2. **icare "eye" is too dull** — the monochrome flatten lost contrast on the small eye detail. Need to re-process so every original ink pixel becomes fully opaque cream.
3. **Novis hangs low** — bbox-centered in 240×80, but the wordmark has visual weight near the bottom, so optical center sits below geometric center. Needs a small upward shift.

## Fix

### 1. Re-normalize the three problem logos (Python/PIL)
Re-run a tightened processing pass for `icare.png`, `enable-lifecare.png`, `novis.png`:
- **Threshold alpha hard**: any pixel with alpha ≥ 40 becomes fully opaque (alpha = 255) cream `rgb(245, 240, 230)`. Anything below stays fully transparent. No mid-tones — eliminates the dull/washed look.
- **Trim to tight bbox**, then for **Enable Lifecare**, scale to fill ~85% of the 80px box height (currently ~45%) so it matches the visual size of Aspire/Forté.
- **Novis**: after centering, shift the artwork up by ~4px to optically center the wordmark (compensates for bottom-heavy letterforms).
- Keep Aspire, Forté, Sleep Choice as-is (they look right per your feedback).

### 2. No component changes needed
`SupplierStrip.tsx` stays as-is. The fix is purely in the asset processing.

## Result
- icare's eye reads cleanly at full cream brightness.
- Enable Lifecare matches the visual weight and brightness of its neighbors.
- Novis sits on the same optical baseline as the rest of the row.
- Aspire / Forté / Sleep Choice unchanged.

## Files touched
- **Overwritten**: `public/suppliers/normalized/icare.png`, `enable-lifecare.png`, `novis.png`
- **Unchanged**: component, other 3 logos
