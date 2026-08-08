import { useState } from "react";
import { Bath, Shirt, MoveRight, Package, Check } from "lucide-react";
import {
  CATEGORIES,
  firstSentence,
  money,
  normaliseCategory,
  shortGroupLabel,
  type Product,
} from "@/lib/medhealth-catalogue";
import { HOUSE, PARTNER } from "@/partners/medhealth";
import { QtyStepper } from "./QtyStepper";

export function CategoryIcon({
  category,
  className = "h-8 w-8",
}: {
  category: string;
  className?: string;
}) {
  const c = normaliseCategory(category);
  const Icon = c === CATEGORIES[0] ? Bath : c === CATEGORIES[1] ? Shirt : c === CATEGORIES[2] ? MoveRight : Package;
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
      ? "aspect-square w-full"
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
}

export function ProductCard({ product, qty, onToggle, onQty }: Props) {
  const selected = qty > 0;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
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
            <span className="sr-only">{product.clinical_group}</span>
            <span aria-hidden="true">{shortGroupLabel(product.clinical_group)}</span>
          </p>
          <h3
            className="mt-0.5 line-clamp-2 h-[2.6rem] text-sm font-semibold leading-snug"
            title={product.product_name}
            style={{ color: "#231F20" }}
          >
            {product.product_name}
          </h3>
          <p className="mt-0.5 line-clamp-2 h-[2rem] text-xs leading-4 text-muted-foreground">
            {firstSentence(product.key_specifications)}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
          style={{
            borderColor: selected ? HOUSE.violet : "hsl(var(--border))",
            backgroundColor: selected ? HOUSE.violet : "transparent",
            color: selected ? "#F4EFE6" : "transparent",
          }}
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      </div>

      <div className="mt-auto flex h-12 items-center justify-between gap-2 pt-3">
        <div className="min-w-0">
          <p className="text-base font-bold leading-tight" style={{ color: "#010A16" }}>
            {money(product.price_rrp)}
          </p>
          <p className="truncate whitespace-nowrap text-[10px] leading-tight text-muted-foreground">
            Code {product.product_code}
          </p>
        </div>

        <div className="shrink-0">
          {selected && (
            <QtyStepper qty={qty} label={product.product_name} onQty={onQty} size="sm" />
          )}
        </div>
      </div>
    </div>
  );
}
