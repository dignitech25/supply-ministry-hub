import { Layers } from "lucide-react";
import { money, type Product } from "@/lib/medhealth-catalogue";
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
        <Layers className="h-4 w-4" style={{ color: "#010A16" }} aria-hidden="true" />
        <h2
          id="kits-heading"
          className="text-xs font-semibold uppercase tracking-[0.12em]"
          style={{ color: "#231F20" }}
        >
          Clinical kits
        </h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Grouped for MedHealth caseloads, so a common setup is one click rather than ten.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kits.map((kit) => (
          <article
            key={kit.id}
            className="flex flex-col rounded-xl border border-border bg-white p-3 transition-colors hover:border-[#010A16]"
          >
            <h3 className="text-sm font-semibold" style={{ color: "#231F20" }}>
              {kit.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{kit.blurb}</p>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {kit.items.map((p) => (
                <ProductThumb key={p.product_code} product={p} size="sm" />
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
                className="flex min-h-9 flex-1 items-center justify-center rounded-lg border px-2 text-xs font-semibold transition-colors hover:bg-[rgba(1,10,22,0.1)]"
                style={{
                  borderColor: "rgba(1,10,22,0.4)",
                  color: "#010A16",
                }}
              >
                View kit
              </button>
              <button
                type="button"
                onClick={() => onAdd(kit.items)}
                className="flex min-h-9 flex-1 items-center justify-center rounded-lg px-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#3D2D9E" }}
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
