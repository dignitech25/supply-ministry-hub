DROP POLICY IF EXISTS "Deny all access to rate_limits" ON public.rate_limits;

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restrict all client access to rate_limits"
ON public.rate_limits
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);