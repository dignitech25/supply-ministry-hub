import { PARTNER } from "@/partners/medhealth";

/** Integrated context band. Part of the co-branded field, not a separate announcement. */
export function PartnerContextBand() {
  return (
    <section
      aria-label={`Why this catalogue was prepared for ${PARTNER.name}`}
      style={{ backgroundColor: PARTNER.accentPale, borderColor: PARTNER.rule }}
      className="border-y"
    >
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-5 sm:grid-cols-3 sm:px-6">
        {PARTNER.context.map((c) => (
          <div key={c.title}>
            <div
              className="mb-2 h-0.5 w-7 rounded-full"
              style={{ backgroundColor: PARTNER.accent }}
              aria-hidden="true"
            />
            <h2
              className="text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: PARTNER.ink }}
            >
              {c.title}
            </h2>
            <p className="mt-1 text-sm leading-snug" style={{ color: "rgba(1,10,22,0.72)" }}>
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
