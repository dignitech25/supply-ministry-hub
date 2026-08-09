-- =============================================================================
-- Curation wins, and the search index can no longer go stale
--
-- TWO DEFECTS, ONE ROOT CAUSE
--
-- rebuild_product_families() sources top_level_category / subcategory from
-- products_categorized and writes them over product_families on conflict. The
-- taxonomy engine (propose_product_taxonomy -> apply_taxonomy_proposal) writes
-- the curated values to product_families ONLY. So:
--
--   1. Re-running the rebuild -- the documented, expected thing to do after a
--      supplier import -- silently reverts the curated taxonomy on 230 of 513
--      active families. No error, no warning. Yesterday's classification work
--      would simply disappear.
--
--   2. search_text / search_document were last written by the rebuild, so they
--      still describe the OLD taxonomy. Measured: 230 of 513 families (45%)
--      have a stale search index. All 13 families in "Mattresses, Dynamic &
--      Alternating Air" contain zero occurrences of "Dynamic". Category
--      FILTERING works (it reads the column) while category SEARCH does not
--      (it reads the index).
--
-- THE FIX
--
-- (a) Curation wins. top_level_category / subcategory are dropped from the
--     ON CONFLICT update list, so an existing family keeps its curated
--     category and only a brand-new family takes the importer's guess. The
--     importer's categories are the ones known to be wrong -- 43% were 'low'
--     confidence and the "Icare" brand-substring bug filed 652 variants under
--     pressure care. Categories now change only through the taxonomy engine.
--
-- (b) search_text / search_document become GENERATED ALWAYS ... STORED,
--     derived from the row's own columns. They can no longer disagree with the
--     subcategory beside them, because Postgres recomputes them on every write.
--     apply_taxonomy_proposal() now refreshes the search index for free, and no
--     future writer can reintroduce the drift. This also repairs all 230 stale
--     rows the moment the migration runs.
--
-- Note: concat_ws() is STABLE, not IMMUTABLE, so it cannot appear in a
-- generated column. The equivalent coalesce/|| chain is immutable.
-- =============================================================================

-- sku_blob was previously folded into search_text and then discarded. The
-- generated columns need it as a real column to derive from.
alter table public.product_families
  add column if not exists sku_blob text;

comment on column public.product_families.sku_blob is
  'Space-joined cleaned SKUs for the family. Maintained by rebuild_product_families(); feeds the generated search columns.';

-- Backfill before the generated columns are created, so nothing loses SKU
-- searchability during the transition.
update public.product_families pf
   set sku_blob = src.blob
  from (
    select pc.family_id,
           string_agg(distinct coalesce(pc.sku_clean, pc.sku), ' ') as blob
      from public.products_categorized pc
     where pc.family_id is not null
     group by pc.family_id
  ) src
 where src.family_id = pf.id
   and pf.sku_blob is distinct from src.blob;

-- Dropping these columns drops idx_pf_search_doc and idx_pf_search_trgm with
-- them; both are recreated below. search_product_families() has a string body
-- and so carries no dependency that this would break.
alter table public.product_families
  drop column if exists search_document,
  drop column if exists search_text;

alter table public.product_families
  add column search_text text generated always as (
    coalesce(title, '')              || ' ' ||
    coalesce(brand, '')              || ' ' ||
    coalesce(subcategory, '')        || ' ' ||
    coalesce(top_level_category, '') || ' ' ||
    coalesce(sku_blob, '')
  ) stored,
  add column search_document tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')),   'A') ||
    setweight(to_tsvector('english', coalesce(brand, '')),   'B') ||
    setweight(to_tsvector('simple',  coalesce(sku_blob, '')),'B') ||
    setweight(to_tsvector('english',
      coalesce(subcategory, '') || ' ' || coalesce(top_level_category, '')), 'C')
  ) stored;

comment on column public.product_families.search_document is
  'Generated from this row. Cannot drift from subcategory: Postgres recomputes it on every write, including apply_taxonomy_proposal().';

create index if not exists idx_pf_search_doc
  on public.product_families using gin (search_document);
create index if not exists idx_pf_search_trgm
  on public.product_families using gin (search_text public.gin_trgm_ops);

