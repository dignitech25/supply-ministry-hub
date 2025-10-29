/**
 * Variant parsing and normalization utilities
 * Groups products into parent-variant relationships without database changes
 */

export interface ProductVariant {
  sku: string;
  handle: string;
  title: string;
  brand: string;
  size?: string;
  sizeNormalized?: string;
  color?: string;
  colorNormalized?: string;
  priceRrp: number | null;
  priceDiscounted: number | null;
  imageUrl?: string;
  description?: string;
  descriptionLong?: string;
  clinicalUseCase?: string;
  specifications?: string;
  category?: string;
  subcategory?: string;
}

export interface ParentProduct {
  slug: string;
  baseName: string;
  brand: string;
  category?: string;
  subcategory?: string;
  description?: string;
  descriptionLong?: string;
  clinicalUseCase?: string;
  variants: ProductVariant[];
  uniqueSizes: string[];
  uniqueColors: string[];
  fromPrice: number | null;
  defaultVariant: ProductVariant;
}

// Size tokens to recognize and remove from titles
const SIZE_TOKENS = [
  // Full names
  'Long Single', 'King Single', 'Short Single', 'Split Queen', 'Super King',
  'Single', 'Double', 'Queen', 'King',
  // Abbreviations
  'LS', 'KS', 'SS', 'SQ', 'SK',
  // Generic size indicators
  'Small', 'Medium', 'Large', 'XL', 'XXL',
  'S', 'M', 'L', 'XL', 'XXL'
];

// Color tokens to recognize
const COLOR_TOKENS = [
  'Beige', 'Black', 'Blue', 'Charcoal', 'Cream', 'Grey', 'Gray', 
  'Navy', 'White', 'Brown', 'Green', 'Red', 'Silver', 'Gold',
  'Light Blue', 'Dark Blue', 'Light Grey', 'Dark Grey',
  'Light Gray', 'Dark Gray'
];

/**
 * Extract base name from product title by removing ONLY size and dimension tokens
 * Keep material types (Fabric, Vinyl, Leather) as they define distinct products
 */
export function extractBaseName(title: string): string {
  let baseName = title;
  
  // Remove size tokens (case insensitive, word boundaries)
  SIZE_TOKENS.forEach(token => {
    const regex = new RegExp(`\\b${token}\\b`, 'gi');
    baseName = baseName.replace(regex, '');
  });
  
  // Remove dimension patterns like (100cm x 200cm) or 1000mm x 2000mm
  baseName = baseName.replace(/\(?\d+\s*(cm|mm|m|inch|in)\s*x\s*\d+\s*(cm|mm|m|inch|in)\)?/gi, '');
  baseName = baseName.replace(/\d+\s*(cm|mm|m|inch|in)/gi, '');
  
  // Clean up extra spaces and dashes
  baseName = baseName.replace(/\s+/g, ' ').replace(/\s*-\s*$/, '').trim();
  
  return baseName;
}

/**
 * Generate parent slug from brand and base name using underscores
 */
export function generateParentSlug(brand: string, baseName: string): string {
  const cleanBrand = brand.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  
  const cleanName = baseName.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  
  return `${cleanBrand}_${cleanName}`;
}

/**
 * Parse size from product data
 */
export function parseSize(variant: any): string | undefined {
  // Prefer normalized size if available
  if (variant.size_normalized) return variant.size_normalized;
  if (variant.size) return variant.size;
  
  // Try to extract from title
  const title = variant.title || '';
  for (const token of SIZE_TOKENS) {
    const regex = new RegExp(`\\b${token}\\b`, 'i');
    if (regex.test(title)) {
      return token;
    }
  }
  
  return undefined;
}

/**
 * Parse color from product data
 */
export function parseColor(variant: any): string | undefined {
  // Prefer normalized color if available
  if (variant.color_normalized) return variant.color_normalized;
  
  // Try to extract from title
  const title = variant.title || '';
  for (const token of COLOR_TOKENS) {
    const regex = new RegExp(`\\b${token}\\b`, 'i');
    if (regex.test(title)) {
      return token;
    }
  }
  
  return undefined;
}

/**
 * Calculate the "from" price (minimum price across all variants)
 */
