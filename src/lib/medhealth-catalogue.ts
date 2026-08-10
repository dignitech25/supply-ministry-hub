import { supabase } from "@/integrations/supabase/client";

/**
 * MedHealth catalogue data layer.
 *
 * Reads from microsite_products (collection = 'medhealth', status = 'priced')
 * and submits selections to quote_requests.
 */

export interface Product {
  clinical_group: string;
  status: "priced" | "source_on_request";
  product_name: string;
  product_code: string;
  category: string;
  price_rrp: number | null;
  key_specifications: string | null;
  sort_order: number | null;
  image_url: string | null;
  family_slug: string | null;
  variant_label: string | null;
  selectable_options: string | null;
  supply_mode: string | null;
  price_hire_weekly: number | null;
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("microsite_products")
    .select(
      "clinical_group, status, product_name, product_code, category, price_rrp, key_specifications, sort_order, image_url, family_slug, variant_label, selectable_options, supply_mode, price_hire_weekly",
    )
    .eq("collection", "medhealth")
    .order("sort_order", { ascending: true })
    .returns<Product[]>();

  if (error) throw error;
  return (data ?? []).filter((p) => p.status === "priced");
}

export interface SourceItem {
  product_name: string;
  clinical_group: string;
}

/**
 * Items MedHealth can ask us to source. These are deliberately kept apart from
 * the priced catalogue: no codes, no prices, never selectable.
 */
export async function fetchSourceOnRequest(): Promise<SourceItem[]> {
  const { data, error } = await supabase
    .from("microsite_products")
    .select("product_name, clinical_group, status, sort_order")
    .eq("collection", "medhealth")
    .eq("status", "source_on_request")
    .order("sort_order", { ascending: true })
    .returns<Array<SourceItem & { status: string; sort_order: number | null }>>();

  if (error) throw error;
  return (data ?? []).map(({ product_name, clinical_group }) => ({
    product_name,
    clinical_group: clinical_group || "Other",
  }));
}

export const CATEGORIES = [
  "Bathing & showering",
  "Toileting",
  "Dressing & reaching",
  "Transfers & positioning",
  "Seating",
  "Bed & positioning",
  "Mobility & vehicle",
  "Kitchen & household",
] as const;

/** Loose match so slightly different spellings in the data still land. */
export function normaliseCategory(raw: string): string {
  const v = (raw ?? "").toLowerCase();
  if (!v) return raw;
  const exact = (CATEGORIES as readonly string[]).find((c) => c.toLowerCase() === v);
  if (exact) return exact;
  if (v.includes("toilet") || v.includes("continence")) return "Toileting";
  if (v.includes("bed") || v.includes("mattress") || v.includes("sleep")) return "Bed & positioning";
  if (v.includes("bath") || v.includes("shower")) return "Bathing & showering";
  if (v.includes("dress") || v.includes("reach")) return "Dressing & reaching";
  if (v.includes("seat") || v.includes("chair")) return "Seating";
  if (v.includes("kitchen") || v.includes("household") || v.includes("eating"))
    return "Kitchen & household";
  if (v.includes("mobil") || v.includes("vehicle") || v.includes("walk")) return "Mobility & vehicle";
  if (v.includes("transfer") || v.includes("position")) return "Transfers & positioning";
  return raw;
}

/** Tab grouping is derived from clinical_group, falling back to category. */
export function groupOf(p: Product): string {
  const byGroup = normaliseCategory(p.clinical_group ?? "");
  if ((CATEGORIES as readonly string[]).includes(byGroup)) return byGroup;
  return normaliseCategory(p.category ?? "");
}

/**
 * Short visual label for a clinical group. The full group name is kept for
 * screen readers and filter chips, this is only to stop card eyebrows wrapping.
 */
const SHORT_LABELS: Record<string, string> = {
  "Bathing & showering": "Bathing",
  "Toileting": "Toileting",
  "Dressing & reaching": "Dressing",
  "Transfers & positioning": "Transfers",
  "Seating": "Seating",
  "Bed & positioning": "Bed",
  "Mobility & vehicle": "Mobility",
  "Kitchen & household": "Kitchen",
};

