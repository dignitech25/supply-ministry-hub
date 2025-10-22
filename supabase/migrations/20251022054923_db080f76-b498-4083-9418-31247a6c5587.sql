-- Enable RLS on product_catagorized table
ALTER TABLE public.product_catagorized ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for public read access
CREATE POLICY "Products are viewable by everyone"
ON public.product_catagorized
FOR SELECT
USING (true);

-- Normalize handles: Remove trailing digits like -1, -2, -3 from handles
-- This groups variants (e.g., "advantiflex-classic-mattress-cover-1" becomes "advantiflex-classic-mattress-cover")
UPDATE public.product_catagorized
SET handle = REGEXP_REPLACE(handle, '-\d+$', '')
WHERE handle ~ '-\d+$';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_catagorized_handle 
ON public.product_catagorized(handle);

CREATE INDEX IF NOT EXISTS idx_product_catagorized_category 
ON public.product_catagorized(top_level_category, subcategory);

CREATE INDEX IF NOT EXISTS idx_product_catagorized_brand 
ON public.product_catagorized(brand);

-- Add GIN index for full-text search on title, brand, and description
CREATE INDEX IF NOT EXISTS idx_product_catagorized_search 
ON public.product_catagorized 
USING gin(to_tsvector('english', 
  COALESCE(title, '') || ' ' || 
  COALESCE(brand, '') || ' ' || 
  COALESCE(description_long, '') || ' ' || 
  COALESCE(description_short, '')
));