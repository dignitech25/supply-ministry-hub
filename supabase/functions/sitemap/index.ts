import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://www.supplyministry.com.au";
const TODAY = new Date().toISOString().split("T")[0];

const STATIC_PAGES = [
  { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0", lastmod: TODAY },
  { loc: `${SITE_URL}/products`, changefreq: "daily", priority: "0.9", lastmod: TODAY },
  { loc: `${SITE_URL}/quote`, changefreq: "monthly", priority: "0.8", lastmod: TODAY },
  { loc: `${SITE_URL}/resources`, changefreq: "weekly", priority: "0.7", lastmod: TODAY },
  { loc: `${SITE_URL}/sleep-choice`, changefreq: "monthly", priority: "0.7", lastmod: TODAY },
  { loc: `${SITE_URL}/terms`, changefreq: "yearly", priority: "0.3", lastmod: TODAY },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all product SKUs that have a title (active products)
    const { data: products, error } = await supabase
      .from("products")
      .select("sku, created_at")
      .not("title", "is", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }

    // Build product URL entries
    const productUrls = (products ?? []).map((p) => {
      const lastmod = p.created_at ? p.created_at.split("T")[0] : TODAY;
      const sku = encodeURIComponent(p.sku);
      return `  <url>
    <loc>${SITE_URL}/products/${sku}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    // Build static page entries
    const staticUrls = STATIC_PAGES.map(
      (p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join("\n")}
${productUrls.join("\n")}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // cache 1 hour
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
