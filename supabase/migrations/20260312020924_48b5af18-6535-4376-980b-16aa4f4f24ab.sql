-- Drop the products_public view (depends on products_legacy, not used in app code)
DROP VIEW IF EXISTS public.products_public;

-- Now drop all 3 unused tables
DROP TABLE IF EXISTS public._stg_products_website;
DROP TABLE IF EXISTS public.products_backup_20251022;
DROP TABLE IF EXISTS public.products_legacy;