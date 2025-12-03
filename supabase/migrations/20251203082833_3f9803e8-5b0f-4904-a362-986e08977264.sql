-- Enable RLS on product_catalogue_list table and add public read policy
ALTER TABLE public.product_catalogue_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for product catalogue"
  ON public.product_catalogue_list
  FOR SELECT
  USING (true);

-- Fix make_quote_number function to have immutable search_path
CREATE OR REPLACE FUNCTION public.make_quote_number()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
declare
  y text := to_char(timezone('Australia/Melbourne', now()), 'YY');
  n bigint;
begin
  select nextval('quote_seq') into n;
  return 'Q' || y || '_' || lpad(n::text, 6, '0');
end;
$function$;

-- Recreate products_public view without SECURITY DEFINER
-- First drop the existing view
DROP VIEW IF EXISTS public.products_public;

-- Recreate as a regular view (SECURITY INVOKER is the default)
CREATE VIEW public.products_public AS
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