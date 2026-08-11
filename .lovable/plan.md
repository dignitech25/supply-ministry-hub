# Tidy the product description layout

The "About this product" text currently prints raw source lines, so asterisks show as literal characters and long lines wrap awkwardly with a single word dropping to its own line.

## What changes

On the MedHealth product page:

- Split the specification text into its separate points and drop the leading asterisk or dash from each one.
- Render the points as a clean list with a small violet dot marker and hanging indent, so wrapped text lines up under the first word rather than under the marker.
- Any leading paragraph text that is not a bullet point stays as a normal paragraph above the list.
- Set a comfortable measure (around 60 characters) and balanced wrapping so no line is left with a single orphan word, and long product codes or measurements break cleanly rather than overflowing.
- Slightly more line spacing and spacing between points for readability.

Same treatment applies to the "selectable options" list just above it, so both read consistently.

## Technical notes

- Edit `src/pages/MedHealthProduct.tsx` only. Add a small local parser that splits `key_specifications` on newlines and on inline `*` separators, trims markers, and filters empties.
- Replace the `whitespace-pre-line` paragraph with a `ul` using `list-none` plus a styled span marker, `pl-5 -indent-*` style hanging indent via flex rows, `max-w-[60ch]`, `text-pretty`, `hyphens-none` and `break-words`.
- No data, database, or export changes. The main Supply Ministry product pages are untouched.
