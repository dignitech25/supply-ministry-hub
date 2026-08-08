import { useLocation } from 'react-router-dom';
import { useDocumentHead } from '@/hooks/useDocumentHead';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: object | object[];
}

const SITE_URL = 'https://www.supplyministry.com.au';
const DEFAULT_OG_IMAGE = 'https://www.supplyministry.com.au/og-image.jpg?v=5fbf8be1';

/**
 * Sets the document head for a route.
 *
 * Renders nothing. Previously this returned a <Helmet> tree, which was verified
 * to emit nothing at all -- see src/hooks/useDocumentHead.ts for the evidence.
 * The prop interface is unchanged, so call sites did not need to move.
 */
const SEO = ({
  title = "Supply Ministry | Assistive Technology & Mobility Solutions",
  description = "Supply Ministry connects care with solutions. Australia's trusted provider of assistive technology, mobility aids, and therapeutic equipment for NDIS, aged care, and disability support.",
  canonical,
  type = "website",
  image,
  noindex = false,
  jsonLd
}: SEOProps) => {
  const location = useLocation();
  const siteTitle = title.includes("Supply Ministry") ? title : `${title} | Supply Ministry`;

  // Canonical deliberately ignores the query string: filter and pagination
  // permutations of /products must not each claim to be a separate page.
  const canonicalUrl = canonical || `${SITE_URL}${location.pathname}`;
  const ogImage = image || DEFAULT_OG_IMAGE;
  const jsonLdScripts = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  useDocumentHead({
    title: siteTitle,
    meta: [
      { name: 'description', content: description },
      ...(noindex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
      { property: 'og:title', content: siteTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:image', content: ogImage },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:site_name', content: 'Supply Ministry' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: siteTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    links: [
      { rel: 'canonical', href: canonicalUrl },
      { rel: 'alternate', href: canonicalUrl, hreflang: 'en-AU' },
      { rel: 'alternate', href: canonicalUrl, hreflang: 'x-default' },
    ],
    jsonLd: jsonLdScripts,
  });

  return null;
};

// Organization schema for sitewide use
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Supply Ministry",
  "url": "https://www.supplyministry.com.au",
  "logo": "https://www.supplyministry.com.au/Supply_Ministry.svg",
  "description": "Australia's trusted provider of assistive technology, mobility aids, and therapeutic equipment for healthcare professionals and NDIS providers.",
  "email": "david@supplyministry.com.au",
  "areaServed": {
    "@type": "Country",
    "name": "Australia"
  },
  "knowsAbout": [
    "Assistive Technology",
    "Mobility Equipment",
    "NDIS Equipment",
    "Aged Care Equipment",
    "Therapeutic Equipment"
  ]
};

// Helper to create product schema
export const createProductSchema = (product: {
  name: string;
  description: string;
  sku: string;
  brand?: string;
  image?: string;
  price?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "sku": product.sku,
  "brand": product.brand ? {
    "@type": "Brand",
    "name": product.brand
  } : undefined,
  "image": product.image,
  // Deliberately no `availability`: there is no stock or lead-time source of
  // truth behind this catalogue, so asserting InStock would be unsupported.
  "offers": product.price ? {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": "AUD"
  } : undefined
});

// LocalBusiness schema for homepage
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Supply Ministry",
  "url": "https://www.supplyministry.com.au",
  "logo": "https://www.supplyministry.com.au/Supply_Ministry.svg",
  "email": "david@supplyministry.com.au",
  "telephone": ["+61452002450", "+61404593090"],
  "openingHours": "Mo-Fr 08:30-17:00",
  "areaServed": {
    "@type": "Country",
    "name": "Australia"
  },
  "priceRange": "$$",
  "currenciesAccepted": "AUD",
  "knowsAbout": [
    "Assistive Technology",
    "Mobility Equipment",
    "NDIS Equipment",
    "Aged Care Equipment"
  ]
};

// Helper to create breadcrumb schema
export const createBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export default SEO;
