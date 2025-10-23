-- Drop legacy OT columns from quotes table
-- These have been replaced by requester_* columns
ALTER TABLE public.quotes
DROP COLUMN IF EXISTS ot_name,
DROP COLUMN IF EXISTS ot_email,
DROP COLUMN IF EXISTS ot_phone,
DROP COLUMN IF EXISTS organization;