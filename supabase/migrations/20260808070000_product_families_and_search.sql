-- =============================================================================
-- Find a Product — Sprint 1
-- Family-level catalogue data source, controlled taxonomy hooks, and search.
--
-- This migration is ADDITIVE and REVERSIBLE. It does not drop or rewrite any
-- existing column. `products_categorized` gains one nullable column
-- (`family_id`); everything else is new objects.
--
-- Rollback: see the matching down-migration notes at the bottom of this file.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Indexes on products_categorized
--
-- products_categorized currently has exactly one index: the `sku` primary key.
-- Every category filter, brand filter and ILIKE search is therefore a
-- sequential scan of 3,347 rows. Narrowing the SELECT list (done previously)
-- reduced payload but not scan cost. These indexes address the scan cost.
-- -----------------------------------------------------------------------------

create index if not exists idx_pc_top_level_category
  on public.products_categorized (top_level_category);

create index if not exists idx_pc_subcategory
  on public.products_categorized (subcategory);

create index if not exists idx_pc_brand
  on public.products_categorized (brand);

-- Family lookup key: the detail page resolves a family with
-- `where brand = $1 and title = $2`, which is currently two sequential scans.
create index if not exists idx_pc_brand_title
  on public.products_categorized (brand, title);

-- `handle` is unique per variant (3,347 distinct, zero nulls) and is already
-- routed at /product/:handle, but was unindexed.
create unique index if not exists idx_pc_handle
  on public.products_categorized (handle);

-- Partial/exact SKU matching for search-as-you-type.
create index if not exists idx_pc_sku_trgm
  on public.products_categorized using gin (sku public.gin_trgm_ops);


-- -----------------------------------------------------------------------------
-- 2. Safe numeric coercion for prices
--
-- products_categorized.price_discounted is TEXT (a CSV import artefact) while
-- price_rrp is BIGINT. Today every value happens to parse cleanly, but a single
-- malformed supplier row would break any unguarded ::numeric cast. This helper
-- fails soft to NULL instead.
-- -----------------------------------------------------------------------------

create or replace function public.sm_safe_numeric(p_value text)
returns numeric
language sql
immutable
parallel safe
set search_path = ''
as $$
  select case
    when p_value is null then null
    when btrim(p_value) ~ '^[0-9]+(\.[0-9]+)?$' then btrim(p_value)::numeric
    else null
  end;
$$;

comment on function public.sm_safe_numeric(text) is
  'Parses a text price to numeric, returning NULL rather than raising on malformed supplier data.';


-- -----------------------------------------------------------------------------
-- 3. Stable family identity
--
-- A product family is currently derived in the browser as (brand, title). That
-- key is correct today -- 513 families, 513 distinct slugs, zero collisions --
-- but it is NOT stable: any supplier title correction silently mints a new
-- family and breaks the URL that occupational therapists have bookmarked or
-- that Google has indexed.
--
-- This table persists a surrogate id and slug. Once variants have a family_id,
-- rebuild_product_families() resolves the family by that id before considering
-- the editable (brand, title) lookup key. This preserves identity across title
-- corrections. A private SKU-to-family key table also restores identity when
-- an importer recreates catalogue rows and loses their family_id values.
-- -----------------------------------------------------------------------------

create table if not exists public.product_families (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,

  -- Import matching key. Unique so re-running the rebuild is idempotent.
  brand              text not null,
  title              text not null,

  -- Denormalised listing payload: everything a catalogue card needs, so the
  -- listing endpoint never has to touch the variant table.
  display_name       text,
  top_level_category text,
  subcategory        text,
  primary_image_url  text,
  representative_sku text,
  min_price          numeric,
  max_price          numeric,
  variant_count      integer not null default 0,
  variant_skus       text[]  not null default '{}',

  -- Populated by rebuild_product_families(); indexed for search.
  search_document    tsvector,
  search_text        text,

  is_active          boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint product_families_brand_title_key unique (brand, title)
);

comment on table public.product_families is
  'One row per displayed product family. Rebuilt from products_categorized; linked variants preserve family id and slug across supplier title changes.';
comment on column public.product_families.slug is
  'Stable public URL segment. Generated once on insert and never regenerated, so indexed URLs survive title corrections.';
