-- Add missing columns to quote_items table
ALTER TABLE public.quote_items
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS size text,
ADD COLUMN IF NOT EXISTS colour text,
ADD COLUMN IF NOT EXISTS price_source text;

-- Fix search_path security issue for create_quote_with_items function
DROP FUNCTION IF EXISTS public.create_quote_with_items(jsonb);

CREATE OR REPLACE FUNCTION public.create_quote_with_items(p_payload jsonb)
RETURNS TABLE(quote_id uuid, ref_code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
declare
  v_quote_id uuid;
  v_ref_code text;
  v_subtotal numeric := 0;
  v_item jsonb;
begin
  -- Generate quote reference
  v_ref_code := public.make_quote_number();

  -- Insert quote with correct column names
  insert into public.quotes (
    ref_code, status,
    requester_type, requester_name, requester_organisation,
    requester_email, requester_phone,
    client_name, client_ndis_number,
    funding_type, delivery_address,
    clinical_context, urgency,
    subtotal, raw_form
  )
  values (
    v_ref_code, coalesce(p_payload->>'status', 'submitted'),
    p_payload->>'requester_type', p_payload->>'requester_name', p_payload->>'requester_organisation',
    p_payload->>'requester_email', p_payload->>'requester_phone',
    p_payload->>'client_name', p_payload->>'client_ndis_number',
    p_payload->>'funding_type', p_payload->>'delivery_address',
    p_payload->>'clinical_context', p_payload->>'urgency',
    null, p_payload
  )
  returning id into v_quote_id;

  -- Insert items
  for v_item in
    select * from jsonb_array_elements(coalesce(p_payload->'items', '[]'::jsonb))
  loop
    insert into public.quote_items (
      quote_id, sku, title, size, colour, quantity, unit_price, price_source
    )
    values (
      v_quote_id,
      v_item->>'sku',
      v_item->>'title',
      nullif(v_item->>'size',''),
      nullif(v_item->>'colour',''),
      coalesce((v_item->>'quantity')::int, 1),
      nullif(v_item->>'unit_price','')::numeric,
      nullif(v_item->>'price_source','')
    );
  end loop;

  -- Compute subtotal
  select coalesce(sum(quantity * coalesce(unit_price, 0)), 0)
    into v_subtotal
  from public.quote_items
  where quote_id = v_quote_id;

  -- Update subtotal
  update public.quotes
     set subtotal = v_subtotal
   where id = v_quote_id;

  return query select v_quote_id, v_ref_code;
end;
$function$;