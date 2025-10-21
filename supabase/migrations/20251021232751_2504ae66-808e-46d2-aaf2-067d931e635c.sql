-- Enable Row Level Security on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Add unique constraint on SKU
ALTER TABLE public.products 
ADD CONSTRAINT products_sku_unique UNIQUE (sku);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_product_type ON public.products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_subtype ON public.products(subtype);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_specifications ON public.products USING GIN(specifications);

-- Create text search index for search functionality
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products 
USING GIN(to_tsvector('english', 
  COALESCE(title, '') || ' ' || 
  COALESCE(description, '') || ' ' || 
  COALESCE(clinical_use_case, '')
));