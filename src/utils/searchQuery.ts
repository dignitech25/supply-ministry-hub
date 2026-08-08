/**
 * Helpers for building PostgREST filters safely from user input.
 *
 * PostgREST's `or=(...)` filter is a comma-delimited, parenthesised grammar.
 * Interpolating raw user input into it means a query containing a comma or a
 * bracket is parsed as filter *syntax* rather than as a search term. In
 * practice a shopper typing "mattress, king" produced a malformed request and
 * an empty result set, which then read as "we don't stock it".
 */

/** Characters that terminate or restructure a PostgREST or-filter expression. */
const FILTER_STRUCTURAL_CHARS = /[,()"\\]/g;

/**
 * Strips characters that would be interpreted as PostgREST filter syntax.
 * Applied to the *pattern*, not to the displayed query, so the user still sees
 * exactly what they typed.
 */
export function sanitiseFilterTerm(query: string): string {
  return query.replace(FILTER_STRUCTURAL_CHARS, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Builds a quoted ILIKE pattern that is safe to embed in an or-filter.
 * Quoting is belt-and-braces on top of sanitisation: PostgREST accepts a
 * double-quoted filter value, so a stray character can never split the clause.
 */
export function ilikePattern(query: string): string {
  return `"%${sanitiseFilterTerm(query)}%"`;
}

/**
 * Builds the or-filter used for catalogue and predictive search.
 * Returns null when the sanitised query is empty, so callers can skip the
 * filter entirely rather than sending `%%` and matching the whole catalogue.
 */
export function buildProductSearchFilter(
  query: string,
  columns: readonly string[]
): string | null {
  const term = sanitiseFilterTerm(query);
  if (!term) return null;

  const pattern = `"%${term}%"`;
  return columns.map((column) => `${column}.ilike.${pattern}`).join(',');
}
