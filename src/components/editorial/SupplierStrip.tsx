const suppliers = [
  { name: "Novis", src: "/lovable-uploads/cc605216-27d1-40e0-a4c3-bed5d920fd14.png", url: "https://novis.com.au" },
  { name: "Aidacare", src: "/lovable-uploads/67943b8c-a970-4bf5-8df6-0e555261eb62.png", url: "https://aidacare.com.au" },
  { name: "Forté Healthcare", src: "/lovable-uploads/496b4f80-f607-49dd-9fac-beeabae55741.png", url: "https://www.fortehealthcare.com.au" },
  { name: "icare Medical", src: "/lovable-uploads/46b949d7-43d7-423f-9add-ed3ac3bb0669.png", url: "https://icaremedicalgroup.com.au" },
  { name: "Sleep Choice", src: "/lovable-uploads/3203fff7-35d5-4c26-814d-17666d297a02.png", url: "https://sleepchoice.com.au" },
];

const SupplierStrip = () => {
  return (
    <section
      id="suppliers"
      className="bg-violet border-t border-white/10"
      style={{ padding: "13px 16px" }}
    >
      <div className="md:px-12 lg:pl-24 flex items-center flex-wrap gap-y-2">
        <span
          className="font-geist uppercase mr-[18px]"
          style={{
            fontSize: "9px",
            fontWeight: 400,
            letterSpacing: "0.16em",
            color: "hsl(var(--cream) / 0.55)",
          }}
        >
          Our suppliers
        </span>
        <span
          className="hidden md:inline-block mr-[18px]"
          style={{ width: "1px", height: "14px", background: "hsl(var(--cream) / 0.2)" }}
        />
        <div className="flex items-center flex-wrap gap-6 md:gap-8">
          {suppliers.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
            >
              <img
                src={s.src}
                alt={s.name}
                loading="lazy"
                className="h-6 md:h-7 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity brightness-0 invert"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupplierStrip;