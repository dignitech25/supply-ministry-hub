-- Enable RLS on backup and legacy tables to prevent unauthorized access

-- 1. Enable RLS on products_backup_20251022
ALTER TABLE public.products_backup_20251022 ENABLE ROW LEVEL SECURITY;

-- 2. Enable RLS on products_legacy  
ALTER TABLE public.products_legacy ENABLE ROW LEVEL SECURITY;

-- Note: No SELECT policies are added, making these tables completely private
-- They should only be accessed via direct database access or can be dropped if not needed

-- 3. Create rate_limits table for abuse protection on public endpoints
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- IP address or email
  identifier_type text NOT NULL, -- 'ip' or 'email'
  endpoint text NOT NULL, -- which endpoint was called
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on rate_limits (only edge functions with service role can access)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON public.rate_limits(identifier, identifier_type, endpoint, window_start);

-- Add trigger for updated_at
CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON public.rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();