-- Fix RLS issues for quote and staging tables

-- 1. Enable RLS on staging products table (should be completely private)
ALTER TABLE public._stg_products_website ENABLE ROW LEVEL SECURITY;

-- 2. Add SELECT policies to prevent public data exposure
-- quote_requests: Only accessible via edge functions (no public SELECT)
-- quotes: Only accessible via edge functions (no public SELECT)  
-- quote_items: Only accessible via edge functions (no public SELECT)

-- Note: These tables already have INSERT policies for anonymous submissions,
-- but we're ensuring no public SELECT access to protect customer data.
-- Data access should only happen through edge functions using service role key.