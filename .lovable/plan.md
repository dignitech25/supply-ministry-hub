# Editable selection in Review & send

Today quantities can only be changed on the product cards. Once the review sheet opens, the list is fixed: no way to bump a quantity or drop an item without closing the sheet, hunting for the card, and coming back. This adds full editing to the review list itself.

## What changes

**Each line in the review sheet becomes editable**
- A minus / count / plus control on every line, matching the control already used on product cards.
- A remove button on each line that drops the item entirely.
- Dropping to zero with minus removes the line, same behaviour as the cards.
- The line total and the indicative total update instantly as edits are made.

**Kit items behave as individual lines**
- Items added from a kit appear as ordinary lines and can be adjusted or removed one by one. No grouping, no special kit handling.

**Empty state**
- If every item is removed, the review sheet shows a short message and a button to go back to the catalogue rather than an empty list with a send button.
- The send button is disabled while the selection is empty.

**Stays in sync**
- Edits made in the review sheet are reflected on the product cards behind it, since both read from the same selection state.
- Copy list, Download CSV, and the submitted quote request all use the edited list.

## Technical notes

- `MedHealthCapability.tsx` already owns selection state and exposes `bumpQty` and `toggle`. Pass `onQty(code, delta)` and `onRemove(code)` into `ReviewSheet` rather than duplicating state.
- `ReviewSheet.tsx`: replace the read-only `<li>` rows with rows containing the quantity stepper and a remove button. Reuse the existing stepper styling from `ProductCard.tsx` for visual consistency; extract it into a small shared `QtyStepper` component so the two stay identical.
- Keep touch targets at the existing 44px minimum and keep `aria-label`s on each stepper and remove button naming the product.
- When `lines.length === 0`, render the empty state instead of the form body and disable submit.
- No database or schema changes. No copy changes outside the new empty-state message and button labels.
