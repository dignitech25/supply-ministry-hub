-- 1) Owner/admin-scoped reads for quotes and quote_items
CREATE POLICY "Admins can view quotes"
ON public.quotes FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view quote items"
ON public.quote_items FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.quotes TO authenticated;
GRANT SELECT ON public.quote_items TO authenticated;

-- 2) Validate anonymous quote_requests inserts
DROP POLICY IF EXISTS "Allow anonymous quote request submissions" ON public.quote_requests;

CREATE POLICY "Allow validated anonymous quote request submissions"
ON public.quote_requests FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(first_name) BETWEEN 1 AND 100
  AND char_length(last_name) BETWEEN 1 AND 100
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(email) <= 255
  AND char_length(phone) BETWEEN 5 AND 30
  AND char_length(coalesce(organization, '')) <= 200
  AND char_length(category) BETWEEN 1 AND 100
  AND char_length(requirements) BETWEEN 1 AND 5000
  AND char_length(timeline) BETWEEN 1 AND 100
  AND char_length(coalesce(source_url, '')) <= 500
  AND char_length(coalesce(user_agent, '')) <= 500
  AND status = 'new'
);

-- 3) Storage policies for product-images bucket
CREATE POLICY "Product images are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Staff can upload product images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
);

CREATE POLICY "Staff can update product images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'product-images'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
)
WITH CHECK (
  bucket_id = 'product-images'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
);

CREATE POLICY "Staff can delete product images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'product-images'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
);

-- 4) Revoke direct client EXECUTE on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.create_quote_with_items(jsonb) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.generate_quote_ref_code() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_quote_ref_code() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.create_quote_with_items(jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_quote_ref_code() TO service_role;
GRANT EXECUTE ON FUNCTION public.set_quote_ref_code() TO service_role;

-- has_role must stay callable by signed-in users (used for admin checks), but not anonymously
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;