-- Create quote_requests table for form submissions
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  organization TEXT,
  category TEXT NOT NULL,
  requirements TEXT NOT NULL,
  timeline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  source_url TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert quote requests
CREATE POLICY "Allow anonymous quote request submissions" 
ON public.quote_requests 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Deny all other operations by default (no SELECT, UPDATE, DELETE for anonymous users)
-- This ensures quote data is secure but submission works without login

-- Create index for efficient queries by status and creation time
CREATE INDEX idx_quote_requests_status_created ON public.quote_requests(status, created_at DESC);
CREATE INDEX idx_quote_requests_email ON public.quote_requests(email);