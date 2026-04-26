# Harden `rate_limits` RLS Policy

## Problem
The `rate_limits` table currently has a single PERMISSIVE policy with `USING (false)`:

```
Policy Name: Deny all access to rate_limits
Command: ALL
Permissive: Yes
Using Expression: false
```

A `PERMISSIVE` policy with `USING (false)` does not reliably deny access — permissive policies are OR-combined, so any future permissive policy added to this table could grant access. The correct pattern is a `RESTRICTIVE` deny policy (RESTRICTIVE policies are AND-combined and cannot be overridden).

The table is only ever written to by edge functions (`submit-quote-request`, `submit-quote-with-email`) using the service role key, which bypasses RLS entirely. So no client (anon/authenticated) ever needs access.

## Fix (single migration)

Drop the existing permissive deny policy and replace it with a RESTRICTIVE deny-all policy that applies to both `anon` and `authenticated` roles:

```sql
-- Remove the weak PERMISSIVE deny policy
DROP POLICY IF EXISTS "Deny all access to rate_limits" ON public.rate_limits;

-- Ensure RLS stays enabled
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- RESTRICTIVE deny-all: cannot be overridden by any future PERMISSIVE policy
CREATE POLICY "Restrict all client access to rate_limits"
ON public.rate_limits
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);
```

## Why this is safe
- Edge functions use `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS — rate-limit reads/writes in `submit-quote-request/index.ts` and `submit-quote-with-email/index.ts` continue to work unchanged.
- No frontend code reads or writes `rate_limits` (verified by the codebase structure — only the two edge functions reference the table).
- RESTRICTIVE policies are AND-combined with all other policies, so even if a permissive policy is added later, this deny still applies.

## Files Changed
- New migration under `supabase/migrations/` (created via the migration tool).

## Verification After Apply
- Re-run the Supabase linter / security scan — `rate_limits_permissive_deny` finding should clear.
- Submit a test quote via the live form to confirm rate-limit logic in edge functions still functions (service role unaffected by RLS).
