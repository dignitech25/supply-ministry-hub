type Proof = {
  eyebrow: string;
  headline: string;
  sub: string;
};

const proofs: Proof[] = [
  {
    eyebrow: "For occupational therapists",
    headline: "We can source you anything",
    sub: "If it is not in our range, ask. We will find it.",
  },
  {
    eyebrow: "For the family",
    headline: "We talk to the people who matter",
    sub: "We stay in touch with the family directly, so nothing gets lost in translation.",
  },
  {
    eyebrow: "24 hour response",
    headline: "We get back to you the same day",
    sub: "Every quote, every time.",
  },
  {
    eyebrow: "15+ years",
    headline: "We have been in this work a long time",
    sub: "Most of the situations that come up, we have seen before.",
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
                {p.headline}
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