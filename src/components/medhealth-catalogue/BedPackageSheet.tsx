import { useMemo, useState } from "react";
import { X, Check } from "lucide-react";
import { BED_PACKAGE, money, type BedPackage, type Product } from "@/lib/medhealth-catalogue";
import { HOUSE } from "@/partners/medhealth";
import { ProductThumb } from "./ProductCard";

/** Nothing is preselected: firmness and supports are clinical decisions. */
export function BedPackageSheet({
  pkg,
  onClose,
  onAdd,
}: {
  pkg: BedPackage;
  onClose: () => void;
  onAdd: (items: Product[]) => void;
}) {
  const [mattress, setMattress] = useState<string | null>(null);
  const [accessories, setAccessories] = useState<Record<string, boolean>>({});

  const chosen = useMemo(() => {
    const items = [...pkg.required];
    const m = pkg.mattresses.find((p) => p.product_code === mattress);
    if (m) items.push(m);
    for (const a of pkg.accessories) if (accessories[a.product_code]) items.push(a);
    return items;
  }, [pkg, mattress, accessories]);

  const total = chosen.reduce((s, p) => s + (p.price_rrp ?? 0), 0);

  const firmness = (p: Product) =>
    /soft/i.test(p.product_name) ? "Soft" : /medium/i.test(p.product_name) ? "Medium" : "Firm";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bed-package-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-card sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 id="bed-package-title" className="text-lg font-semibold" style={{ color: "#231F20" }}>
              {BED_PACKAGE.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{BED_PACKAGE.blurb}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bed package configuration"
            className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Included
          </h3>
          <ul className="mt-2 space-y-1.5">
            {pkg.required.map((p) => (
              <li key={p.product_code} className="flex items-center gap-2.5">
                <ProductThumb product={p} size="sm" />
                <span className="min-w-0 flex-1 truncate text-xs font-medium" style={{ color: "#231F20" }}>
                  {p.product_name}
                </span>
                <span className="text-xs font-semibold" style={{ color: "#010A16" }}>
                  {money(p.price_rrp)}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Mattress firmness, choose one
          </h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {pkg.mattresses.map((p) => {
              const active = mattress === p.product_code;
              return (
                <button
                  key={p.product_code}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setMattress(p.product_code)}
                  className="min-h-11 rounded-lg border-2 px-3 py-2 text-left text-xs font-semibold transition-colors"
                  style={{
                    borderColor: active ? HOUSE.violet : "hsl(var(--border))",
                    color: active ? HOUSE.violet : "#231F20",
                    backgroundColor: active ? "rgba(61,45,158,0.08)" : "transparent",
                  }}
                >
                  {firmness(p)}
                  <span className="block font-normal text-muted-foreground">{money(p.price_rrp)}</span>
                </button>
              );
            })}
          </div>

          {pkg.accessories.length > 0 && (
            <>
              <h3 className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Optional accessories
              </h3>
              <ul className="mt-2 space-y-1.5">
                {pkg.accessories.map((p) => {
                  const on = Boolean(accessories[p.product_code]);
                  return (
                    <li key={p.product_code}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setAccessories((s) => ({ ...s, [p.product_code]: !s[p.product_code] }))
                        }
                        className="flex min-h-11 w-full items-center gap-2.5 rounded-lg border-2 px-2.5 text-left transition-colors"
                        style={{ borderColor: on ? HOUSE.violet : "hsl(var(--border))" }}
                      >
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2"
                          style={{
                            borderColor: on ? HOUSE.violet : "hsl(var(--border))",
                            backgroundColor: on ? HOUSE.violet : "transparent",
                            color: on ? "#F4EFE6" : "transparent",
                          }}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-xs font-medium" style={{ color: "#231F20" }}>
                          {p.product_name}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: "#010A16" }}>
                          {money(p.price_rrp)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <p className="mt-4 text-xs leading-relaxed" style={{ color: "rgba(1,10,22,0.7)" }}>
            {BED_PACKAGE.note}
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-border px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">
              {chosen.length} item{chosen.length === 1 ? "" : "s"}
            </p>
            <p className="text-base font-bold" style={{ color: "#010A16" }}>
              {money(total)}
            </p>
          </div>
          <button
            type="button"
            disabled={!mattress}
            onClick={() => {
              onAdd(chosen);
              onClose();
            }}
            className="min-h-11 rounded-xl px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: HOUSE.violet }}
          >
            Add bed package
          </button>
        </div>
      </div>
    </div>
  );
}