comment on column public.product_families.representative_sku is
  'Deterministic default variant for listing display. NOT authoritative for quoting -- the buyer must select an explicit variant.';

create index if not exists idx_pf_category      on public.product_families (top_level_category);
create index if not exists idx_pf_subcategory   on public.product_families (subcategory);
create index if not exists idx_pf_brand         on public.product_families (brand);
create index if not exists idx_pf_min_price     on public.product_families (min_price);
create index if not exists idx_pf_search_doc    on public.product_families using gin (search_document);
create index if not exists idx_pf_search_trgm   on public.product_families using gin (search_text public.gin_trgm_ops);
create index if not exists idx_pf_variant_skus  on public.product_families using gin (variant_skus);

-- Keep SKU-to-family identity outside the imported catalogue table as a second
-- line of defence. If an import recreates rows and loses family_id, a surviving
-- SKU can still recover its established family before title matching occurs.
-- A simultaneous SKU + title replacement remains intentionally manual because
-- there is no trustworthy automatic identity signal in that case.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.product_family_variant_keys (
  sku           text primary key,
  family_id     uuid not null references public.product_families(id) on delete cascade,
  first_seen_at timestamptz not null default now(),
  last_seen_at  timestamptz not null default now()
);

create index if not exists idx_pf_variant_keys_family_id
  on private.product_family_variant_keys (family_id);

-- Link variants back to their family.
alter table public.products_categorized
  add column if not exists family_id uuid references public.product_families(id) on delete set null;

create index if not exists idx_pc_family_id
  on public.products_categorized (family_id);


-- -----------------------------------------------------------------------------
-- 4. Slug generation
--
-- Mirrors the existing client-side generateParentSlug() in
-- src/utils/variantHelpers.ts so that any parent-slug URLs already in the wild
-- resolve to the same family. Verified against production: 513/513 unique.
-- -----------------------------------------------------------------------------

create or replace function public.sm_slugify(p_brand text, p_title text)
returns text
language sql
immutable
parallel safe
set search_path = ''
as $$
  select btrim(regexp_replace(lower(coalesce(p_brand, 'unknown')), '[^a-z0-9]+', '_', 'g'), '_')
      || '_'
      || btrim(regexp_replace(lower(coalesce(p_title, '')),        '[^a-z0-9]+', '_', 'g'), '_');
$$;


-- -----------------------------------------------------------------------------
-- 5. Rebuild routine
--
-- Idempotent. Safe to call after every supplier import. Existing families keep
-- their id and slug; only the denormalised payload is refreshed.
--
-- At 513 families / 3,347 variants this completes in single-digit milliseconds,
-- which is why a maintained table is preferable to a materialised view here:
-- same cost, but stable surrogate keys and no CONCURRENTLY/locking caveats.
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
  -- Recover identity after an importer has recreated a known SKU without
  -- carrying its family_id column forward.
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

  -- A linked family must resolve to exactly one current (brand, title) pair.
  -- If an import only updates some variants in a family, guessing which title
  -- should win would silently split or merge public URLs. Fail transactionally
  -- and send the family for manual correction instead.
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

  -- Resolve already-linked families by immutable family_id first. This is the
  -- step that makes a supplier title correction update the existing family
  -- instead of minting a new id and slug. The unique (brand, title) constraint
  -- intentionally turns ambiguous merges into a transaction failure.
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
      -- Deterministic representative variant: cheapest, ties broken by SKU so
      -- the choice never flips between rebuilds.
      (array_agg(pc.image_url order by
        coalesce(public.sm_safe_numeric(pc.price_discounted),
                 pc.price_rrp::numeric) nulls last, pc.sku))[1] as primary_image_url,
      (array_agg(pc.sku order by
        coalesce(public.sm_safe_numeric(pc.price_discounted),
                 pc.price_rrp::numeric) nulls last, pc.sku))[1] as representative_sku,
      (array_agg(pc.top_level_category order by pc.sku))[1]     as top_level_category,
      (array_agg(pc.subcategory order by pc.sku))[1]            as subcategory,
      -- price_discounted is the live storefront price. A value above RRP is a
      -- data-quality issue to surface, not permission to silently show the old
      -- lower RRP and create a margin risk.
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
    variant_count, variant_skus, search_text, search_document, is_active, updated_at
  )
  select
    public.sm_slugify(a.brand, a.title),
    a.brand, a.title, a.title,
    a.top_level_category, a.subcategory,
    a.primary_image_url, a.representative_sku,
    a.min_price, a.max_price,
    a.variant_count, a.variant_skus,
    concat_ws(' ', a.title, a.brand, a.subcategory, a.top_level_category, a.sku_blob),
    setweight(to_tsvector('english', coalesce(a.title, '')),  'A') ||
    setweight(to_tsvector('english', coalesce(a.brand, '')),  'B') ||
    setweight(to_tsvector('simple',  coalesce(a.sku_blob, '')), 'B') ||
    setweight(to_tsvector('english', concat_ws(' ', a.subcategory, a.top_level_category)), 'C'),
    true, now()
  from agg a
  on conflict (brand, title) do update set
    -- NOTE: slug is deliberately NOT updated. Identity must survive title edits.
    display_name       = excluded.display_name,
    top_level_category = excluded.top_level_category,
    subcategory        = excluded.subcategory,
    primary_image_url  = excluded.primary_image_url,
    representative_sku = excluded.representative_sku,
    min_price          = excluded.min_price,
    max_price          = excluded.max_price,
    variant_count      = excluded.variant_count,
    variant_skus       = excluded.variant_skus,
    search_text        = excluded.search_text,
    search_document    = excluded.search_document,
    is_active          = true,
    updated_at         = now();

  get diagnostics v_upserted = row_count;

  -- Link every variant to its family.
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
  'Idempotent rebuild from products_categorized. Linked variants preserve family id and slug; inconsistent linked identities fail transactionally.';


