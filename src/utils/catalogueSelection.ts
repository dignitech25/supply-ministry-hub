export interface PricedVariant {
  sku: string;
  priceRrp: number | null;
  priceDiscounted: number | null;
}

export function parseCataloguePrice(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

/** `price_discounted` is the live storefront price; RRP is only its fallback. */
export function getEffectiveVariantPrice(
  variant: Pick<PricedVariant, 'priceDiscounted' | 'priceRrp'>,
): number | null {
  return parseCataloguePrice(variant.priceDiscounted)
    ?? parseCataloguePrice(variant.priceRrp);
}

export function comparePricedVariants(a: PricedVariant, b: PricedVariant): number {
  const aPrice = getEffectiveVariantPrice(a) ?? Number.POSITIVE_INFINITY;
  const bPrice = getEffectiveVariantPrice(b) ?? Number.POSITIVE_INFINITY;
  return aPrice - bPrice || a.sku.localeCompare(b.sku);
}

export function selectDefaultPricedVariant<T extends PricedVariant>(variants: T[]): T {
  if (variants.length === 0) {
    throw new Error('Cannot select default variant from an empty list');
  }
  return [...variants].sort(comparePricedVariants)[0];
}
