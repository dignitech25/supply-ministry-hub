-- =============================================================================
-- Clinical search synonyms
--
-- Supplier product titles use manufacturer vocabulary. Australian OTs, case
-- managers and support coordinators prescribe in clinical vocabulary, and the
-- two do not overlap. Measured against the live catalogue before this change:
--
--   "4WW"                -> 0 results   (vs "walker" -> 18)
--   "4 wheel walker"     -> 0 results
--   "hospital bed"       -> 0 results   (vs "adjustable bed" -> 36)
--   "pick up frame"      -> 0 results
--   "transfer belt"      -> 0 results   (vs "walk belt" -> 1)
--   "walking frame"      -> 4 results   (vs "walker" -> 18)
--   "raised toilet seat" -> 1 result    (the subcategory holds 4 families)
--
-- "4WW" is the standard abbreviation for a four-wheel walker on an Australian
-- AT prescription. Returning nothing for it is a lost order, and under SAH
-- reform (OT prescription now required) this is precisely the traffic that
-- matters most.
--
-- This layer is purely ADDITIVE. Every original match path is preserved and the
-- expansion is OR-ed alongside it, so a synonym can widen a result set but can
-- never remove a result that matched before. A missing or empty synonym table
-- degrades to exactly the previous behaviour.
-- =============================================================================

create table if not exists public.search_synonyms (
  id         uuid primary key default gen_random_uuid(),
  alias      text not null unique,
  expansion  text not null,
  notes      text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  -- The alias is interpolated into a LIKE pattern for whole-phrase matching.
  -- Constraining the charset is what makes that safe: no wildcards, no escapes.
  constraint search_synonyms_alias_charset check (alias ~ '^[a-z0-9][a-z0-9 -]*$'),
  constraint search_synonyms_alias_len     check (char_length(alias) between 2 and 60),
  constraint search_synonyms_expansion_len check (char_length(expansion) between 2 and 200)
);

comment on table public.search_synonyms is
  'Clinical/colloquial search aliases mapped to catalogue vocabulary. expansion is websearch_to_tsquery syntax, so " or " between alternatives is meaningful.';
comment on column public.search_synonyms.alias is
  'Lowercase phrase the user types. Matched whole-phrase against the normalised query, not as a substring.';
comment on column public.search_synonyms.expansion is
  'websearch_to_tsquery input OR-ed into the search. Use " or " to widen; adjacent words stay an AND phrase.';

create index if not exists idx_search_synonyms_active
  on public.search_synonyms (alias) where is_active;

-- Vocabulary is not commercially sensitive (unlike search_gaps), and
-- search_product_families is SECURITY INVOKER, so the anon role must be able to
-- read it or search breaks for every logged-out visitor. Read-only, explicitly:
-- Supabase's default privileges would otherwise hand anon full DML here, which
-- is exactly how taxonomy_review_queue became writable by the public.
alter table public.search_synonyms enable row level security;
revoke all on public.search_synonyms from anon, authenticated;
grant select on public.search_synonyms to anon, authenticated;

drop policy if exists "Active search synonyms are publicly readable" on public.search_synonyms;
create policy "Active search synonyms are publicly readable"
  on public.search_synonyms for select
  to anon, authenticated
  using (is_active);

-- -----------------------------------------------------------------------------
-- Seed: Australian clinical and colloquial AT vocabulary.
-- Expansions target words that genuinely appear in title / brand / subcategory /
-- top_level_category, which is what search_document is built from.
-- -----------------------------------------------------------------------------
insert into public.search_synonyms (alias, expansion, notes) values
  -- Walking
  ('4ww',                 'walker or rollator',                        'Standard AU abbreviation: four-wheel walker'),
  ('4 wheel walker',      'walker or rollator',                        null),
  ('four wheel walker',   'walker or rollator',                        null),
  ('wheelie walker',      'walker or rollator',                        'Colloquial AU'),
  ('seat walker',         'walker or rollator',                        null),
  ('walking frame',       'walker or rollator or frame',               'AU term; supplier titles say "walker"'),
  ('pick up frame',       'walking frame or walker or frame',          'Non-wheeled frame'),
  ('pu frame',            'walking frame or walker or frame',          null),
  ('gutter frame',        'walker or frame',                           null),
  ('walking stick',       'cane or crutch or stick',                   null),
  ('quad stick',          'cane or crutch',                            null),
  ('forearm crutches',    'crutch or cane',                            null),

  -- Beds
  ('hospital bed',        'adjustable bed or floorline bed',           'Most common lay/clinical phrasing'),
  ('electric bed',        'adjustable bed',                            null),
  ('profiling bed',       'adjustable bed',                            null),
  ('king single bed',     'adjustable bed',                            null),
  ('bed stick',           'bed rail or bed pole or bed accessories',   null),
  ('bed pole',            'bed rail or bed accessories',               null),
  ('rope ladder',         'bed accessories',                           null),
  ('monkey bar',          'bed accessories or bed pole',               'Colloquial for overhead bed pole'),

  -- Transfers
  ('transfer belt',       'walk belt or transfer aids',                'Supplier title is "Walk Belt"'),
  ('gait belt',           'walk belt or transfer aids',                null),
  ('slide sheet',         'transfer aids or slide',                    null),
  ('transfer board',      'transfer aids',                             null),
  ('banana board',        'transfer aids',                             'Colloquial AU'),
  ('patient lifter',      'hoist or stand aid or lifter',              null),
  ('sit to stand',        'stand aid or hoist',                        null),
  ('sling',               'hoist or stand aid',                        null),

  -- Toileting
  ('raised toilet seat',  'raised toilet seat or toilet seat',         null),
  -- Expansions must carry their own " or ". "raised toilet seat" alone becomes
  -- an AND of three lexemes and matches a single family; measured 1 -> 13 with
  -- the alternation present.
  ('rts',                 'raised toilet seat or toilet seat',         'AU abbreviation'),
  ('toilet seat raiser',  'raised toilet seat or toilet seat',         null),
  ('over toilet aid',     'over toilet frame',                         null),
  ('ota',                 'over toilet frame',                         'AU abbreviation'),
  ('otf',                 'over toilet frame',                         'AU abbreviation'),
  ('toilet frame',        'over toilet frame',                         null),
  ('toilet surround',     'over toilet frame',                         null),
  ('commode',             'shower commode or commode',                 null),
  ('mobile shower commode','shower commode',                           null),
  ('msc',                 'shower commode',                            'AU abbreviation'),
  ('shower chair',        'shower stool or chair',                     null),
  ('shower stool',        'shower stool or chair',                     null),
  ('bath stool',          'shower stool or chair',                     null),
  ('bath board',          'bath board or transfer bench',              null),
  ('transfer bench',      'bath board or transfer bench',              null),
  ('grab rail',           'grab rail',                                 null),
  ('grab bar',            'grab rail',                                 null),
  ('hand rail',           'grab rail',                                 null),

  -- Pressure care
  ('pressure mattress',   'pressure care or alternating air',          null),
  ('air mattress',        'dynamic or alternating air',                null),
  ('alternating mattress','dynamic or alternating air',                null),
  ('apam',                'alternating air or dynamic',                'Alternating pressure air mattress'),
  ('dynamic mattress',    'dynamic or alternating air',                null),
  ('foam mattress',       'pressure care or standard mattress',        null),
  ('static mattress',     'pressure care',                             null),
  ('pressure cushion',    'cushion or pressure seating',               null),
  ('wheelchair cushion',  'cushion or pressure seating',               null),
  ('gel cushion',         'cushion or pressure seating',               null),
  ('roho',                'cushion or pressure seating',               'Brand used generically'),

  -- Seating
  ('lift chair',          'lift recliner chair',                       null),
  ('riser recliner',      'lift recliner chair',                       null),
  ('day chair',           'day chair or high back chair',              null),
  ('high back chair',     'day chair or high back chair',              null),
  ('perching stool',      'stool or perching',                         null),
  ('tilt in space',       'tilt-in-space chair',                       null),
  ('tis chair',           'tilt-in-space chair',                       'AU abbreviation'),

  -- Falls prevention
  ('sensor mat',          'falls prevention',                          null),
  ('falls mat',           'falls prevention',                          null),
  ('crash mat',           'falls prevention',                          null),

  -- Continence and bedding
  ('kylie',               'bedding protector or protector',            'AU generic term for a bed underpad'),
  ('underpad',            'bedding protector',                         null),
  ('bed protector',       'bedding protector',                         null),
  ('continence',          'incontinence or brief or pad',              null),
  ('incontinence pad',    'incontinence or brief or pad',              null),

  -- Wheels and access
  ('scooter',             'mobility scooter',                          null),
  ('gopher',              'mobility scooter',                          'Colloquial AU'),
  ('manual wheelchair',   'wheelchair',                                null),
  ('self propelled',      'wheelchair',                                null),
  ('attendant propelled', 'wheelchair',                                null),
  ('threshold ramp',      'ramp or threshold',                         null),

  -- Positioning
  ('positioner',          'pillow or positioner',                      null),
  ('wedge',               'pillow or positioner',                      null)