-- -----------------------------------------------------------------------------
-- 6. Listing + search RPC
--
-- Replaces the current client-side pattern of fetching every matching variant
-- row in 1,000-row batches and grouping in the browser. Returns exactly one row
-- per family, already filtered, sorted, paginated and counted -- one round trip.
--
-- `matched_sku` is the reason this is an RPC rather than a view: when the query
-- matches a specific variant SKU, the caller needs to know WHICH variant so the
-- product page can preselect it instead of defaulting to the cheapest.
-- -----------------------------------------------------------------------------

create or replace function public.search_product_families(
  p_query         text     default null,
  p_categories    text[]   default null,
  p_subcategories text[]   default null,
  p_brands        text[]   default null,
  p_sort          text     default 'relevance',
  p_limit         integer  default 24,
  p_offset        integer  default 0
)
returns table (
  id                 uuid,
  slug               text,
  title              text,
  display_name       text,
  brand              text,
  top_level_category text,
  subcategory        text,
  primary_image_url  text,
  representative_sku text,
  matched_sku        text,
  min_price          numeric,
  max_price          numeric,
  variant_count      integer,
  total_count        bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  with params as (
    select
      nullif(btrim(coalesce(p_query, '')), '')            as q,
      greatest(1, least(coalesce(p_limit, 24), 96))       as lim,
      greatest(0, coalesce(p_offset, 0))                  as off
  ),
  filtered as (
    select
      pf.*,
      -- Exact SKU hit wins outright; that is what "search a known SKU" means.
      (select vs from unnest(pf.variant_skus) vs
        where upper(vs) = upper((select q from params)) limit 1)          as exact_sku,
      (select vs from unnest(pf.variant_skus) vs
        where vs ilike '%' || (select q from params) || '%' limit 1)      as partial_sku,
      case
        when (select q from params) is null then 0
        else ts_rank(pf.search_document,
                     websearch_to_tsquery('english', (select q from params)))
      end                                                                 as rank
    from public.product_families pf, params
    where pf.is_active
      and (p_categories    is null or cardinality(p_categories)    = 0 or pf.top_level_category = any(p_categories))
      and (p_subcategories is null or cardinality(p_subcategories) = 0 or pf.subcategory        = any(p_subcategories))
      and (p_brands        is null or cardinality(p_brands)        = 0 or pf.brand              = any(p_brands))
      and (
        params.q is null
        or pf.search_document @@ websearch_to_tsquery('english', params.q)
        or pf.search_text ilike '%' || params.q || '%'
        or exists (select 1 from unnest(pf.variant_skus) vs where vs ilike '%' || params.q || '%')
      )
  )
  select
    f.id, f.slug, f.title, f.display_name, f.brand,
    f.top_level_category, f.subcategory,
    f.primary_image_url, f.representative_sku,
    coalesce(f.exact_sku, f.partial_sku)                as matched_sku,
    f.min_price, f.max_price, f.variant_count,
    count(*) over ()                                    as total_count
  from filtered f, params
  order by
    case when p_sort = 'relevance' and f.exact_sku is not null then 0 else 1 end,
    case when p_sort = 'relevance' then -f.rank end nulls last,
    case when p_sort = 'price-low'  then f.min_price end asc  nulls last,
    case when p_sort = 'price-high' then -f.min_price end asc nulls last,
    case when p_sort = 'brand-az'   then f.brand end asc      nulls last,
    f.brand, f.title
  limit  (select lim from params)
  offset (select off from params);
$$;

comment on function public.search_product_families is
  'Server-side family listing: filter, search, sort, paginate and count in one round trip. Returns matched_sku so an exact SKU query can preselect the correct variant.';


-- -----------------------------------------------------------------------------
-- 7. Filter facet RPC
--
-- The catalogue currently downloads all 3,347 rows on mount purely to derive
-- the brand list, and downloads them again to derive subcategories whenever a
-- category is picked. Both become a single indexed aggregate.
-- -----------------------------------------------------------------------------

create or replace function public.get_catalogue_facets(
  p_categories text[] default null
)
returns table (facet_type text, value text, family_count bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select 'brand', pf.brand, count(*)
    from public.product_families pf
   where pf.is_active and pf.brand is not null
   group by pf.brand
  union all
  select 'category', pf.top_level_category, count(*)
    from public.product_families pf
   where pf.is_active and pf.top_level_category is not null
   group by pf.top_level_category
  union all
  select 'subcategory', pf.subcategory, count(*)
    from public.product_families pf
   where pf.is_active
     and pf.subcategory is not null
     and (p_categories is null or cardinality(p_categories) = 0
          or pf.top_level_category = any(p_categories))
   group by pf.subcategory
   order by 1, 2;
$$;


-- -----------------------------------------------------------------------------
-- 8. Access control
--
-- The catalogue is public, read-only data. Writes stay with service_role.
-- -----------------------------------------------------------------------------

alter table public.product_families enable row level security;

drop policy if exists "Product families are publicly readable" on public.product_families;
create policy "Product families are publicly readable"
  on public.product_families for select
  to anon, authenticated
  using (is_active);

-- Postgres grants EXECUTE on new functions to PUBLIC by default. Revoking only
-- from anon/authenticated is insufficient because both inherit from PUBLIC.
-- The write-capable SECURITY DEFINER function must never be anonymously
-- callable through /rest/v1/rpc/rebuild_product_families.
revoke execute on function public.rebuild_product_families() from public, anon, authenticated;
grant  execute on function public.rebuild_product_families() to service_role;

-- Read RPCs do not need elevated privileges: grant the underlying RLS-filtered
-- table and execute them as the caller.
grant select on table public.product_families to anon, authenticated;

revoke execute on function public.search_product_families(text, text[], text[], text[], text, integer, integer) from public;
revoke execute on function public.get_catalogue_facets(text[]) from public;
grant  execute on function public.search_product_families(text, text[], text[], text[], text, integer, integer) to anon, authenticated;
grant  execute on function public.get_catalogue_facets(text[]) to anon, authenticated;

-- Helpers are implementation details, not public API endpoints.
revoke execute on function public.sm_safe_numeric(text) from public, anon, authenticated;
revoke execute on function public.sm_slugify(text, text) from public, anon, authenticated;


-- -----------------------------------------------------------------------------
-- 9. Initial population
-- -----------------------------------------------------------------------------

select public.rebuild_product_families();


-- =============================================================================
-- ROLLBACK
--
--   drop function if exists public.get_catalogue_facets(text[]);
--   drop function if exists public.search_product_families(text, text[], text[], text[], text, integer, integer);
--   drop function if exists public.rebuild_product_families();
--   drop function if exists public.sm_slugify(text, text);
--   drop function if exists public.sm_safe_numeric(text);
--   alter table public.products_categorized drop column if exists family_id;
--   drop table if exists private.product_family_variant_keys;
--   drop table if exists public.product_families;
--   -- indexes on products_categorized are safe to keep; drop individually if required.
-- =============================================================================
