import { PARTNER } from "@/partners/medhealth";

/** Single tinted band on the page. Explains why this selection exists. */
export function PartnerContextBand() {
  return (
    <section
      aria-label={`Why this catalogue was prepared for ${PARTNER.name}`}
      className="border-y"
      style={{ backgroundColor: PARTNER.accentPale, borderColor: PARTNER.rule }}
    >
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
        {PARTNER.context.map((c) => (
          <div key={c.title}>
            <div
              className="mb-2 h-[3px] w-8 rounded-full"
              style={{ backgroundColor: PARTNER.accent }}
              aria-hidden="true"
            />
            <h2
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: PARTNER.ink }}
            >
              {c.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "rgba(1,10,22,0.72)" }}>
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
