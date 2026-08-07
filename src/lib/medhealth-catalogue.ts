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
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("microsite_products")
    .select(
      "clinical_group, status, product_name, product_code, category, price_rrp, key_specifications, sort_order",
    )
    .eq("collection", "medhealth")
    .order("sort_order", { ascending: true })
    .returns<Product[]>();

  if (error) throw error;
  return (data ?? []).filter((p) => p.status === "priced");
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
 * Clinical kits are derived from the real rows returned by Supabase, no
 * invented products or prices. A kit that matches nothing is not rendered.
 */
export interface KitRule {
  id: string;
  name: string;
  blurb: string;
  match: (p: Product) => boolean;
  limit: number;
}

const has = (p: Product, ...words: string[]) => {
  const hay = `${p.product_name} ${p.key_specifications ?? ""} ${p.clinical_group}`.toLowerCase();
  return words.some((w) => hay.includes(w));
};

export const KIT_RULES: KitRule[] = [
  {
    id: "bathroom-safety",
    name: "Bathroom safety starter",
    blurb: "Core grab, seat and step items for a first bathroom review.",
    match: (p) =>
      groupOf(p) === CATEGORIES[0] &&
      has(p, "rail", "grab", "stool", "seat", "mat", "step"),
    limit: 4,
  },
  {
    id: "over-bath",
    name: "Over-bath transfer",
    blurb: "Board, rail and support set for an over-bath transfer plan.",
    match: (p) => has(p, "bath board", "bath", "board", "swivel", "transfer"),
    limit: 4,
  },
  {
    id: "bariatric",
    name: "Bariatric bathroom",
    blurb: "Higher safe-working-load bathroom items.",
    match: (p) => has(p, "bariatric", "heavy duty", "wide", "xl"),
    limit: 4,
  },
  {
    id: "lower-limb-dressing",
    name: "Lower-limb dressing",
    blurb: "Reachers, sock aids and long-handled dressing tools.",
    match: (p) =>
      groupOf(p) === CATEGORIES[1] &&
      has(p, "sock", "reacher", "shoe horn", "dressing", "stocking", "long handle"),
    limit: 4,
  },
];

export function buildKits(products: Product[]) {
  return KIT_RULES.map((rule) => {
    const items = products.filter(rule.match).slice(0, rule.limit);
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
