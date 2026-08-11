import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Mail, Phone, ShoppingBag } from "lucide-react";
import SEO from "@/components/SEO";
import {
  fetchProducts,
  money,
  parseSelectableOptions,
  variantsOf,
  type Product,
} from "@/lib/medhealth-catalogue";
import { BRAND_RULE, HOUSE, PARTNER } from "@/partners/medhealth";
import { PartnerLockup, SupplyMinistryLogo, MedHealthLogo } from "@/components/medhealth-catalogue/Brand";
import { CategoryIcon } from "@/components/medhealth-catalogue/ProductCard";
import { QtyStepper } from "@/components/medhealth-catalogue/QtyStepper";
import { ReviewSheet, type Line } from "@/components/medhealth-catalogue/ReviewSheet";
import { useMedHealthSelection } from "@/contexts/MedHealthSelectionContext";

const FONT = "Raleway, system-ui, sans-serif";
const CATALOGUE = "/partners/medhealth-capability-2026";

/**
 * Splits raw specification text into an optional intro paragraph and a list of
 * points, stripping the asterisk or dash markers used in the source data.
 */
function parseSpecification(text: string): { intro: string; points: string[] } {
  const raw = text
    .split(/\r?\n|(?=\s\*\s)|(?=^\*)/gm)
    .flatMap((line) => line.split(/(?=\*\s?[A-Z0-9])/g))
    .map((line) => line.trim())
    .filter(Boolean);

  const intro: string[] = [];
  const points: string[] = [];
  for (const line of raw) {
    if (/^[*\-•]\s*/.test(line)) points.push(line.replace(/^[*\-•]\s*/, "").trim());
    else if (points.length === 0) intro.push(line);
    else points.push(line);
  }
  return { intro: intro.join(" ").trim(), points: points.filter(Boolean) };
}

function ProductImage({ product, fallbackSrc }: { product: Product; fallbackSrc?: string | null }) {
  const [failed, setFailed] = useState(false);
  const src = product.image_url || fallbackSrc || null;
  const hasImage = src && !failed;
  return (
    <div
      className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border bg-white p-6"
      style={{ borderColor: PARTNER.rule, color: PARTNER.ink }}
    >
      {hasImage ? (
        <img
          src={src!}
          alt={product.product_name}
          onError={() => setFailed(true)}
          className="max-h-full max-w-full object-contain mix-blend-multiply"
        />
      ) : (
        <CategoryIcon
          category={product.clinical_group || product.category}
          className="h-24 w-24 opacity-40"
        />
      )}
    </div>
  );
}

