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
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("microsite_products")
    .select(
      "clinical_group, status, product_name, product_code, category, price_rrp, key_specifications, sort_order, image_url",
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
  "Dressing & reaching",
  "Transfers & positioning",
] as const;

/** Loose match so slightly different spellings in the data still land. */
export function normaliseCategory(raw: string): string {
  const v = (raw ?? "").toLowerCase();
  if (v.includes("bath") || v.includes("shower") || v.includes("toilet")) return CATEGORIES[0];
  if (v.includes("dress") || v.includes("reach")) return CATEGORIES[1];
  if (v.includes("transfer") || v.includes("position") || v.includes("mobil"))
    return CATEGORIES[2];
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
  "Dressing & reaching": "Dressing",
  "Transfers & positioning": "Transfers",
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
}

export const KIT_RULES: KitRule[] = [
  {
    id: "bathroom-safety",
    name: "Bathroom safety starter",
    blurb: "Non-slip surfaces and a seat for a first bathroom review.",
    codes: ["SMBA12740", "SMBA12739", "SMBA10511CA"],
  },
  {
    id: "over-bath",
    name: "Over-bath transfer",
    blurb: "Board, bench and leg support for an over-bath transfer plan.",
    codes: ["SMBABE68801", "SMBABE98309", "SMDL10318"],
  },
  {
    id: "bariatric",
    name: "Bariatric bathroom",
    blurb: "Higher safe-working-load seating and bench.",
    codes: ["SMBABE688024HD", "SMBABE98310B"],
  },
  {
    id: "lower-limb-dressing",
    name: "Lower-limb dressing",
    blurb: "Sock aid, reacher, shoe horn and long-handled sponge.",
    codes: ["SMDL10339", "SMDL1024/81", "SMDL10921/16", "SMDL10093"],
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
