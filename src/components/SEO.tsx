import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
}

const SEO = ({
  title = "Supply Ministry | Assistive Technology & Mobility Solutions",
  description = "Supply Ministry connects care with solutions. Australia's trusted provider of assistive technology, mobility aids, and therapeutic equipment for NDIS, aged care, and disability support.",
  canonical,
  type = "website"
}: SEOProps) => {
  const siteTitle = title.includes("Supply Ministry") ? title : `${title} | Supply Ministry`;
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
};

export default SEO;
