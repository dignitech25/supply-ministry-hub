/**
 * Parent product data fetching and caching utilities
 */

import { supabase } from '@/integrations/supabase/client';
import { ParentProduct, ProductVariant, groupIntoParents } from './variantHelpers';

// Simple in-memory cache with 5-minute TTL
interface CacheEntry {
  data: ParentProduct;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheEntry>();

export async function hydrateWithFullDescriptions<T extends { sku?: string; description?: string | null }>(products: T[]): Promise<T[]> {
  const skus = Array.from(new Set(products.map((product) => product.sku).filter(Boolean))) as string[];
  if (skus.length === 0) return products;

  const descriptionBySku = new Map<string, string>();

  for (let i = 0; i < skus.length; i += 200) {
    const { data, error } = await supabase
      .from('products')
      .select('sku, description')
      .in('sku', skus.slice(i, i + 200));

    if (error) {
      console.error('Error hydrating product descriptions:', error);
      continue;
    }

    (data || []).forEach((row) => {
      if (row.sku && row.description) descriptionBySku.set(row.sku, row.description);
    });
  }

  return products.map((product) => {
    const fullDescription = product.sku ? descriptionBySku.get(product.sku) : undefined;
    if (!fullDescription || (product.description && product.description.length >= fullDescription.length)) return product;
    return { ...product, description: fullDescription };
  });
}

/**
 * Clear the cache (useful after data updates)
 */
export function bustParentProductCache() {
  cache.clear();
  console.log('Parent product cache cleared');
}

/**
 * Fetch a parent product by slug with all its variants
 */
export async function fetchParentProduct(slug: string): Promise<ParentProduct | null> {
  // Check cache first
  const cached = cache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`Cache hit for parent product: ${slug}`);
    return cached.data;
  }
  
  try {
    // Parse slug to get brand and base name components
    const slugParts = slug.split('_');
    const brand = slugParts[0];
    
    // Fetch all products that could match this parent
    // We need to fetch broadly and then group to find the right parent
    const { data: products, error } = await supabase
      .from('products_categorized')
      .select('*')
      .ilike('brand', `%${brand}%`);
    
    if (error) {
      console.error('Error fetching products:', error);
      return null;
    }
    
    if (!products || products.length === 0) {
      return null;
    }
    
    const hydratedProducts = await hydrateWithFullDescriptions(products);

    // Group products into parents
    const parentMap = groupIntoParents(hydratedProducts);
    
    // Find the matching parent
    const parent = parentMap.get(slug);
    
    if (!parent) {
      return null;
    }
    
    // Cache the result
    cache.set(slug, {
      data: parent,
      timestamp: Date.now(),
    });
    
    return parent;
  } catch (error) {
    console.error('Error in fetchParentProduct:', error);
    return null;
  }
}

/**
 * Fetch a parent product by SKU (backward compatibility)
 * Finds the product with this SKU and returns its parent
 */
export async function fetchParentProductBySku(sku: string): Promise<ParentProduct | null> {
  return fetchParentProductByField('sku', sku);
}

/**
 * Fetch a parent product by handle (database handle field)
 * Finds the product with this handle and returns its parent
 */
export async function fetchParentProductByHandle(handle: string): Promise<ParentProduct | null> {
  return fetchParentProductByField('handle', handle);
}

/**
 * Internal helper to fetch parent product by any unique field
 */
async function fetchParentProductByField(field: 'sku' | 'handle', value: string): Promise<ParentProduct | null> {
  try {
    // Fetch the specific product
    const { data: product, error } = await supabase
      .from('products_categorized')
      .select('*')
      .eq(field, value)
      .limit(1)
      .maybeSingle();
    
    if (error || !product) {
      console.error(`Error fetching product by ${field}:`, error);
      return null;
    }
    
    // Fetch all variants with the same handle or brand
    const { data: relatedProducts, error: relatedError } = await supabase
      .from('products_categorized')
      .select('*')
      .or(`handle.eq.${product.handle},brand.ilike.%${product.brand}%`);
    
    if (relatedError) {
      console.error('Error fetching related products:', relatedError);
      return null;
    }
    
    const hydratedProducts = await hydrateWithFullDescriptions(relatedProducts || []);

    // Group and find parent
    const parentMap = groupIntoParents(hydratedProducts);
    
    // Find which parent contains this SKU
    for (const parent of parentMap.values()) {
      if (parent.variants.some(v => 
        field === 'sku' ? v.sku === value : v.handle === value
      )) {
        return parent;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error in fetchParentProductByField (${field}):`, error);
    return null;
  }
}

/**
 * Fetch all parent products (for listing pages)
 * Returns array of parent products with pagination support
 */
export async function fetchAllParentProducts(options?: {
  search?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  page?: number;
  pageSize?: number;
}): Promise<{ parents: ParentProduct[]; total: number }> {
  try {
    let query = supabase.from('products_categorized').select('*', { count: 'exact' });
    
    // Apply filters
    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,brand.ilike.%${options.search}%,description_short.ilike.%${options.search}%`);
    }
    
    if (options?.category) {
      query = query.eq('top_level_category', options.category);
    }
    
    if (options?.subcategory) {
      query = query.eq('subcategory', options.subcategory);
    }
    
    if (options?.brand) {
      query = query.eq('brand', options.brand);
    }
    
    const { data: products, error, count } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return { parents: [], total: 0 };
    }
    
    if (!products || products.length === 0) {
      return { parents: [], total: 0 };
    }
    
    const hydratedProducts = await hydrateWithFullDescriptions(products);

    // Group into parents
    const parentMap = groupIntoParents(hydratedProducts);
    let parents = Array.from(parentMap.values());
    
    // Apply sorting
    if (options?.sortBy) {
      parents = sortParents(parents, options.sortBy);
    }
    
    // Apply pagination
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedParents = parents.slice(start, end);
    
    return { 
      parents: paginatedParents, 
      total: parents.length 
    };
  } catch (error) {
    console.error('Error in fetchAllParentProducts:', error);
    return { parents: [], total: 0 };
  }
}

/**
 * Sort parent products by various criteria
 */
function sortParents(parents: ParentProduct[], sortBy: string): ParentProduct[] {
  const sorted = [...parents];
  
  switch (sortBy) {
    case 'price_asc':
      sorted.sort((a, b) => {
        const priceA = a.fromPrice || Infinity;
        const priceB = b.fromPrice || Infinity;
        return priceA - priceB;
      });
      break;
    case 'price_desc':
      sorted.sort((a, b) => {
        const priceA = a.fromPrice || 0;
        const priceB = b.fromPrice || 0;
        return priceB - priceA;
      });
      break;
    case 'name_asc':
      sorted.sort((a, b) => a.baseName.localeCompare(b.baseName));
      break;
    case 'name_desc':
      sorted.sort((a, b) => b.baseName.localeCompare(a.baseName));
      break;
  }
  
  return sorted;
}
