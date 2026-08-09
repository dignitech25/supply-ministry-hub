// Build-time sitemap generator. Runs on `predev` and `prebuild`, writing
// public/sitemap.xml so the file is a real static asset in the deployed bundle.
//
// Why not the _redirects proxy? Lovable's static hosting does not process
// Netlify-style `_redirects` rules, so `/sitemap.xml ... 200!` never applied on
// the custom domain and a stale six-URL response kept being served. Generating
// the same XML the `sitemap` edge function produces, at build time, removes the
// dependency on proxy support entirely.

import { writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { config as loadEnv } from "dotenv";
import {
  groupRepresentativeVariants,
  type CatalogueVariantRow,
} from "../supabase/functions/_shared/catalogueSelection";

loadEnv();

const SITE_URL = "https://www.supplyministry.com.au";
const PAGE_SIZE = 1000;
const OUT = resolve("public/sitemap.xml");

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/products", changefreq: "daily", priority: "0.9" },
  { path: "/quote", changefreq: "monthly", priority: "0.8" },
  { path: "/resources", changefreq: "weekly", priority: "0.7" },
  { path: "/sleep-choice", changefreq: "monthly", priority: "0.7" },
  { path: "/support-at-home", changefreq: "monthly", priority: "0.7" },
  { path: "/rent-to-buy", changefreq: "monthly", priority: "0.7" },
  { path: "/home-modifications", changefreq: "monthly", priority: "0.7" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function fetchCatalogue(): Promise<CatalogueVariantRow[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY");
  }

  const rows: CatalogueVariantRow[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const url =
      `${SUPABASE_URL}/rest/v1/products_categorized` +
      `?select=sku,brand,title,price_rrp,price_discounted` +
      `&title=not.is.null&brand=not.is.null&order=sku.asc`;

    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Range: `${offset}-${offset + PAGE_SIZE - 1}`,
        "Range-Unit": "items",
      },
    });

    if (!res.ok) {
      throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
    }

    const page = (await res.json()) as CatalogueVariantRow[];
    if (page.length === 0) break;
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }

  return rows;
}

async function main() {
  let productUrls: string[] = [];

  try {
    const rows = await fetchCatalogue();
    const families = groupRepresentativeVariants(rows);
    productUrls = families.map((family) =>
      urlEntry(`${SITE_URL}/products/${encodeURIComponent(family.sku)}`, "weekly", "0.7"),
    );
    console.log(`sitemap: ${families.length} product families from ${rows.length} variants`);
  } catch (err) {
    console.warn(`sitemap: catalogue fetch failed (${(err as Error).message})`);
    if (existsSync(OUT)) {
      console.warn("sitemap: keeping the existing public/sitemap.xml rather than shrinking it");
      return;
    }
    console.warn("sitemap: writing static pages only");
  }

  const staticUrls = STATIC_PAGES.map((page) =>
    urlEntry(`${SITE_URL}${page.path}`, page.changefreq, page.priority),
  );

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...staticUrls,
    ...productUrls,
    `</urlset>`,
  ].join("\n");

  writeFileSync(OUT, xml + "\n");
  console.log(`sitemap.xml written (${staticUrls.length + productUrls.length} entries)`);
}

main().catch((err) => {
  console.error("sitemap generation failed:", err);
  process.exitCode = 0; // never block the build
});
