const brands = [
  { src: "/lovable-uploads/cc605216-27d1-40e0-a4c3-bed5d920fd14.png", alt: "Novis Healthcare" },
  { src: "/lovable-uploads/67943b8c-a970-4bf5-8df6-0e555261eb62.png", alt: "Aidacare Healthcare Equipment" },
  { src: "/lovable-uploads/496b4f80-f607-49dd-9fac-beeabae55741.png", alt: "Forté Healthcare" },
  { src: "/lovable-uploads/46b949d7-43d7-423f-9add-ed3ac3bb0669.png", alt: "icare Medical Group" },
  { src: "/lovable-uploads/3203fff7-35d5-4c26-814d-17666d297a02.png", alt: "Sleep Choice" },
];

const BrandTrustStrip = () => {
  return (
    <section className="py-6 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4">
        <p className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-wider">
          Trusted Partners
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {brands.map((brand) => (
            <img
              key={brand.alt}
              src={brand.src}
              alt={brand.alt}
              className="h-8 md:h-10 max-w-[100px] md:max-w-[120px] object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandTrustStrip;
