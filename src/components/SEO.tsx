import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

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
  
  // Auto-generate canonical URL if not provided
  const canonicalUrl = canonical || `${SITE_URL}${location.pathname}`;
  
  // Use provided image or default
  const ogImage = image || DEFAULT_OG_IMAGE;
  
  // Handle single or multiple JSON-LD scripts
  const jsonLdScripts = jsonLd 
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    : [];
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      
      {/* Indexing control */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Supply Ministry" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang */}
      <link rel="alternate" hrefLang="en-AU" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* JSON-LD Structured Data */}
      {jsonLdScripts.map((script, index) => (
        <script 
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(script) }}
        />
      ))}
    </Helmet>
  );
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
  "offers": product.price ? {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": "AUD",
    "availability": "https://schema.org/InStock"
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
