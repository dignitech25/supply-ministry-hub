CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM public, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM public, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Repoint all policies to the private helper
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view quotes" ON public.quotes;
CREATE POLICY "Admins can view quotes" ON public.quotes
FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view quote items" ON public.quote_items;
CREATE POLICY "Admins can view quote items" ON public.quote_items
FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Staff can upload product images" ON storage.objects;
CREATE POLICY "Staff can upload product images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'staff'))
);

DROP POLICY IF EXISTS "Staff can update product images" ON storage.objects;
CREATE POLICY "Staff can update product images" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'product-images'
  AND (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'staff'))
)
WITH CHECK (
  bucket_id = 'product-images'
  AND (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'staff'))
);

DROP POLICY IF EXISTS "Staff can delete product images" ON storage.objects;
CREATE POLICY "Staff can delete product images" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'product-images'
  AND (private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'staff'))
);

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);