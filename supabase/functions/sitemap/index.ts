import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://www.supplyministry.com.au";
const TODAY = new Date().toISOString().split("T")[0];

// PostgREST caps a single response at 1,000 rows. The catalogue is larger than
// that, so every read here must page explicitly -- an unpaged select silently
// truncated the sitemap to the first 1,000 rows.
const PAGE_SIZE = 1000;

const STATIC_PAGES = [
  { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
  { loc: `${SITE_URL}/products`, changefreq: "daily", priority: "0.9" },
  { loc: `${SITE_URL}/quote`, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/resources`, changefreq: "weekly", priority: "0.7" },
  { loc: `${SITE_URL}/sleep-choice`, changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/support-at-home`, changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/rent-to-buy`, changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/home-modifications`, changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/terms`, changefreq: "yearly", priority: "0.3" },
];

interface VariantRow {
  sku: string;
  brand: string | null;
  title: string | null;
  price_rrp: number | null;
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc: string, changefreq: string, priority: string, lastmod: string): string {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read products_categorized, NOT products.
    //
    // `products` holds 4,450 rows; `products_categorized` holds the 3,347 the
    // catalogue can actually render. Sitemapping `products` advertised ~1,103
    // URLs the site cannot display, and because the SPA returns HTTP 200 for
    // unknown routes, each one was a soft 404 rather than an honest error.
    const rows: VariantRow[] = [];
    for (let offset = 0; ; offset += PAGE_SIZE) {
      const { data, error } = await supabase
        .from("products_categorized")
        .select("sku, brand, title, price_rrp")
        .not("title", "is", null)
        .not("brand", "is", null)
        .order("sku", { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;
      if (!data || data.length === 0) break;

      rows.push(...(data as VariantRow[]));
      if (data.length < PAGE_SIZE) break;
    }

    // Collapse variants to one entry per product family.
    //
    // Previously this emitted one URL per SKU. Every variant of a family renders
    // the same page, so that published 3,347 near-duplicate URLs for 513 real
    // pages and split ranking signals across them. One canonical URL per family
    // is emitted instead, matching the canonical tag on the page itself.
    const families = new Map<string, VariantRow>();
    for (const row of rows) {
      const key = `${row.brand}|${row.title}`;
      const incumbent = families.get(key);
      if (!incumbent) {
        families.set(key, row);
        continue;
      }
      // Deterministic representative: cheapest, ties broken by SKU. Must match
      // the canonical chosen on the product page.
      const a = row.price_rrp ?? Number.POSITIVE_INFINITY;
      const b = incumbent.price_rrp ?? Number.POSITIVE_INFINITY;
      if (a < b || (a === b && row.sku < incumbent.sku)) {
        families.set(key, row);
      }
    }

    const productUrls = [...families.values()].map((family) =>
      urlEntry(
        `${SITE_URL}/products/${encodeURIComponent(family.sku)}`,
        "weekly",
        "0.7",
        TODAY,
      )
    );

    const staticUrls = STATIC_PAGES.map((page) =>
      urlEntry(page.loc, page.changefreq, page.priority, TODAY)
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join("\n")}
${productUrls.join("\n")}
</urlset>`;

    console.log(
      `Sitemap: ${staticUrls.length} static + ${productUrls.length} families (from ${rows.length} variants)`,
    );

    return new Response(xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Sitemap generation error:", err);
    return new Response("Error generating sitemap", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
