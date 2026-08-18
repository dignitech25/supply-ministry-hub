import { Link } from "react-router-dom";
import { money, type Product } from "@/lib/medhealth-catalogue";
import { HOUSE } from "@/partners/medhealth";
import { ProductThumb, useProductHref } from "./ProductCard";
import { ModalShell } from "./ModalShell";

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
    <ModalShell
      title={kit.name}
      description={kit.blurb}
      closeLabel="Close kit details"
      onClose={onClose}
      footer={
        <div className="flex shrink-0 items-center gap-3 border-t border-border px-5 py-4">
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
      }
    >
      <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto px-5">
        {kit.items.map((p) => (
          <li key={p.product_code} className="flex items-center gap-3 py-3">
            <ProductThumb product={p} size="sm" />
            <div className="min-w-0 flex-1">
              <Link
                to={productHref(p.product_code)}
                onClick={onClose}
                className="mh-tap flex min-h-11 items-center truncate text-sm font-medium underline-offset-2 hover:underline"
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
          className="shrink-0 border-t border-border px-5 py-3 text-xs leading-relaxed"
          style={{ color: "rgba(1,10,22,0.7)" }}
        >
          {kit.note}
        </p>
      )}
    </ModalShell>
  );
}
