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
    <section
      aria-labelledby="kits-heading"
      className="mb-9 overflow-hidden rounded-2xl border"
      style={{ borderColor: "rgba(61,45,158,0.22)", backgroundColor: HOUSE.cream }}
    >
      <div className="h-1 w-full" style={{ backgroundColor: HOUSE.violet }} />
      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-5">
          <p
            className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "rgba(61,45,158,0.75)" }}
          >
            <Layers className="h-3.5 w-3.5" aria-hidden="true" /> Fast-start bundles
          </p>
          <h2
            id="kits-heading"
            className="mt-1 text-xl font-bold tracking-tight sm:text-2xl"
            style={{ color: HOUSE.violet }}
          >
            Clinical kits
          </h2>
          <p
            className="mt-1.5 max-w-[62ch] text-sm leading-relaxed"
            style={{ color: "rgba(1,10,22,0.7)" }}
          >
            Each kit adds a clinically useful starting selection in one tap, grouped for MedHealth
            caseloads and ready to adjust before you send.
          </p>
        </div>

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
              className="mt-2.5 grid h-20 gap-1.5"
              style={{ gridTemplateColumns: `repeat(${kit.items.length}, minmax(0, 1fr))` }}
            >
              {kit.items.map((p) => (
                <ProductThumb key={p.product_code} product={p} size="fill" />
              ))}
            </div>

            <div className="mt-auto flex items-baseline justify-between pt-2.5">
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
      </div>
    </section>
  );
}