export function shortGroupLabel(group: string): string {
  return SHORT_LABELS[normaliseCategory(group ?? "")] ?? group ?? "";
}

/** First sentence of the specification, used as the card description. */
export function firstSentence(text: string | null | undefined): string {
  if (!text) return "";
  const match = text.trim().match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : text.trim()).replace(/\s+/g, " ");
}

export const money = (n: number | null | undefined) =>
  n == null
    ? "POA"
    : new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(n);

/**
 * Variant families. Products sharing a family_slug are one product with
 * options (size, firmness, length), so the grid shows a single card and the
 * detail page lets the reader pick the variant.
 */
export interface Family {
  key: string;
  name: string;
  base: Product;
  variants: Product[];
  minPrice: number | null;
}

/** Trims a trailing variant label so the family reads as one product name. */
function familyName(base: Product): string {
  const label = base.variant_label?.trim();
  if (!label) return base.product_name;
  return base.product_name
    .replace(new RegExp(`[\\s\\u2013\\u2014-]*${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i"), "")
    .trim() || base.product_name;
}

export function buildFamilies(products: Product[]): Family[] {
  const out: Family[] = [];
  const index = new Map<string, Family>();

  for (const p of products) {
    const slug = p.family_slug?.trim();
    if (!slug) {
      out.push({ key: p.product_code, name: p.product_name, base: p, variants: [p], minPrice: p.price_rrp });
      continue;
    }
    const existing = index.get(slug);
    if (existing) {
      existing.variants.push(p);
      if (p.price_rrp != null && (existing.minPrice == null || p.price_rrp < existing.minPrice)) {
        existing.minPrice = p.price_rrp;
      }
      // Image inheritance: a family shows a photo if any variant has one.
      if (!existing.base.image_url && p.image_url) {
        existing.base = { ...existing.base, image_url: p.image_url };
      }
      continue;
    }
    const fam: Family = { key: slug, name: familyName(p), base: p, variants: [p], minPrice: p.price_rrp };
    index.set(slug, fam);
    out.push(fam);
  }

  return out;
}

/** All variants of the family a product belongs to, in catalogue order. */
export function variantsOf(products: Product[], product: Product): Product[] {
  const slug = product.family_slug?.trim();
  if (!slug) return [product];
  return products.filter((p) => p.family_slug?.trim() === slug);
}

/** "Frame Width: 18 in | 20 in" style strings, split for display. */
export function parseSelectableOptions(
  raw: string | null | undefined,
): { label: string; values: string[] } | null {
  if (!raw?.trim()) return null;
  const [head, ...rest] = raw.split(":");
  const hasLabel = rest.length > 0;
  const label = hasLabel ? head.trim() : "Options";
  const body = hasLabel ? rest.join(":") : raw;
  const values = body
    .split("|")
    .map((v) => v.trim())
    .filter(Boolean);
  return values.length ? { label, values } : null;
}

/**
 * Clinical kits are fixed, explicit compositions of real catalogue codes.
 * Every code below exists in microsite_products, no product or price is
 * invented, and no code appears in more than one kit, so two kits can never
 * end up with the same items or the same subtotal by accident.
 */
export interface KitRule {
  id: string;
  name: string;
  blurb: string;
  codes: readonly string[];
  /** Shown in the compact featured row. The rest live in the all-kits sheet. */
  featured?: boolean;
  /** Optional clinical note surfaced in the kit detail sheet. */
  note?: string;
}

export const KIT_RULES: KitRule[] = [
  {
    id: "lower-limb-recovery",
    name: "Lower-Limb Recovery Kit",
    blurb: "Everyday aids for dressing and managing reduced lower-limb movement or bending.",
    featured: true,
    codes: ["SMDL10318", "SMDL10204-81", "SMDL10339", "SMDL10921-16", "SMDLDRESSSTICK"],
  },
  {
    id: "vehicle-transfer",
    name: "Vehicle Transfer Kit",
    blurb: "Practical support for entering, repositioning within and exiting a vehicle.",
    featured: true,
    codes: ["SMDLCARHANDYBAR", "SMDL12135", "SMDL10318"],
  },
  {
    id: "shower-independence",
    name: "Shower Independence Kit",
    blurb: "Stability, slip reduction and extended reach for everyday showering.",
    featured: true,
    codes: ["SMBA10511CA", "SMBA12740", "SMDL10093"],
  },
  {
    id: "bed-mobility",
    name: "Bed Mobility & Positioning Kit",
    blurb: "Practical bedside aids for repositioning, leg support and getting into or out of bed.",
    featured: true,
    note: "Bed-stick suitability and compatibility should be confirmed for the individual bed and user.",
    codes: ["SMBRACBS", "SMBRIC182", "SMBRIC184", "SMDL10318"],
  },
  {
    id: "kitchen-grip-opening",
    name: "Kitchen Grip & Opening Kit",
    blurb: "Opening tools for reduced grip strength, dexterity or one-handed use.",
    codes: ["SMDLJAROPENERAUTO", "SMDLPREPWORKS6IN1", "SMDLCANOPENERRECHG"],
  },
  {
    id: "safe-meal-preparation",
    name: "Safe Meal Preparation Kit",
    blurb: "A coordinated setup for seated preparation, stabilising food and safer pouring.",
    codes: ["SMDLKITCHENWORKSTATION", "SMDLPTKD", "SMDLCHP213500"],
  },
  {
    id: "long-reach-grooming",
    name: "Long-Reach Grooming Kit",
    blurb: "Extended-reach personal-care tools for limited shoulder movement or reach.",
    codes: ["SMDL10093", "SMDLHAIRWASHER", "SMDL80210072-H-L"],
  },
];

export function buildKits(products: Product[]) {
  const byCode = new Map(products.map((p) => [p.product_code, p]));
  return KIT_RULES.map((rule) => {
    const items = rule.codes
      .map((c) => byCode.get(c))
      .filter((p): p is Product => Boolean(p));
    const subtotal = items.reduce((sum, p) => sum + (p.price_rrp ?? 0), 0);
    return { ...rule, items, subtotal };
  }).filter((k) => k.items.length >= 2);
}

/**
 * The IC333 bed package. Prices are never stored here, they are always read
 * from the live catalogue rows the codes resolve to.
 */
export const BED_PACKAGE = {
  id: "ic333-complete-bed",
  name: "IC333 Complete Bed Package",
  blurb: "Build a complete electric-bed setup with the appropriate mattress and bedside accessories.",
  note: "Mattress firmness, rails and transfer supports should be selected according to the user's needs and bed-safety assessment.",
  requiredCodes: ["SMBRIC333KS", "SMBRHB333KS", "SMBRFB333KS"] as const,
  mattressCodes: ["SMBRIHKSL2000SQC", "SMBRIHKSL2000MQC", "SMBRIHKSL2000FQC"] as const,
  accessoryCodes: ["SMBRACBS", "SMBRACHSR", "SMBRACLSR", "SMBRIC182", "SMBRIC184"] as const,
} as const;

export interface BedPackage {
  required: Product[];
  mattresses: Product[];
  accessories: Product[];
  /** Base plus the cheapest mattress, so the card can show a starting price. */
  startingPrice: number | null;
}

export function buildBedPackage(products: Product[]): BedPackage | null {
  const byCode = new Map(products.map((p) => [p.product_code, p]));
  const pick = (codes: readonly string[]) =>
    codes.map((c) => byCode.get(c)).filter((p): p is Product => Boolean(p));

  const required = pick(BED_PACKAGE.requiredCodes);
  const mattresses = pick(BED_PACKAGE.mattressCodes);
  if (required.length === 0 || mattresses.length === 0) return null;

  const base = required.reduce((s, p) => s + (p.price_rrp ?? 0), 0);
  const cheapest = mattresses.reduce<number | null>(
    (min, p) => (p.price_rrp != null && (min == null || p.price_rrp < min) ? p.price_rrp : min),
    null,
  );

  return {
    required,
    mattresses,
    accessories: pick(BED_PACKAGE.accessoryCodes),
    startingPrice: cheapest == null ? null : base + cheapest,
  };
}

export function toCsv(rows: Array<Record<string, string | number>>, headers: string[]) {
  const esc = (v: string | number) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [
    headers.map(esc).join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h] ?? "")).join(",")),
  ].join("\r\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function makeReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return `SM-${out}`;
}
