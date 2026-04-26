type Proof = {
  eyebrow: string;
  headlineLead: string;
  headlineAccent: string;
  headlineTrail?: string;
  sub: string;
};

const proofs: Proof[] = [
  {
    eyebrow: "Clinician trusted",
    headlineLead: "OT",
    headlineAccent: "referred",
    sub: "Specs and trial documentation included with every quote.",
  },
  {
    eyebrow: "Procurement",
    headlineLead: "Aged care and",
    headlineAccent: "NDIS-ready",
    sub: "Compliant quotes formatted for plan managers and funding bodies.",
  },
  {
    eyebrow: "Turnaround",
    headlineAccent: "24-hour",
    headlineLead: "",
    headlineTrail: "response",
    sub: "We reply to quote requests within one business day.",
  },
  {
    eyebrow: "Catalogue",
    headlineAccent: "2,000+",
    headlineLead: "",
    headlineTrail: "products",
    sub: "Sourced from Australia's leading assistive technology suppliers.",
  },
];

const TrustBar = () => {
  return (
    <section
      aria-label="Why providers choose Supply Ministry"
      className="bg-cream text-ink border-y border-cream-border"
    >
      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {proofs.map((p, i) => (
            <div
              key={p.eyebrow}
              className={
                "flex flex-col " +
                (i > 0
                  ? "lg:border-l lg:border-cream-border lg:pl-8"
                  : "lg:pl-0")
              }
            >
              <span className="font-geist text-[10px] tracking-[0.18em] uppercase text-muted-body mb-3">
                {p.eyebrow}
              </span>
              <h3 className="font-geist text-xl md:text-2xl font-light tracking-tight text-ink leading-tight mb-2">
                {p.headlineLead && <span>{p.headlineLead} </span>}
                <span
                  className="italic"
                  style={{ color: "hsl(var(--gold))" }}
                >
                  {p.headlineAccent}
                </span>
                {p.headlineTrail && <span> {p.headlineTrail}</span>}
              </h3>
              <p className="text-sm text-muted-body leading-relaxed">
                {p.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;