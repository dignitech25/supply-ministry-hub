import { Target, CircleDollarSign, Truck } from "lucide-react";
import { PARTNER } from "@/partners/medhealth";

const ICONS = [Target, CircleDollarSign, Truck];

/** Lightweight context strip. Explains why this selection exists without competing with the catalogue. */
export function PartnerContextBand() {
  return (
    <section
      aria-label={`Why this catalogue was prepared for ${PARTNER.name}`}
      className="border-t"
      style={{ borderColor: PARTNER.rule }}
    >
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 sm:grid-cols-3 sm:px-6">
        {PARTNER.context.map((c, i) => {
          const Icon = ICONS[i];
          return (
            <div key={c.title} className="flex items-start gap-3">
              <div
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: PARTNER.accentPale }}
                aria-hidden="true"
              >
                <Icon className="h-3.5 w-3.5" style={{ color: PARTNER.ink }} strokeWidth={2} />
              </div>
              <div>
                <h2
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: PARTNER.ink }}
                >
                  {c.title}
                </h2>
                <p className="mt-0.5 text-sm leading-snug" style={{ color: "rgba(1,10,22,0.72)" }}>
                  {c.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