on conflict (alias) do update set
  expansion = excluded.expansion,
  notes     = excluded.notes,
  is_active = true;

-- -----------------------------------------------------------------------------
-- Synonym-aware search.
--
-- Signature is unchanged, so the existing grants survive `create or replace`
-- and the frontend needs no change at all.
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
      lower(nullif(btrim(coalesce(p_query, '')), ''))     as q_norm,
      -- LIKE metacharacters in user input must match literally. Without this,
      -- a query of '%' expands to ILIKE '%%%' and returns the entire
      -- catalogue, which both misleads the shopper and destroys the genuine
      -- zero-result signal that catalogue-gap reporting depends on.
      '%' || replace(replace(replace(
        nullif(btrim(coalesce(p_query, '')), ''),
        '\', '\\'), '%', '\%'), '_', '\_') || '%'         as q_like,
      greatest(1, least(coalesce(p_limit, 24), 96))       as lim,
      greatest(0, coalesce(p_offset, 0))                  as off
  ),
  -- Whole-phrase alias match, not substring: padding both sides with a space
  -- means alias 'ota' matches "ota" and "ota frame" but never "quota". The
  -- alias charset constraint is what makes this LIKE safe to interpolate.
  syn as (
    select string_agg(s.expansion, ' or ') as expansion
    from public.search_synonyms s, params p
    where p.q_norm is not null
      and s.is_active
      and ' ' || p.q_norm || ' ' like '%' || ' ' || s.alias || ' ' || '%'
  ),
  tsq as (
    select case
      when p.q is null then null::tsquery
      when s.expansion is null then websearch_to_tsquery('english', p.q)
      else websearch_to_tsquery('english', p.q)
           || websearch_to_tsquery('english', s.expansion)
    end as query
    from params p, syn s
  ),
  filtered as (
    select
      pf.*,
      -- Exact SKU hit wins outright; that is what "search a known SKU" means.
      (select vs from unnest(pf.variant_skus) vs
        where upper(vs) = upper((select q from params)) limit 1)          as exact_sku,
      (select vs from unnest(pf.variant_skus) vs
        where vs ilike (select q_like from params) escape '\' limit 1)    as partial_sku,
      case
        when (select q from params) is null then 0
        -- Rank on the literal query only. A synonym should widen the result
        -- set without letting an expansion outrank a genuine title match.
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
        or pf.search_document @@ (select query from tsq)
        or pf.search_text ilike params.q_like escape '\'
        or exists (select 1 from unnest(pf.variant_skus) vs
                    where vs ilike params.q_like escape '\')
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
  'Server-side family listing: filter, search, sort, paginate and count in one round trip. Expands clinical/colloquial aliases via search_synonyms (additive only). Returns matched_sku so an exact SKU query can preselect the correct variant.';

-- =============================================================================
-- ROLLBACK
--   Restore the function body from 20260808070000_product_families_and_search.sql
--   drop table if exists public.search_synonyms;
-- =============================================================================
