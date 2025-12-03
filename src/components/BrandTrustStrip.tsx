const brands = [
  { src: "/lovable-uploads/cc605216-27d1-40e0-a4c3-bed5d920fd14.png", alt: "Novis Healthcare", url: "https://novis.com.au" },
  { src: "/lovable-uploads/67943b8c-a970-4bf5-8df6-0e555261eb62.png", alt: "Aidacare Healthcare Equipment", url: "https://aidacare.com.au" },
  { src: "/lovable-uploads/496b4f80-f607-49dd-9fac-beeabae55741.png", alt: "Forté Healthcare", url: "https://www.fortehealthcare.com.au" },
  { src: "/lovable-uploads/46b949d7-43d7-423f-9add-ed3ac3bb0669.png", alt: "icare Medical Group", url: "https://icaremedicalgroup.com.au" },
  { src: "/lovable-uploads/3203fff7-35d5-4c26-814d-17666d297a02.png", alt: "Sleep Choice", url: "https://sleepchoice.com.au" },
];

const BrandTrustStrip = () => {
  return (
    <section className="py-6 bg-muted/30 border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <p className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-wider">
          Trusted Partners
        </p>
      </div>
      <div className="relative group">
        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />
        
        {/* Marquee container - pauses on hover */}
        <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
          {/* First set of logos */}
          {brands.map((brand, index) => (
            <a 
              key={`first-${index}`} 
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 mx-8 md:mx-12"
            >
              <img
                src={brand.src}
                alt={brand.alt}
                className="h-8 md:h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              />
            </a>
          ))}
          {/* Duplicate set for seamless loop */}
          {brands.map((brand, index) => (
            <a 
              key={`second-${index}`} 
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 mx-8 md:mx-12"
            >
              <img
                src={brand.src}
                alt={brand.alt}
                className="h-8 md:h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandTrustStrip;
