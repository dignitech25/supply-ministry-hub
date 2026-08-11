# Export catalogue: PDF and Excel

Make the export control prominent, move it to the left of the toolbar, and let it produce a clean, clearly branded Supply Ministry assistive technology catalogue for MedHealth in either PDF or Excel.

## Button changes

- Move the control to the far left of the search toolbar row, before the search field.
- Label it "Export catalogue" with a download icon, filled violet (currently a quiet outlined "Export" on the right).
- Keep it visible on mobile as an icon-plus-short-label button so it no longer disappears on small screens.
- Clicking opens a small dropdown with two choices: "PDF catalogue" and "Excel spreadsheet".
- Exports what is currently on screen (active category and search), matching today's behaviour, with the filter noted in the document header.

## PDF output

A neat, print-ready A4 document:

- Header on page one: Supply Ministry logo and MedHealth logo, title "Assistive Technology Catalogue", subtitle "Prepared by Supply Ministry for the MedHealth team", and the export date.
- The brand rule (violet into the partner circle colours) as a thin bar across the top of every page.
- Products grouped by clinical category, each group with a heading, then a table: Product, Code, Price.
- Clinical kits section listing each kit, its included products and its live subtotal.
- Footer on every page: "Supply Ministry Pty Ltd, a Dignitech brand." plus contact details and page numbers.
- Filename: `supply-ministry-medhealth-catalogue-YYYY-MM-DD.pdf`.

## Excel output

A single workbook:

- Sheet "Catalogue": Category, Product, Code, Price, with a violet header row, frozen top row, auto-filter and sized columns. Prices formatted as currency.
- Sheet "Clinical kits": Kit, Product, Code, Price, with a subtotal row per kit.
- A title block at the top of the first sheet naming the catalogue and the MedHealth team.
- Filename: `supply-ministry-medhealth-catalogue-YYYY-MM-DD.xlsx`.

## Technical notes

- Add `jspdf` and `jspdf-autotable` for the PDF, and `xlsx` (SheetJS) for the workbook.
- New `src/lib/medhealth-export.ts` holding `exportCataloguePdf(products, kits, context)` and `exportCatalogueXlsx(...)`, keeping `MedHealthCapability.tsx` thin. Existing `toCsv`/`downloadCsv` stay in place, unused by the new menu.
- Reuse `HOUSE`, `PARTNER` and `BRAND_RULE` from `src/partners/medhealth.ts` so the exports match the page palette; logos loaded from `/public` and embedded as images.
- Menu built with the existing shadcn `DropdownMenu`.
- No database, catalogue data or product changes.
