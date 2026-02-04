import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
}

const SITE_URL = 'https://supplyministry.com.au';

const SEO = ({
  title = "Supply Ministry | Assistive Technology & Mobility Solutions",
  description = "Supply Ministry connects care with solutions. Australia's trusted provider of assistive technology, mobility aids, and therapeutic equipment for NDIS, aged care, and disability support.",
  canonical,
  type = "website"
}: SEOProps) => {
  const location = useLocation();
  const siteTitle = title.includes("Supply Ministry") ? title : `${title} | Supply Ministry`;
  
  // Auto-generate canonical URL if not provided
  const canonicalUrl = canonical || `${SITE_URL}${location.pathname}`;
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default SEO;