-- -----------------------------------------------------------------------------
-- Rebuild, with curation preserved.
--
-- Unchanged from the original except for the ON CONFLICT list: the category
-- columns are no longer overwritten, the generated columns are no longer
-- assignable, and sku_blob is now maintained.
-- -----------------------------------------------------------------------------
create or replace function public.rebuild_product_families()
returns table (families_upserted integer, variants_linked integer, families_deactivated integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_upserted    integer := 0;
  v_linked      integer := 0;
  v_deactivated integer := 0;
begin
  update public.products_categorized pc
     set family_id = known.family_id
    from private.product_family_variant_keys known
   where pc.sku = known.sku
     and pc.family_id is null;

  if exists (
    select 1
      from public.products_categorized pc
     where pc.family_id is not null
       and (pc.brand is null or pc.title is null)
  ) then
    raise exception using
      message = 'A linked product variant is missing its brand or title',
      hint = 'Correct the source row before rebuilding product families.';
  end if;

  if exists (
    select 1
      from public.products_categorized pc
     where pc.family_id is not null
     group by pc.family_id
    having count(distinct (pc.brand, pc.title)) > 1
  ) then
    raise exception using
      message = 'A linked product family contains multiple brand/title identities',
      hint = 'Correct the inconsistent variants or clear only the incorrect family_id values, then rerun.';
  end if;

  with linked_identity as (
    select
      pc.family_id,
      min(pc.brand) as brand,
      min(pc.title) as title
    from public.products_categorized pc
    where pc.family_id is not null
      and pc.brand is not null
      and pc.title is not null
    group by pc.family_id
  )
  update public.product_families pf
     set brand = li.brand,
         title = li.title,
         display_name = li.title,
         updated_at = now()
    from linked_identity li
   where pf.id = li.family_id
     and (pf.brand, pf.title) is distinct from (li.brand, li.title);

  with agg as (
    select
      pc.brand,
      pc.title,
      (array_agg(pc.image_url order by
        coalesce(public.sm_safe_numeric(pc.price_discounted),
                 pc.price_rrp::numeric) nulls last, pc.sku))[1] as primary_image_url,
      (array_agg(pc.sku order by
        coalesce(public.sm_safe_numeric(pc.price_discounted),
                 pc.price_rrp::numeric) nulls last, pc.sku))[1] as representative_sku,
      (array_agg(pc.top_level_category order by pc.sku))[1]     as top_level_category,
      (array_agg(pc.subcategory order by pc.sku))[1]            as subcategory,
      min(coalesce(public.sm_safe_numeric(pc.price_discounted),
                   pc.price_rrp::numeric))                       as min_price,
      max(coalesce(public.sm_safe_numeric(pc.price_discounted),
                   pc.price_rrp::numeric))                       as max_price,
      count(*)::integer                                          as variant_count,
      array_agg(distinct pc.sku)                                 as variant_skus,
      string_agg(distinct coalesce(pc.sku_clean, pc.sku), ' ')   as sku_blob
    from public.products_categorized pc
    where pc.title is not null and pc.brand is not null
    group by pc.brand, pc.title
  )
  insert into public.product_families as pf (
    slug, brand, title, display_name, top_level_category, subcategory,
    primary_image_url, representative_sku, min_price, max_price,
    variant_count, variant_skus, sku_blob, is_active, updated_at
  )
  select
    public.sm_slugify(a.brand, a.title),
    a.brand, a.title, a.title,
    a.top_level_category, a.subcategory,
    a.primary_image_url, a.representative_sku,
    a.min_price, a.max_price,
    a.variant_count, a.variant_skus, a.sku_blob,
    true, now()
  from agg a
  on conflict (brand, title) do update set
    -- NOTE: slug is deliberately NOT updated. Identity must survive title edits.
    --
    -- NOTE: top_level_category and subcategory are deliberately NOT updated.
    -- Curation wins. The taxonomy engine owns these columns; the importer's
    -- values are the ones known to be wrong, and overwriting them here is what
    -- silently reverted 230 families. A brand-new family still takes the
    -- importer's value on the INSERT path above, because nothing better exists
    -- yet -- propose_product_taxonomy() will pick it up on the next run.
    --
    -- search_text and search_document are generated and cannot be assigned.
    display_name       = excluded.display_name,
    primary_image_url  = excluded.primary_image_url,
    representative_sku = excluded.representative_sku,
    min_price          = excluded.min_price,
    max_price          = excluded.max_price,
    variant_count      = excluded.variant_count,
    variant_skus       = excluded.variant_skus,
    sku_blob           = excluded.sku_blob,
    is_active          = true,
    updated_at         = now();

  get diagnostics v_upserted = row_count;

  update public.products_categorized pc
     set family_id = pf.id
    from public.product_families pf
   where pf.brand = pc.brand
     and pf.title = pc.title
     and pc.family_id is distinct from pf.id;

  get diagnostics v_linked = row_count;

  -- Persist the latest known SKU membership so identity can be restored after
  -- future imports. Reusing a SKU for an unrelated product is unsupported and
  -- must be corrected at source rather than silently creating a second owner.
  insert into private.product_family_variant_keys as known (
    sku, family_id, first_seen_at, last_seen_at
  )
  select pc.sku, pc.family_id, now(), now()
    from public.products_categorized pc
   where pc.family_id is not null
  on conflict (sku) do update set
    family_id = excluded.family_id,
    last_seen_at = now();

  -- Families whose variants have all disappeared from the import are hidden,
  -- never deleted, so their URLs can 301 rather than 404.
  update public.product_families pf
     set is_active = false, updated_at = now()
   where pf.is_active
     and not exists (
       select 1 from public.products_categorized pc
        where pc.brand = pf.brand and pc.title = pf.title
     );

  get diagnostics v_deactivated = row_count;

  return query select v_upserted, v_linked, v_deactivated;
end;
$$;

comment on function public.rebuild_product_families() is
  'Idempotent rebuild from products_categorized. Preserves family id, slug AND curated taxonomy; the search index is generated, so it can never fall behind.';

revoke execute on function public.rebuild_product_families() from public, anon, authenticated;
grant  execute on function public.rebuild_product_families() to service_role;

-- =============================================================================
-- ROLLBACK
--   Restore rebuild_product_families() from
--   20260808070000_product_families_and_search.sql, then:
--     alter table public.product_families
--       drop column search_document, drop column search_text;
--     alter table public.product_families
--       add column search_document tsvector, add column search_text text;
--     create index idx_pf_search_doc  on public.product_families using gin (search_document);
--     create index idx_pf_search_trgm on public.product_families using gin (search_text public.gin_trgm_ops);
--     select public.rebuild_product_families();
--     alter table public.product_families drop column sku_blob;
-- =============================================================================
