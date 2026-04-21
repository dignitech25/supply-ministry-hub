const suppliers = [
  { name: "Aspire", src: "/suppliers/aspire.webp", url: "https://aspirehealthcare.com.au" },
  { name: "Enable Lifecare", src: "/suppliers/enable-lifecare.png", url: "https://enablelifecare.com.au" },
  { name: "Forté Healthcare", src: "/suppliers/forte.png", url: "https://www.fortehealthcare.com.au" },
  { name: "icare Medical", src: "/suppliers/icare.jpg", url: "https://icaremedicalgroup.com.au" },
  { name: "Novis", src: "/suppliers/novis.jpg", url: "https://novis.com.au" },
  { name: "Sleep Choice", src: "/suppliers/sleep-choice.png", url: "https://sleepchoice.com.au" },
];

const SupplierStrip = () => {
  return (
    <section
      id="suppliers"
      className="bg-violet border-t border-white/10 py-6 md:py-8"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 px-4 md:px-12 lg:pl-24">
        <div className="flex items-center shrink-0">
          <span
            className="font-geist uppercase"
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
            className="hidden md:inline-block ml-[18px]"
            style={{ width: "1px", height: "14px", background: "hsl(var(--cream) / 0.2)" }}
          />
        </div>

        <div className="relative flex-1 overflow-hidden group">
          {/* Edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 md:w-16 bg-gradient-to-r from-violet to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 md:w-16 bg-gradient-to-l from-violet to-transparent z-10" />

          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {[...suppliers, ...suppliers].map((s, i) => (
              <a
                key={`${s.name}-${i}`}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="mx-3 md:mx-4 shrink-0 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
              >
                <img
                  src={s.src}
                  alt={s.name}
                  loading="lazy"
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupplierStrip;