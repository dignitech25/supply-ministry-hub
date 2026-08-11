# Round all prices to whole dollars

Remove cents everywhere on the MedHealth catalogue: product cards, detail pages, kits, review and send, the sticky total, and both exports.

## Change

- `src/lib/medhealth-catalogue.ts`: the shared `money` formatter rounds to the nearest dollar and always shows zero decimal places, so `$1,234.50` becomes `$1,235`. Every screen and both export files use this formatter, so the change flows through in one place.
- `src/lib/medhealth-export.ts`: the Excel price cells currently carry a `$#,##0.00` number format. Switch that to `$#,##0` and round the raw numbers written into the sheet, so the spreadsheet matches the page and the PDF.

Subtotals stay consistent by summing the raw prices and rounding the result at display time.
