# Remove "Catalogue home" button from MedHealth toolbar

## Goal
Remove the selected "Catalogue home" button from the MedHealth capability page toolbar.

## Change
In `src/pages/MedHealthCapability.tsx`, delete the toolbar button that contains the `Home` icon and "Catalogue home" label (currently at lines 307–314). The `goHome` handler it references is already unused elsewhere after this removal, so it will also be removed to avoid dead code.

## Why
The button duplicates the clickable logo/masthead navigation and clutters the toolbar. Removing it creates a cleaner search-focused header.

## Verification
- Confirm the toolbar no longer renders the "Catalogue home" button.
- Confirm the logo and page title still provide a path back to the catalogue home.
- Run a type check to ensure no unused `goHome` reference remains.
