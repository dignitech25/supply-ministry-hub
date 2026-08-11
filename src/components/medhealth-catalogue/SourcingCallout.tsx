import { Mail, Phone } from "lucide-react";
import { HOUSE, PARTNER } from "@/partners/medhealth";

const MAILTO =
  "mailto:david@supplyministry.com.au?subject=MedHealth%20catalogue%20sourcing%20request";

export function SourcingCallout() {
  return (
    <section
      aria-labelledby="sourcing-heading"
      className="mt-10 rounded-2xl border p-5 sm:p-6"
      style={{ borderColor: PARTNER.rule, backgroundColor: HOUSE.cream }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-[52ch]">
          <h2
            id="sourcing-heading"
            className="text-lg font-semibold tracking-tight sm:text-xl"
            style={{ color: HOUSE.violet }}
          >
            Can’t see what you need?
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "rgba(1,10,22,0.72)" }}>
            Supply Ministry can source equipment beyond this catalogue. Tell us the clinical
            requirement and we’ll find suitable options and provide a quote.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <a
            href={MAILTO}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: HOUSE.violet }}
          >
            <Mail className="h-4 w-4" aria-hidden="true" /> Ask us to source an item
          </a>
          <a
            href="tel:0404593090"
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors hover:bg-[rgba(61,45,158,0.08)]"
            style={{ borderColor: HOUSE.violet, color: HOUSE.violet }}
          >
            <Phone className="h-4 w-4" aria-hidden="true" /> Call 0404 593 090
          </a>
        </div>
      </div>
    </section>
  );
}