import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { money, type Product } from "@/lib/medhealth-catalogue";
import { HOUSE } from "@/partners/medhealth";
import { ProductThumb, productHref } from "./ProductCard";

export interface Kit {
  id: string;
  name: string;
  blurb: string;
  items: Product[];
  subtotal: number;
  featured?: boolean;
  note?: string;
}

export function KitSheet({
  kit,
  onClose,
  onAdd,
}: {
  kit: Kit;
  onClose: () => void;
  onAdd: (items: Product[]) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kit-sheet-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-card sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2
              id="kit-sheet-title"
              className="text-lg font-semibold"
              style={{ color: "#231F20" }}
            >
              {kit.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{kit.blurb}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close kit details"
            className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
          {kit.items.map((p) => (
            <li key={p.product_code} className="flex items-center gap-3 py-3">
              <ProductThumb product={p} size="sm" />
              <div className="min-w-0 flex-1">
                <Link
                  to={productHref(p.product_code)}
                  onClick={onClose}
                  className="block truncate text-sm font-medium underline-offset-2 hover:underline"
                  style={{ color: "#231F20" }}
                >
                  {p.product_name}
                </Link>
                <p className="text-xs text-muted-foreground">{p.product_code}</p>
              </div>
              <span className="text-sm font-semibold" style={{ color: "#010A16" }}>
                {p.price_rrp != null ? money(p.price_rrp) : "On quote"}
              </span>
            </li>
          ))}
        </ul>

        {kit.note && (
          <p
            className="border-t border-border px-5 py-3 text-xs leading-relaxed"
            style={{ color: "rgba(1,10,22,0.7)" }}
          >
            {kit.note}
          </p>
        )}

        <div className="flex items-center gap-3 border-t border-border px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">
              {kit.items.length} item{kit.items.length === 1 ? "" : "s"}
            </p>
            <p className="text-base font-bold" style={{ color: "#010A16" }}>
              {money(kit.subtotal)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onAdd(kit.items);
              onClose();
            }}
            className="min-h-11 rounded-xl px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: HOUSE.violet }}
          >
            Select kit
          </button>
        </div>
      </div>
    </div>
  );
}
