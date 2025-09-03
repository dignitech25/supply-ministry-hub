-- Fix security definer view by recreating as a regular view
DROP VIEW IF EXISTS public.public_products;

CREATE VIEW public.public_products AS
SELECT 
  p.id,
  p.name,
  p.slug,
  p.description,
  p.supplier_sku,
  p.sm_sku,
  p.price_ex_gst,
  p.is_active,
  p.featured,
  p.created_at,
  p.updated_at,
  b.name as brand_name,
  b.slug as brand_slug,
  b.logo_url as brand_logo,
  c.name as category_name,
  c.slug as category_slug,
  c.image_url as category_image,
  (SELECT file_url FROM public.product_assets pa WHERE pa.product_id = p.id AND pa.asset_type = 'image' AND pa.is_primary = true LIMIT 1) as primary_image_url,
  (SELECT COUNT(*) FROM public.product_assets pa WHERE pa.product_id = p.id AND pa.asset_type = 'image')::integer as image_count,
  (SELECT COUNT(*) FROM public.product_assets pa WHERE pa.product_id = p.id AND pa.asset_type = 'pdf')::integer as pdf_count
FROM public.products p
LEFT JOIN public.brands b ON p.brand_id = b.id
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE p.is_active = true AND (b.is_active = true OR b.is_active IS NULL) AND (c.is_active = true OR c.is_active IS NULL);

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.generate_quote_ref_code()
RETURNS text 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  new_ref_code text;
  counter integer;
BEGIN
  -- Get current year
  SELECT EXTRACT(YEAR FROM NOW()) INTO counter;
  
  -- Generate ref code like SM-2024-001234
  SELECT 'SM-' || counter || '-' || LPAD((
    SELECT COALESCE(MAX(CAST(SUBSTRING(ref_code FROM '\d+$') AS integer)), 0) + 1
    FROM public.quotes 
    WHERE ref_code LIKE 'SM-' || counter || '-%'
  )::text, 6, '0') INTO new_ref_code;
  
  RETURN new_ref_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_quote_ref_code()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  IF NEW.ref_code IS NULL OR NEW.ref_code = '' THEN
    NEW.ref_code := public.generate_quote_ref_code();
  END IF;
  RETURN NEW;
END;
$$;