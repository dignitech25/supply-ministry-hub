import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://www.supplyministry.com.au";
const TODAY = new Date().toISOString().split("T")[0];

// PostgREST caps a single response at 1,000 rows. The previous version of this
// function did not page, so it silently emitted only the first 1,000 products.
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

interface FamilyRow {
  representative_sku: string | null;
  updated_at: string | null;
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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Read product_families, not products.
    //
    // `products` holds 4,450 rows including ~1,103 the storefront cannot render,
    // and one URL per SKU published 3,347 near-duplicates for 513 real pages.
    // product_families is one row per displayed page and carries the same
    // representative_sku the product page emits as its canonical, so the sitemap
    // and the canonical tag cannot disagree.
    const families: FamilyRow[] = [];
    for (let offset = 0; ; offset += PAGE_SIZE) {
      const { data, error } = await supabase
        .from("product_families")
        .select("representative_sku, updated_at")
        .eq("is_active", true)
        .not("representative_sku", "is", null)
        .order("representative_sku", { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;
      if (!data || data.length === 0) break;

      families.push(...(data as FamilyRow[]));
      if (data.length < PAGE_SIZE) break;
    }

    const productUrls = families
      .filter((f) => f.representative_sku)
      .map((f) =>
        urlEntry(
          `${SITE_URL}/products/${encodeURIComponent(f.representative_sku!)}`,
          "weekly",
          "0.7",
          f.updated_at ? f.updated_at.split("T")[0] : TODAY,
        )
      );

    const staticUrls = STATIC_PAGES.map((p) =>
      urlEntry(p.loc, p.changefreq, p.priority, TODAY)
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join("\n")}
${productUrls.join("\n")}
</urlset>`;

    console.log(`Sitemap: ${staticUrls.length} static + ${productUrls.length} families`);

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
