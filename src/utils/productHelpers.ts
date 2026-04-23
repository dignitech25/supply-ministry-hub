/**
 * Product utility functions for formatting and parsing product data
 */

/**
 * Format a numeric price as currency without decimals
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) {
    return 'Contact for pricing';
  }
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Parse clinical use cases from pipe-delimited string
 */
export function parseClinicalUseCases(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split('|')
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

/**
 * Parse specifications JSONB into key-value pairs
 */
export function parseSpecifications(
  jsonb: any
): Array<{ key: string; value: string }> {
  if (!jsonb || typeof jsonb !== 'object') return [];
  
  return Object.entries(jsonb).map(([key, value]) => ({
    key: formatSpecKey(key),
    value: String(value),
  }));
}

/**
 * Format specification key from snake_case or camelCase to Title Case
 */
function formatSpecKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .trim();
}

/**
 * Clean description text for better readability
 */
export function cleanDescription(text: string | null | undefined): string {
  if (!text) return '';

  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[\t ]+\n/g, '\n')
    .replace(/\n[\t ]+/g, '\n')
    .replace(/([^\s([])\(/g, '$1 (')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\)([A-Za-z0-9])/g, ') $1')
    .replace(/([a-z]{2,})(\d{2,})/g, '$1 $2')
    .replace(/(\d)([a-z]{2,})/g, '$1 $2')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([,;:!?])([^\s\n])/g, '$1 $2')
    .replace(/([.!?])([A-Z])/g, '$1 $2')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Split cleaned description text into paragraph blocks while preserving
 * single-line breaks inside each block.
 */
export function getDescriptionParagraphs(text: string | null | undefined): string[] {
  const cleaned = cleanDescription(text);

  if (!cleaned) return [];

  return cleaned
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/**
 * Get placeholder image path for products without images
 */
export function getImagePlaceholder(): string {
  // Return a data URL for a lavender placeholder
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23C4B5FD" width="400" height="400"/%3E%3Ctext fill="%23ffffff" font-family="sans-serif" font-size="24" text-anchor="middle" x="200" y="200"%3ENo Image%3C/text%3E%3C/svg%3E';
}

/**
 * Calculate if a product is on sale
 */
export function isOnSale(priceRrp: number | null, priceDiscounted: number | null): boolean {
  if (!priceRrp || !priceDiscounted) return false;
  return priceDiscounted < priceRrp;
}
