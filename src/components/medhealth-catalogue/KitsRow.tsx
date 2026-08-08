import { Layers } from "lucide-react";
import { money, type Product } from "@/lib/medhealth-catalogue";
import { HOUSE, PARTNER } from "@/partners/medhealth";
import { ProductThumb } from "./ProductCard";
import type { Kit } from "./KitSheet";

export function KitsRow({
  kits,
  onAdd,
  onView,
}: {
  kits: Kit[];
  onAdd: (items: Product[]) => void;
  onView: (kit: Kit) => void;
}) {
  if (kits.length === 0) return null;

  return (
    <section aria-labelledby="kits-heading" className="mb-6 rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Layers className="h-4 w-4" style={{ color: HOUSE.violet }} aria-hidden="true" />
        <h2
          id="kits-heading"
          className="text-xs font-semibold uppercase tracking-[0.12em]"
          style={{ color: PARTNER.ink }}
        >
          Clinical kits
        </h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Grouped for MedHealth caseloads, so a common setup is one click rather than ten.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {kits.map((kit) => (
          <article
            key={kit.id}
            className="flex flex-col rounded-xl border border-border bg-white p-3 transition-colors hover:border-[#3D2D9E]"
          >
            <h3 className="text-sm font-semibold" style={{ color: "#231F20" }}>
              {kit.name}
            </h3>
            <p className="mt-0.5 line-clamp-2 h-8 text-xs leading-4 text-muted-foreground">
              {kit.blurb}
            </p>

            <div
              className="mt-2.5 grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${kit.items.length}, minmax(0, 1fr))` }}
            >
              {kit.items.map((p) => (
                <ProductThumb key={p.product_code} product={p} size="fill" />
              ))}
            </div>

            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">
                {kit.items.length} item{kit.items.length === 1 ? "" : "s"}
              </span>
              <span className="text-sm font-bold" style={{ color: "#010A16" }}>
                {money(kit.subtotal)}
              </span>
            </div>

            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                onClick={() => onView(kit)}
                className="flex min-h-9 flex-1 items-center justify-center rounded-lg border px-2 text-xs font-semibold transition-colors hover:bg-[rgba(61,45,158,0.08)]"
                style={{
                  borderColor: HOUSE.violet,
                  color: HOUSE.violet,
                }}
              >
                View kit
              </button>
              <button
                type="button"
                onClick={() => onAdd(kit.items)}
                className="flex min-h-9 flex-1 items-center justify-center rounded-lg px-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: HOUSE.violet }}
              >
                Add kit
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
