import { useState } from "react";
import { Bath, Shirt, MoveRight, Package, Check, Minus, Plus } from "lucide-react";
import { CATEGORIES, firstSentence, money, normaliseCategory, type Product } from "@/lib/medhealth-catalogue";

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

export function ProductThumb({ product, size = "md" }: { product: Product; size?: "sm" | "md" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl ${size === "sm" ? "h-11 w-11" : "h-20 w-20"}`}
      style={{ backgroundColor: "#F4EFE6", color: "#2A5263" }}
      aria-label={`${product.category} placeholder image`}
      role="img"
    >
      <CategoryIcon
        category={product.clinical_group || product.category}
        className={size === "sm" ? "h-5 w-5" : "h-8 w-8"}
      />
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
      className={`group relative flex cursor-pointer flex-col rounded-2xl border-2 bg-white p-4 text-left transition-all hover:shadow-md ${
        selected ? "shadow-md" : ""
      }`}
      style={{
        borderColor: selected ? "#3D2D9E" : "hsl(var(--border))",
      }}
    >
      <div className="flex items-start gap-4">
        <ProductThumb product={product} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {product.clinical_group}
          </p>
          <h3
            className="mt-1 text-base font-semibold leading-snug"
            style={{ color: "#231F20", fontFamily: "Outfit, system-ui, sans-serif" }}
          >
            {product.product_name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {firstSentence(product.key_specifications)}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
          style={{
            borderColor: selected ? "#3D2D9E" : "hsl(var(--border))",
            backgroundColor: selected ? "#3D2D9E" : "transparent",
            color: selected ? "#F4EFE6" : "transparent",
          }}
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p
            className="text-lg font-bold"
            style={{ color: "#2A5263", fontFamily: "Outfit, system-ui, sans-serif" }}
          >
            {money(product.price_rrp)}
          </p>
          <p className="text-xs text-muted-foreground">Code {product.product_code}</p>
        </div>

        {selected && (
          <div
            className="flex items-center gap-1 rounded-full border p-1"
            style={{ borderColor: "rgba(51,69,107,0.4)", backgroundColor: "rgba(51,69,107,0.1)" }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={`Decrease quantity of ${product.product_name}`}
              onClick={() => onQty(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white"
              style={{ color: "#33456B" }}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span
              aria-live="polite"
              className="min-w-6 text-center text-base font-semibold"
              style={{ color: "#231F20", fontFamily: "Outfit, system-ui, sans-serif" }}
            >
              {qty}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity of ${product.product_name}`}
              onClick={() => onQty(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white"
              style={{ color: "#33456B" }}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
