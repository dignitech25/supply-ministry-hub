import { money, type Product } from "@/lib/medhealth-catalogue";
import { HOUSE } from "@/partners/medhealth";
import { ProductThumb } from "./ProductCard";
import { ModalShell } from "./ModalShell";
import type { Kit } from "./KitSheet";

/** Every fixed clinical kit in one place, with the same select action. */
export function AllKitsSheet({
  kits,
  onClose,
  onAdd,
}: {
  kits: Kit[];
  onClose: () => void;
  onAdd: (items: Product[]) => void;
}) {
  return (
    <ModalShell
      title="All clinical kits"
      description="Select a kit, then adjust the individual products before sending."
      closeLabel="Close all clinical kits"
      onClose={onClose}
      maxWidthClass="sm:max-w-3xl"
    >
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {kits.map((kit) => (
          <article key={kit.id} className="rounded-xl border border-border bg-white p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold" style={{ color: "#231F20" }}>
                  {kit.name}
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {kit.blurb}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: "#010A16" }}>
                  {money(kit.subtotal)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {kit.items.length} item{kit.items.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <ul className="mt-2.5 space-y-1.5">
              {kit.items.map((p) => (
                <li key={p.product_code} className="flex items-center gap-2.5">
                  <ProductThumb product={p} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium" style={{ color: "#231F20" }}>
                      {p.product_name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{p.product_code}</p>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "#010A16" }}>
                    {p.price_rrp != null ? money(p.price_rrp) : "On quote"}
                  </span>
                </li>
              ))}
            </ul>

            {kit.note && (
              <p className="mt-2.5 text-[11px] leading-relaxed" style={{ color: "rgba(1,10,22,0.7)" }}>
                {kit.note}
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                onAdd(kit.items);
                onClose();
              }}
              aria-label={`Select ${kit.name}`}
              className="mt-3 flex min-h-11 w-full items-center justify-center rounded-lg px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-5"
              style={{ backgroundColor: HOUSE.violet }}
            >
              Select kit
            </button>
          </article>
        ))}
      </div>
    </ModalShell>
  );
}
