import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bath, Shirt, MoveRight, Utensils, BedDouble, Package, Check } from "lucide-react";
import {
  CATEGORIES,
  firstSentence,
  groupOf,
  money,
  normaliseCategory,
  shortGroupLabel,
  specificationFor,
  type Product,
} from "@/lib/medhealth-catalogue";
import { HOUSE, PARTNER } from "@/partners/medhealth";
import { QtyStepper } from "./QtyStepper";

/** Detail page URL for a catalogue product. */
export const productHref = (code: string) =>
  `/partners/medhealth-capability-2026/product/${encodeURIComponent(code)}`;

export function CategoryIcon({
  category,
  className = "h-8 w-8",
}: {
  category: string;
  className?: string;
}) {
  const c = normaliseCategory(category);
  const Icon =
    c === CATEGORIES[0]
      ? Bath
      : c === CATEGORIES[1]
        ? Shirt
        : c === CATEGORIES[2]
          ? MoveRight
          : c === CATEGORIES[3]
            ? Utensils
            : c === CATEGORIES[4]
              ? BedDouble
              : Package;
  return <Icon className={className} strokeWidth={1.5} aria-hidden="true" />;
}

export function ProductThumb({
  product,
  size = "md",
}: {
  product: Product;
  size?: "sm" | "md" | "fill";
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = product.image_url && !imgError;

  const box =
    size === "fill"
      ? "h-full w-full"
      : size === "sm"
        ? "h-12 w-12 shrink-0"
        : "h-20 w-20 shrink-0";

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-xl border p-1.5 ${box}`}
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: PARTNER.rule,
        color: PARTNER.ink,
      }}
      aria-label={hasImage ? product.product_name : `${product.category} placeholder image`}
      role="img"
    >
      {hasImage ? (
        <img
          src={product.image_url!}
          alt={product.product_name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="max-h-full max-w-full object-contain mix-blend-multiply"
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <CategoryIcon
          category={product.clinical_group || product.category}
          className={size === "sm" ? "h-5 w-5" : "h-8 w-8"}
        />
      )}
    </div>
  );
}

interface Props {
  product: Product;
  qty: number;
  onToggle: () => void;
  onQty: (delta: number) => void;
  /** More than one entry means this card stands for a family of options. */
  variantCount?: number;
  /** Lowest price across the family, used for the "From" price. */
  minPrice?: number | null;
  /** Family display name, used when variants are collapsed into one card. */
  displayName?: string;
}

export function ProductCard({
  product,
  qty,
  onToggle,
  onQty,
  variantCount = 1,
  minPrice,
  displayName,
}: Props) {
  const selected = qty > 0;
  const navigate = useNavigate();
  const hasOptions = variantCount > 1;
  const title = displayName ?? product.product_name;
  const price = hasOptions ? (minPrice ?? product.price_rrp) : product.price_rrp;
  const displayGroup = groupOf(product);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View ${title}`}
      onClick={() => navigate(productHref(product.product_code))}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(productHref(product.product_code));
        }
      }}
      className={`group relative flex cursor-pointer flex-col rounded-xl border-2 bg-white p-3 text-left transition-all hover:shadow-md ${
        selected ? "shadow-md" : ""
      }`}
      style={{
        borderColor: selected ? HOUSE.violet : "hsl(var(--border))",
      }}
    >
      <div className="flex items-start gap-3">
        <ProductThumb product={product} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            <span className="sr-only">{displayGroup}</span>
            <span aria-hidden="true">{shortGroupLabel(displayGroup)}</span>
          </p>
          <h3
            className="mt-0.5 line-clamp-2 h-[2.6rem] text-sm font-semibold leading-snug"
            title={title}
            style={{ color: "#231F20" }}
          >
            {title}
          </h3>
          <p className="mt-0.5 line-clamp-2 h-[2rem] text-xs leading-4 text-muted-foreground">
            {hasOptions
              ? `${variantCount} options available`
              : firstSentence(specificationFor(product))}
          </p>
        </div>
        {!hasOptions && (
        <button
          type="button"
          aria-pressed={selected}
          aria-label={selected ? `Remove ${product.product_name} from selection` : `Add ${product.product_name} to selection`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="mh-tap flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
          style={{
            borderColor: selected ? HOUSE.violet : "hsl(var(--border))",
            backgroundColor: selected ? HOUSE.violet : "transparent",
            color: selected ? "#F4EFE6" : "transparent",
          }}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
        </button>
        )}
      </div>

      <div className="mt-auto flex h-12 items-center justify-between gap-2 pt-3">
        <div className="min-w-0">
          <p className="text-base font-bold leading-tight" style={{ color: "#010A16" }}>
            {hasOptions ? `From ${money(price)}` : money(price)}
          </p>
          <Link
            to={productHref(product.product_code)}
            onClick={(e) => e.stopPropagation()}
            className="mh-tap inline-flex min-h-[1.25rem] items-center truncate whitespace-nowrap text-[10px] font-semibold leading-tight underline underline-offset-2"
            style={{ color: HOUSE.violet }}
          >
            {hasOptions ? "Choose an option" : "View details"}
          </Link>
        </div>

        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          {selected && !hasOptions && (
            <QtyStepper qty={qty} label={product.product_name} onQty={onQty} size="sm" />
          )}
          {hasOptions && selected && (
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ backgroundColor: "rgba(61,45,158,0.12)", color: HOUSE.violet }}
            >
              {qty} selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
