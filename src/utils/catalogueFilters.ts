/**
 * Reads a repeatable catalogue filter from the URL.
 *
 * New links use repeated keys (`?brand=A&brand=B`). The old comma-joined format
 * could not represent `Mattresses, Pressure Care`, which covers 846 variants.
 * Legacy comma splitting is therefore only safe for dimensions whose real
 * values are known to be comma-free.
 */
export function readFilterParam(
  params: URLSearchParams,
  key: string,
  splitLegacyCommas: boolean,
): string[] {
  const values = params.getAll(key).filter(Boolean);
  if (values.length > 1 || !splitLegacyCommas) return values;
  if (values.length === 1) {
    return values[0].split(',').map((value) => value.trim()).filter(Boolean);
  }
  return [];
}
