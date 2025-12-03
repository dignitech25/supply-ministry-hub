-- Ensure the view is using SECURITY INVOKER (the default)
-- Drop and recreate with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.products_public;

CREATE VIEW public.products_public 
WITH (security_invoker = true) AS
SELECT 
  pl.id,
  pl.sku,
  pl.name,
  pl.description,
  pl.brand,
  pl.category,
  pl.primary_image_url,
  pl.rrp_cents,
  pl.sales_price_cents,
  pl.tax_class,
  pl.featured,
  pl.trial_available,
  pl.show_on_site,
  pl.created_at,
  pl.updated_at,
  CASE 
    WHEN pl.tax_class = 'GST' THEN 0.10
    ELSE 0
  END AS gst_rate,
  CASE 
    WHEN pl.tax_class = 'GST' THEN ROUND(pl.sales_price_cents * 1.10)::integer
    ELSE pl.sales_price_cents
  END AS sales_price_inc_gst_cents
FROM public.products_legacy pl
WHERE pl.show_on_site = true;