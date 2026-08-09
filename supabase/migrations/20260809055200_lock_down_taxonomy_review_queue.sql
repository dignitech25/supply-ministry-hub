-- =============================================================================
-- Lock down taxonomy_review_queue -- APPLIED to production 2026-08-09
--
-- taxonomy_review_queue is a plain single-table view over product_families
-- (select ... from product_families where ... order by ...), which Postgres
-- treats as auto-updatable. Supabase's default-privileges grant handed anon
-- and authenticated INSERT/UPDATE/DELETE/TRUNCATE on it, meaning any caller
-- with the public anon key could PATCH or DELETE through
-- /rest/v1/taxonomy_review_queue straight into product_families, bypassing
-- rebuild_product_families() and every identity/pricing safeguard it enforces.
-- This is an internal ops queue ("work this by hand") with no legitimate
-- anon/authenticated consumer at all.
-- =============================================================================

revoke all on public.taxonomy_review_queue from public, anon, authenticated;

-- Belt and suspenders: make the view run with the querying role's own
-- privileges (and therefore RLS) rather than the creator's, per the
-- Supabase/Postgres SECURITY DEFINER view advisory.
alter view public.taxonomy_review_queue set (security_invoker = true);

-- =============================================================================
-- ROLLBACK
--   alter view public.taxonomy_review_queue reset (security_invoker);
--   grant select on public.taxonomy_review_queue to anon, authenticated;
-- =============================================================================
