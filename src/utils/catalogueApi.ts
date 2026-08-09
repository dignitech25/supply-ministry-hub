import { supabase } from '@/integrations/supabase/client';

/**
 * The generated Supabase types are produced from the table definitions and do
 * not know about these RPCs, so `supabase.rpc` is not typed for them. This is a
 * single narrow escape hatch rather than an `any` at every call site: the
 * argument and return shapes are still checked against the interfaces below.
 */
export interface RpcResult<T> {
  data: T | null;
  error: { message: string } | null;
}

/**
 * Called through a wrapper rather than assigned as a bare reference:
 * `supabase.rpc` uses `this` internally, so detaching it into a const throws
 * "Cannot read properties of undefined (reading 'rest')" at the first call.
 */
export function rpc<T>(fn: string, args: Record<string, unknown>): PromiseLike<RpcResult<T>> {
  return supabase.rpc(fn as never, args as never) as unknown as PromiseLike<RpcResult<T>>;
}

/**
 * Server-side catalogue access.
 *
 * Replaces the previous client-side pattern, which fetched every matching
 * variant row in 1,000-row batches (3,347 rows for an unfiltered catalogue,
 * across four parallel requests) and grouped them into families in the browser
 * purely to render 24 cards.
 *
 * `search_product_families` does the filtering, searching, sorting, paging and
 * counting in one round trip and returns one row per family.
 */

export interface ProductFamilyRow {
  id: string;
  slug: string;
  title: string;
  display_name: string | null;
  brand: string | null;
  top_level_category: string | null;
  subcategory: string | null;
  primary_image_url: string | null;
  representative_sku: string | null;
  /**
   * The variant the query actually matched, when the query was a SKU. Null for
   * plain text searches. Callers should navigate to this rather than the
   * representative SKU so an exact SKU search opens the right variant.
   */
  matched_sku: string | null;
  min_price: number | string | null;
  max_price: number | string | null;
  variant_count: number;
  /** Total families matching the filters, before limit/offset. */
  total_count: number;
}

export type CatalogueSort = 'relevance' | 'price-low' | 'price-high' | 'brand-az';

export interface CatalogueQuery {
  query?: string;
  categories?: string[];
  subcategories?: string[];
  brands?: string[];
  sort?: CatalogueSort;
  limit?: number;
  offset?: number;
}

export interface CatalogueResult {
  families: ProductFamilyRow[];
  totalCount: number;
}

export async function searchProductFamilies(
  options: CatalogueQuery = {}
): Promise<CatalogueResult> {
  const { data, error } = await rpc<ProductFamilyRow[]>('search_product_families', {
    p_query: options.query?.trim() || null,
    p_categories: options.categories?.length ? options.categories : null,
    p_subcategories: options.subcategories?.length ? options.subcategories : null,
    p_brands: options.brands?.length ? options.brands : null,
    p_sort: options.sort ?? 'relevance',
    p_limit: options.limit ?? 24,
    p_offset: options.offset ?? 0,
  });

  if (error) throw new Error(error.message);

  const families = data ?? [];
  // total_count is a window function over the filtered set, so it is identical
  // on every row and absent when there are none.
  return { families, totalCount: families[0]?.total_count ?? 0 };
}

export interface CatalogueFacets {
  categories: string[];
  subcategories: string[];
  brands: string[];
}

/**
 * Replaces downloading all 3,347 variant rows on mount just to derive the brand
 * list, and downloading them again whenever a category was picked.
 */
export async function getCatalogueFacets(categories?: string[]): Promise<CatalogueFacets> {
  const { data, error } = await rpc<{ facet_type: string; value: string }[]>(
    'get_catalogue_facets',
    { p_categories: categories?.length ? categories : null }
  );

  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const pick = (type: string) =>
    rows.filter((r) => r.facet_type === type && r.value).map((r) => r.value);

  return {
    categories: pick('category'),
    subcategories: pick('subcategory'),
    brands: pick('brand'),
  };
}

/** price_discounted is a TEXT column upstream, so prices can arrive as strings. */
export function toPrice(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
