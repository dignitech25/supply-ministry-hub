import { Search } from "lucide-react";
import type { SourceItem } from "@/lib/medhealth-catalogue";
import { HOUSE, PARTNER } from "@/partners/medhealth";

/**
 * Items we can source on request. Deliberately outside the priced catalogue:
 * not selectable, not counted, not exported, no prices shown.
 */
export function SourceOnRequest({ items }: { items: SourceItem[] }) {
  if (items.length === 0) return null;

  const groups = new Map<string, SourceItem[]>();
  for (const item of items) {
    groups.set(item.clinical_group, [...(groups.get(item.clinical_group) ?? []), item]);
  }

  return (
    <section
      aria-labelledby="source-on-request-heading"
      className="mt-10 rounded-2xl border p-5 sm:p-6"
      style={{ borderColor: PARTNER.rule, backgroundColor: PARTNER.accentPale }}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: "rgba(61,45,158,0.1)", color: HOUSE.violet }}
        >
          <Search className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2
            id="source-on-request-heading"
            className="text-base font-semibold sm:text-lg"
            style={{ color: PARTNER.ink }}
          >
            Also available, ask us to source it
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed" style={{ color: "rgba(1,10,22,0.7)" }}>
            These items sit outside the priced list above and are quoted on request. If something
            your client needs is not here at all, ask anyway. We source across the assistive
            technology market, not just what is listed on this page.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...groups.entries()].map(([group, groupItems]) => (
          <div key={group}>
            <h3
              className="text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "rgba(1,10,22,0.55)" }}
            >
              {group}
            </h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {groupItems.map((item) => (
                <li
                  key={item.product_name}
                  className="rounded-full border bg-white px-2.5 py-1 text-xs"
                  style={{ borderColor: PARTNER.rule, color: PARTNER.ink }}
                >
                  {item.product_name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs" style={{ color: "rgba(1,10,22,0.55)" }}>
        Quoted on request. Not included in your selection, totals or CSV export.
      </p>
    </section>
  );
}
