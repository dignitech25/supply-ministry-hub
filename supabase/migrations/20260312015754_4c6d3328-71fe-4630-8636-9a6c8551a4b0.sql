
-- ===========================================
-- 1. Explicit deny-all on backup/staging/legacy tables
-- ===========================================

-- _stg_products_website: deny all access
CREATE POLICY "Deny all access to staging table"
  ON public._stg_products_website
  FOR ALL
  TO public
  USING (false);

-- products_backup_20251022: deny all access
CREATE POLICY "Deny all access to backup table"
  ON public.products_backup_20251022
  FOR ALL
  TO public
  USING (false);

-- products_legacy: deny all access
CREATE POLICY "Deny all access to legacy table"
  ON public.products_legacy
  FOR ALL
  TO public
  USING (false);

-- rate_limits: deny all access via API
CREATE POLICY "Deny all access to rate_limits"
  ON public.rate_limits
  FOR ALL
  TO public
  USING (false);

-- ===========================================
-- 2. Fix overly permissive INSERT policies on quotes
--    Remove the wide-open public role policy, keep anon-only
-- ===========================================

DROP POLICY IF EXISTS "Allow anonymous quote submissions" ON public.quotes;
DROP POLICY IF EXISTS "Allow anonymous quote item submissions" ON public.quote_items;

-- ===========================================
-- 3. Fix overly permissive INSERT policies on quote_requests
--    The anon INSERT policy with WITH CHECK (true) is acceptable
--    for a public quote form, but tighten quote_items to only
--    allow inserts linked to existing quotes
-- ===========================================

-- Drop and recreate quote_items anon insert with a check
DROP POLICY IF EXISTS "insert_quote_items_anon" ON public.quote_items;

CREATE POLICY "insert_quote_items_anon"
  ON public.quote_items
  FOR INSERT
  TO anon
  WITH CHECK (
    quote_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.quotes q WHERE q.id = quote_id
    )
  );