const MedHealthProduct = () => {
  const { code = "" } = useParams();
  const [reviewing, setReviewing] = useState(false);
  const { selection, toggle, bumpQty, removeItem, clear } = useMedHealthSelection();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["microsite_products", "medhealth"],
    queryFn: fetchProducts,
  });

  const products = useMemo(() => data ?? [], [data]);
  const product = products.find((p) => p.product_code === code);
  const variants = useMemo(
    () => (product ? variantsOf(products, product) : []),
    [products, product],
  );
  const options = parseSelectableOptions(product?.selectable_options);

  const lines: Line[] = useMemo(
    () =>
      products
        .filter((p) => (selection[p.product_code] ?? 0) > 0)
        .map((p) => ({ product: p, qty: selection[p.product_code]! })),
    [products, selection],
  );
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + (l.product.price_rrp ?? 0) * l.qty, 0);

  const qty = product ? (selection[product.product_code] ?? 0) : 0;

  return (
    <div data-medhealth="" style={{ fontFamily: FONT }} className="min-h-screen bg-background text-[#231F20] antialiased">
      <SEO
        title={`${product?.product_name ?? "Product"} | Supply Ministry`}
        description="Private assistive technology ordering catalogue."
        noindex
      />

      <div className="h-1.5 w-full" style={{ backgroundImage: BRAND_RULE }} />

      <header
        className="sticky top-0 z-40"
        style={{ backgroundColor: HOUSE.cream, borderBottom: `1px solid ${PARTNER.rule}` }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to={CATALOGUE} aria-label="Back to catalogue">
            <PartnerLockup />
          </Link>
          <button
            type="button"
            onClick={() => itemCount > 0 && setReviewing(true)}
            disabled={itemCount === 0}
            className="flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-100"
            style={
              itemCount === 0
                ? { backgroundColor: "rgba(61,45,158,0.12)", color: HOUSE.violet }
                : { backgroundColor: HOUSE.violet, color: "#F4EFE6" }
            }
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>{itemCount}</span>
            <span className="opacity-80">{money(total)}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-5 sm:px-6">
        <Link
          to={CATALOGUE}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
          style={{ color: HOUSE.violet }}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to catalogue
        </Link>

        {isLoading ? (
          <div className="flex items-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading product…
          </div>
        ) : isError ? (
          <p role="alert" className="py-16 text-sm text-muted-foreground">
            We couldn't load this product just now. Please refresh to try again.
          </p>
        ) : !product ? (
          <p className="py-16 text-sm text-muted-foreground">
            We couldn't find that product. Head back to the catalogue to browse the full range.
          </p>
        ) : (
          <div className="mt-4 grid gap-6 md:grid-cols-2 md:gap-10">
            <ProductImage
              product={product}
              fallbackSrc={variants.find((v) => v.image_url)?.image_url ?? null}
            />

            <div className="flex flex-col">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "rgba(61,45,158,0.75)" }}
              >
                {product.clinical_group || product.category}
              </p>
              <h1
                className="mt-1.5 text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
                style={{ color: PARTNER.ink }}
              >
                {product.product_name}
              </h1>

              <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-2xl font-bold" style={{ color: "#010A16" }}>
                  {money(product.price_rrp)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Code: {product.product_code}
                </span>
              </div>

              {variants.length > 1 && (
                <div className="mt-5">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "#010A16" }}>
                    Choose an option
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {variants.map((v) => {
                      const active = v.product_code === product.product_code;
                      return (
                        <Link
                          key={v.product_code}
                          to={`${CATALOGUE}/product/${encodeURIComponent(v.product_code)}`}
                          aria-current={active ? "true" : undefined}
                          className="flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors"
                          style={
                            active
                              ? { borderColor: HOUSE.violet, backgroundColor: HOUSE.violet, color: "#F4EFE6" }
                              : { borderColor: PARTNER.rule, color: PARTNER.ink }
                          }
                        >
                          {v.variant_label || v.product_name}
                          <span className="text-xs opacity-75">{money(v.price_rrp)}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {options && (
                <div className="mt-5">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "#010A16" }}>
                    {options.label}
                  </h2>
                  <ul className="mt-2 max-w-[60ch] list-disc list-outside space-y-1.5 pl-5 text-sm" style={{ color: "rgba(1,10,22,0.75)" }}>
                    {options.values.map((v) => (
                      <li key={v} className="pl-1 leading-relaxed">
                        <span className="break-words hyphens-none text-pretty">{v}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Tell us which option you need when you send your request.
                  </p>
                </div>
              )}

              {product.key_specifications && (
                <div className="mt-5">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "#010A16" }}>
                    About this product
                  </h2>
                  {(() => {
                    const { intro, points } = parseSpecification(product.key_specifications);
                    return (
                      <div className="mt-2 max-w-[60ch] text-sm" style={{ color: "rgba(1,10,22,0.75)" }}>
                        {intro && (
                          <p className="break-words hyphens-none text-pretty leading-relaxed">{intro}</p>
                        )}
                        {points.length > 0 && (
                          <ul className={`list-disc list-outside space-y-1.5 pl-5 ${intro ? "mt-2.5" : ""}`}>
                            {points.map((point, i) => (
                              <li key={i} className="pl-1 leading-relaxed">
                                <span className="break-words hyphens-none text-pretty">{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggle(product.product_code)}
                  className="min-h-11 rounded-xl px-5 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={
                    qty > 0
                      ? { border: `1px solid ${HOUSE.violet}`, color: HOUSE.violet }
                      : { backgroundColor: HOUSE.violet, color: "#F4EFE6" }
                  }
                >
                  {qty > 0 ? "Remove from selection" : "Add to selection"}
                </button>
                {qty > 0 && (
                  <QtyStepper
                    qty={qty}
                    label={product.product_name}
                    onQty={(d) => bumpQty(product.product_code, d)}
                  />
                )}
                {itemCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setReviewing(true)}
                    className="min-h-11 rounded-xl border px-5 text-sm font-semibold transition-colors hover:bg-[rgba(61,45,158,0.08)]"
                    style={{ borderColor: HOUSE.violet, color: HOUSE.violet }}
                  >
                    Review and send
                  </button>
                )}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-2">
                <a
                  href="tel:0404593090"
                  className="flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors hover:bg-[rgba(61,45,158,0.08)]"
                  style={{ borderColor: HOUSE.violet, color: HOUSE.violet }}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" /> 0404 593 090
                </a>
                <a
                  href={`mailto:hello@supplyministry.com.au?subject=${encodeURIComponent(`Question about ${product.product_name} (${product.product_code})`)}`}
                  className="flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors hover:bg-[rgba(61,45,158,0.08)]"
                  style={{ borderColor: HOUSE.violet, color: HOUSE.violet }}
                >
                  <Mail className="h-4 w-4" aria-hidden="true" /> Ask about this product
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ backgroundColor: HOUSE.cream, borderTop: `1px solid ${PARTNER.rule}` }}>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <SupplyMinistryLogo compact />
            <span aria-hidden="true" className="h-6 w-px" style={{ backgroundColor: PARTNER.rule }} />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "rgba(1,10,22,0.55)" }}
            >
              {PARTNER.preparedFor}
            </span>
            <MedHealthLogo className="text-xl" />
          </div>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            {PARTNER.disclaimer}
          </p>
        </div>
      </footer>

      {reviewing && (
        <ReviewSheet
          lines={lines}
          total={total}
          onQty={bumpQty}
          onRemove={removeItem}
          onClose={() => setReviewing(false)}
          onComplete={() => {
            clear();
            setReviewing(false);
          }}
        />
      )}
    </div>
  );
};

export default MedHealthProduct;
