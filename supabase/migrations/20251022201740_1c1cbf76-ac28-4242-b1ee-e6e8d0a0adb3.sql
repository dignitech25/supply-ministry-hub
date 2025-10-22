-- Add RLS policy to allow public read access to products_categorized
CREATE POLICY "Products are viewable by everyone"
ON public.products_categorized
FOR SELECT
USING (true);