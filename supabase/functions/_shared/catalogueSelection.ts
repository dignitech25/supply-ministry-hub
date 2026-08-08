export interface CatalogueVariantRow {
  sku: string;
  brand: string | null;
  title: string | null;
  price_rrp: number | null;
  price_discounted: string | null;
}

export function parseCataloguePrice(value: string | number | null): number | null {
  if (value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

/** `price_discounted` is the live storefront price; RRP is only its fallback. */
export function effectiveCataloguePrice(row: CatalogueVariantRow): number {
  return parseCataloguePrice(row.price_discounted)
    ?? parseCataloguePrice(row.price_rrp)
    ?? Number.POSITIVE_INFINITY;
}

export function selectRepresentativeVariant(
  variants: CatalogueVariantRow[],
): CatalogueVariantRow {
  if (variants.length === 0) {
    throw new Error('Cannot select a representative from an empty variant list');
  }

  return [...variants].sort((a, b) => {
    return effectiveCataloguePrice(a) - effectiveCataloguePrice(b)
      || a.sku.localeCompare(b.sku);
  })[0];
}

export function groupRepresentativeVariants(
  rows: CatalogueVariantRow[],
): CatalogueVariantRow[] {
  const families = new Map<string, CatalogueVariantRow[]>();

  for (const row of rows) {
    const key = JSON.stringify([row.brand, row.title]);
    const family = families.get(key) ?? [];
    family.push(row);
    families.set(key, family);
  }

  return [...families.values()].map(selectRepresentativeVariant);
}
