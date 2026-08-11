import { money, type BedPackage, type Product } from "@/lib/medhealth-catalogue";
import { BRAND_RULE, HOUSE } from "@/partners/medhealth";
import { ProductThumb } from "./ProductCard";
import type { Kit } from "./KitSheet";

export function KitsRow({
  kits,
  onAdd,
  onView,
  onViewAll,
  bedPackage,
  onConfigureBed,
}: {
  kits: Kit[];
  onAdd: (items: Product[]) => void;
  onView: (kit: Kit) => void;
  onViewAll: () => void;
  bedPackage: BedPackage | null;
  onConfigureBed: () => void;
}) {
  if (kits.length === 0) return null;

  const featured = kits.filter((k) => k.featured);
  const shown = featured.length > 0 ? featured : kits.slice(0, 4);

  return (
    <section
      aria-labelledby="kits-heading"
      className="mb-9 overflow-hidden rounded-2xl border"
      style={{ borderColor: "rgba(61,45,158,0.22)", backgroundColor: HOUSE.cream }}
    >
      <div className="h-1.5 w-full" style={{ backgroundImage: BRAND_RULE }} />
      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-5">
          <h2
            id="kits-heading"
            className="text-2xl font-bold tracking-tight sm:text-[31px] sm:leading-tight"
            style={{ color: HOUSE.violet }}
          >
            Clinical kits
          </h2>
          <p
            className="mt-1.5 max-w-[62ch] text-sm leading-relaxed"
            style={{ color: "rgba(1,10,22,0.7)" }}
          >
            Ready-made selections for common daily-living needs. Select a kit, then adjust the
            individual products before sending.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((kit) => (
          <article
            key={kit.id}
            role="button"
            tabIndex={0}
            aria-label={`View ${kit.name}`}
            onClick={() => onView(kit)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onView(kit);
              }
            }}
            className="flex cursor-pointer flex-col rounded-xl border border-border bg-white p-3 transition-colors hover:border-[#3D2D9E]"
          >
            <h3 className="line-clamp-2 h-10 text-sm font-semibold leading-5" style={{ color: "#231F20" }}>
              {kit.name}
            </h3>
            <p className="mt-0.5 line-clamp-2 h-8 text-xs leading-4 text-muted-foreground">
              {kit.blurb}
            </p>

            <div className="mt-2.5 flex h-16 items-center gap-1.5">
              {kit.items.slice(0, 3).map((p) => (
                <div key={p.product_code} className="h-16 flex-1">
                  <ProductThumb product={p} size="fill" />
                </div>
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

            <button
              type="button"
              aria-label={`Select ${kit.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onAdd(kit.items);
              }}
              className="mt-2.5 flex min-h-11 w-full items-center justify-center rounded-lg px-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: HOUSE.violet }}
            >
              Select kit
            </button>
          </article>
        ))}
        </div>

        <div className="mt-3.5">
          <button
            type="button"
            onClick={onViewAll}
            className="mh-tap inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
            style={{ color: HOUSE.violet }}
          >
            View all clinical kits
          </button>
        </div>

        {bedPackage && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-white p-3 sm:flex-row sm:items-center sm:p-4">
            <div className="h-20 w-20 shrink-0 sm:h-24 sm:w-24">
              <ProductThumb product={bedPackage.required[0]} size="fill" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold" style={{ color: "#231F20" }}>
                IC333 Complete Bed Package
              </h3>
              <p className="mt-0.5 max-w-[62ch] text-xs leading-relaxed text-muted-foreground">
                Build a complete electric-bed setup with the appropriate mattress and bedside
                accessories.
              </p>
              {bedPackage.startingPrice != null && (
                <p className="mt-1 text-sm font-bold" style={{ color: "#010A16" }}>
                  Starting from {money(bedPackage.startingPrice)}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onConfigureBed}
              className="flex min-h-11 shrink-0 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: HOUSE.violet }}
            >
              Configure bed package
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
