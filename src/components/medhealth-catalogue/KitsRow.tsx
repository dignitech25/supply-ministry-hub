import { Layers } from "lucide-react";
import { money, type Product } from "@/lib/medhealth-catalogue";
import { ProductThumb } from "./ProductCard";

interface Kit {
  id: string;
  name: string;
  blurb: string;
  items: Product[];
  subtotal: number;
}

export function KitsRow({ kits, onAdd }: { kits: Kit[]; onAdd: (items: Product[]) => void }) {
  if (kits.length === 0) return null;

  return (
    <section aria-labelledby="kits-heading" className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <Layers className="h-4 w-4" style={{ color: "#33456B" }} aria-hidden="true" />
        <h2
          id="kits-heading"
          className="text-sm font-semibold uppercase tracking-wide"
          style={{ color: "#231F20", fontFamily: "Outfit, system-ui, sans-serif" }}
        >
          Clinical kits
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kits.map((kit) => (
          <article
            key={kit.id}
            className="flex flex-col rounded-2xl border border-border bg-card p-4 transition-colors hover:border-[#33456B]"
          >
            <h3
              className="text-base font-semibold"
              style={{ color: "#231F20", fontFamily: "Outfit, system-ui, sans-serif" }}
            >
              {kit.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{kit.blurb}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {kit.items.map((p) => (
                <ProductThumb key={p.product_code} product={p} size="sm" />
              ))}
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">
                {kit.items.length} item{kit.items.length === 1 ? "" : "s"}
              </span>
              <span
                className="text-base font-bold"
                style={{ color: "#2A5263", fontFamily: "Outfit, system-ui, sans-serif" }}
              >
                {money(kit.subtotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onAdd(kit.items)}
              className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#3D2D9E", fontFamily: "Outfit, system-ui, sans-serif" }}
            >
              Add kit to selection
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