export function calculateFromPrice(variants: ProductVariant[]): number | null {
  const prices = variants
    .map(v => v.priceDiscounted || v.priceRrp)
    .filter((p): p is number => p !== null && p !== undefined);
  
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

/**
 * Select default variant (cheapest or first available)
 */
export function selectDefaultVariant(variants: ProductVariant[]): ProductVariant {
  if (variants.length === 0) {
    throw new Error('Cannot select default variant from empty array');
  }
  
  // Find cheapest variant
  const withPrices = variants.filter(v => v.priceDiscounted || v.priceRrp);
  if (withPrices.length > 0) {
    return withPrices.reduce((cheapest, current) => {
      const currentPrice = current.priceDiscounted || current.priceRrp || Infinity;
      const cheapestPrice = cheapest.priceDiscounted || cheapest.priceRrp || Infinity;
      return currentPrice < cheapestPrice ? current : cheapest;
    });
  }
  
  // Fall back to first variant
  return variants[0];
}

/**
 * Group raw product rows into parent products
 */
export function groupIntoParents(products: any[]): Map<string, ParentProduct> {
  const parentMap = new Map<string, ParentProduct>();
  const unparsableProducts: Array<{ product: any; reason: string }> = [];
  
  products.forEach(product => {
    try {
      const brand = product.brand || 'Unknown';
      const title = product.title || '';
      
      // Use full title for grouping to get exact brand+title matches
      // extractBaseName() is kept for display purposes only
      const baseName = extractBaseName(title);
      
      // Generate parent slug using full title (not baseName)
      const slug = generateParentSlug(brand, title);
      
      // Normalize variant
      const variant = normalizeVariant(product);
      
      // Add to parent or create new parent
      if (parentMap.has(slug)) {
        const parent = parentMap.get(slug)!;
        parent.variants.push(variant);
        
        // Update unique sizes and colors
        if (variant.size && !parent.uniqueSizes.includes(variant.size)) {
          parent.uniqueSizes.push(variant.size);
        }
        if (variant.color && !parent.uniqueColors.includes(variant.color)) {
          parent.uniqueColors.push(variant.color);
        }
        
        // Recalculate from price
        parent.fromPrice = calculateFromPrice(parent.variants);
        
        // Update default variant if this one is cheaper
        const currentDefaultPrice = parent.defaultVariant.priceDiscounted || parent.defaultVariant.priceRrp || Infinity;
        const newPrice = variant.priceDiscounted || variant.priceRrp || Infinity;
        if (newPrice < currentDefaultPrice) {
          parent.defaultVariant = variant;
        }
      } else {
        parentMap.set(slug, {
          slug,
          baseName,
          brand,
          category: product.top_level_category,
          subcategory: product.subcategory,
          description: product.description_short,
          descriptionLong: product.description_long,
          clinicalUseCase: product.clinical_use_case,
          variants: [variant],
          uniqueSizes: variant.size ? [variant.size] : [],
          uniqueColors: variant.color ? [variant.color] : [],
          fromPrice: variant.priceDiscounted || variant.priceRrp,
          defaultVariant: variant,
        });
      }
    } catch (error) {
      unparsableProducts.push({ 
        product, 
        reason: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
  
  // Log unparsable products for debugging
  if (unparsableProducts.length > 0) {
    console.warn(`Found ${unparsableProducts.length} unparsable products:`, unparsableProducts);
  }
  
  console.log(`Grouped ${products.length} products into ${parentMap.size} parent products`);
  
  return parentMap;
}

/**
 * Normalize a raw product row into a ProductVariant
 */
function normalizeVariant(product: any): ProductVariant {
  return {
    sku: product.sku,
    handle: product.handle,
    title: product.title,
    brand: product.brand || 'Unknown',
    size: parseSize(product),
    sizeNormalized: product.size_normalized,
    color: parseColor(product),
    colorNormalized: product.color_normalized,
    priceRrp: product.price_rrp,
    priceDiscounted: product.price_discounted,
    imageUrl: product.image_url,
    description: product.description_short,
    descriptionLong: product.description_long,
    clinicalUseCase: product.clinical_use_case,
    specifications: product.specifications,
    category: product.top_level_category,
    subcategory: product.subcategory,
  };
}
