# Fix MedHealth product detail bullets and code label

## Changes

1. **Bullet list formatting in `src/pages/MedHealthProduct.tsx`**
   - Replace the flex-based bullet rows in the "About this product" section and the selectable-options list with a standard `list-disc list-outside pl-5` unordered list.
   - Wrapped text will align under the text start (hanging indent), giving a clean, professional appearance instead of the current ragged flex layout.

2. **Product code label**
   - Change `Code {product.product_code}` to `Code: {product.product_code}` on the product detail page. Because this is the shared product detail template, the change applies to all 16 MedHealth products.

## Verification

- Load a MedHealth product page (e.g. `/partners/medhealth-capability-2026/product/SMDL10339`).
- Confirm the "About this product" bullets use clean hanging indents.
- Confirm the product code label reads "Code: ...".
- Run the type check to ensure no regressions.
