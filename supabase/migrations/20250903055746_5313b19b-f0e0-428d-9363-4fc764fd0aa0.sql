-- Create brands table
CREATE TABLE public.brands (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  logo_url text,
  description text,
  website_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for brands
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands are viewable by everyone" ON public.brands FOR SELECT USING (true);

-- Create categories table
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  parent_id uuid REFERENCES public.categories(id),
  sort_order integer DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Create products table
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  brand_id uuid REFERENCES public.brands(id),
  category_id uuid REFERENCES public.categories(id),
  supplier_sku text,
  sm_sku text,
  price_ex_gst numeric(10,2),
  is_active boolean NOT NULL DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- Create product_assets table
CREATE TABLE public.product_assets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  asset_type text NOT NULL CHECK (asset_type IN ('image', 'pdf', 'video')),
  file_url text NOT NULL,
  file_name text,
  file_size integer,
  sort_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for product_assets
ALTER TABLE public.product_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product assets are viewable by everyone" ON public.product_assets FOR SELECT USING (true);

-- Create product_attributes table
CREATE TABLE public.product_attributes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  attribute_name text NOT NULL,
  attribute_value text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for product_attributes
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product attributes are viewable by everyone" ON public.product_attributes FOR SELECT USING (true);

-- Create quotes table (separate from quote_requests)
CREATE TABLE public.quotes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ref_code text UNIQUE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  ot_name text NOT NULL,
  ot_email text NOT NULL,
  ot_phone text NOT NULL,
  organization text,
  funding_type text,
  delivery_postcode text,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  total_items integer DEFAULT 0
);

-- Enable RLS for quotes
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous quote submissions" ON public.quotes FOR INSERT WITH CHECK (true);

-- Create quote_items table
CREATE TABLE public.quote_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id uuid REFERENCES public.quotes(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  quantity integer NOT NULL DEFAULT 1,
  line_notes text,
  unit_price numeric(10,2),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for quote_items
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous quote item submissions" ON public.quote_items FOR INSERT WITH CHECK (true);

-- Create public_products view
CREATE OR REPLACE VIEW public.public_products AS
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

-- Create function to generate quote reference codes
CREATE OR REPLACE FUNCTION public.generate_quote_ref_code()
RETURNS text AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate ref_code for quotes
CREATE OR REPLACE FUNCTION public.set_quote_ref_code()
RETURNS trigger AS $$
BEGIN
  IF NEW.ref_code IS NULL OR NEW.ref_code = '' THEN
    NEW.ref_code := public.generate_quote_ref_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_quote_ref_code
  BEFORE INSERT ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_quote_ref_code();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.brands (name, slug, description) VALUES
('Invacare', 'invacare', 'Leading provider of home and long-term care medical products'),
('Drive Medical', 'drive-medical', 'Innovative medical equipment and mobility solutions'),
('Sunrise Medical', 'sunrise-medical', 'Mobility and accessibility solutions');

INSERT INTO public.categories (name, slug, description) VALUES
('Wheelchairs', 'wheelchairs', 'Manual and electric wheelchairs'),
('Mobility Scooters', 'mobility-scooters', 'Indoor and outdoor mobility scooters'),
('Walking Aids', 'walking-aids', 'Walkers, rollators, and walking frames'),
('Bathroom Safety', 'bathroom-safety', 'Shower chairs, commodes, and bathroom aids'),
('Bed & Bedroom', 'bed-bedroom', 'Hospital beds, mattresses, and bedroom accessories');

-- Insert sample products
INSERT INTO public.products (name, slug, brand_id, category_id, supplier_sku, sm_sku, price_ex_gst) 
SELECT 
  'Standard Manual Wheelchair', 
  'standard-manual-wheelchair',
  b.id,
  c.id,
  'INV-WC-001',
  'SM-WC-001',
  299.00
FROM public.brands b, public.categories c 
WHERE b.slug = 'invacare' AND c.slug = 'wheelchairs'
LIMIT 1;

INSERT INTO public.products (name, slug, brand_id, category_id, supplier_sku, sm_sku, price_ex_gst) 
SELECT 
  'Compact Mobility Scooter', 
  'compact-mobility-scooter',
  b.id,
  c.id,
  'DRV-MS-002',
  'SM-MS-002',
  1299.00
FROM public.brands b, public.categories c 
WHERE b.slug = 'drive-medical' AND c.slug = 'mobility-scooters'
LIMIT 1;