-- =============================================================================
-- Taxonomy correction — governed classification rules
--
-- APPLIED to production 2026-08-08. It creates the rule table, the
-- classifier and a review queue, and writes a proposal into
-- product_families.proposed_* columns. It does NOT overwrite the live
-- top_level_category / subcategory until `apply_taxonomy_proposal()` is run
-- deliberately.
--
-- WHY THE CURRENT DATA IS WRONG
--
-- The existing classifier recorded its own reasoning in
-- products_categorized.category_rule. Reading it back shows three defects:
--
--   1. It matched the BRAND as though it were the product. The brand "Icare"
--      contains the substring "care", so the rule
--        matched keywords: 'care'(+1), brand bias(+1) -> Mattresses, Pressure Care
--      (confidence: low, 566 variants) dragged 652 of 848 Icare variants into
--      pressure care -- headboards, footboards, side rails and hi-lo beds.
--   2. It had no exclusions: "Blood Pressure Monitor" matched 'pressure'.
--   3. It had no precedence, so a generic +1 keyword could outrank the real
--      product noun.
--
-- Catalogue-wide, 43% of variants were classified at 'low' confidence and a
-- further 2.5% at 'none'. The 'none' bucket silently defaulted to
-- Mobility > Wheelchairs, which is why bed-end panels and a walk belt were
-- filed under wheelchairs.
--
-- WHAT THIS DOES DIFFERENTLY
--
--   * Strips the brand from the title before matching. This single step is
--     what stops "Icare" reading as the keyword "care".
--   * Matches the product noun, most specific first (lowest priority wins).
--   * Carries explicit exclusions per rule.
--   * REFUSES TO GUESS. Anything unmatched goes to a review queue instead of a
--     default bucket. Guessing is what produced the current mess.
--
-- Note on soft goods: "Mattress Protector" is not a mattress and "Bed Pad" is
-- not a bed, so those rules run first (priority 5-6). Conversely a genuine
-- mattress is often named for its cover ("Pressure Care Mattress Luxury
-- Quilted Cover"), so 'cover' is NOT an exclusion -- rule 5 catches true
-- covers by adjacency ("mattress cover") instead.
-- =============================================================================

create table if not exists public.category_rules (
  priority     integer primary key,
  top_level    text not null,
  subcategory  text not null,
  include_re   text not null,
  exclude_re   text,
  -- Optional extra requirement, matched against the family's clinical_use_case
  -- and descriptions. Used where the title alone cannot tell you what a product
  -- is: "ICARE M2 Medical Mattress" reads as a plain mattress, but its clinical
  -- text says "Pressure redistribution & skin protection".
  aux_re       text,
  note         text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

comment on table public.category_rules is
  'Ordered classification rules. Lowest priority number wins. Matched against the title with the brand removed.';

alter table public.product_families
  add column if not exists proposed_top_level  text,
  add column if not exists proposed_subcategory text,
  add column if not exists proposed_rule       integer,
  add column if not exists taxonomy_reviewed   boolean not null default false;

truncate public.category_rules;
insert into public.category_rules (priority, top_level, subcategory, include_re, exclude_re, aux_re, note) values
  (5 ,'Accessible & Consumables','Bedding Protectors','mattress protector|bed protector|mattress cover|encasement|waterproof sheet|kylie|draw sheet|bed pad|absorbent pad|underpad','pressure care|alternating',null,'Soft goods outrank furniture'),
  (6 ,'Accessible & Consumables','Incontinence, Briefs & Pads','incontinence (brief|pad|pant)|continence pad','mattress',null,null),
  (7 ,'Bathroom & Toileting','Toileting Aids','bed pan|bedpan|urinal|toileting aid',null,null,'Must beat the generic bed rule'),
  (10,'Bedroom & Comfort','Bed Accessories','(head|foot)\s*board|headboard|footboard|bed[ -]?end',null,null,'The Icare brand-name bug: these were pressure care'),
  (11,'Bedroom & Comfort','Bed Accessories','side rail|bed rail|bed stick|transfer pole|self help pole|\mpole\M|bedside grab rail|crook handle rail',null,null,null),
  (12,'Bedroom & Comfort','Bed Accessories','hand control|control holder|bracket|upgrade kit|castor|accessories pouch|blanket cradle',null,null,null),
  (13,'Seating & Chairs','Day Chairs & High Back Chairs','sleeper chair|chair[ -]bed|day chair|high back chair|princess chair|comfort chair',null,null,'Chair-beds are chairs'),
  (18,'Bedroom & Comfort','Mattresses, Dynamic & Alternating Air','alternating|dynamic mattress|air cell|air mattress|(mattress|overlay).*pump|pump.*(mattress|overlay)|versaflo','blood pressure',null,'Powered surfaces are their own class'),
  (19,'Bedroom & Comfort','Mattresses, Dynamic & Alternating Air','mattress|overlay|topper','protector|encasement|cover|\mpad\M','alternating|air cell|air pump','Dynamic per description'),
  (20,'Bedroom & Comfort','Mattresses, Pressure Care','(pressure|hybrid|gel).*(mattress|overlay|topper)|(mattress|overlay|topper).*(pressure|hybrid|gel)|pressure (care|relie|redistrib)|sheepskin (overlay|natural)','blood pressure|monitor|cuff|protector|encasement|cushion|\mseat\M|chair',null,'Excludes blood pressure monitors'),
  (23,'Bedroom & Comfort','Mattresses, Pressure Care','mattress|overlay|topper','protector|encasement|cover|\mpad\M','pressure redistribution|skin protection','Clinical text decides where the title cannot'),
  (28,'Bedroom & Comfort','Pillows & Positioners','wedge|lumbar support|leg raiser|pillow suspender',null,null,null),
  (30,'Bedroom & Comfort','Adjustable Beds','floorline|floor line|hi[ -]?lo|homecare bed|care bed|partner bed|nursing bed|hospital bed|adjustable bed|companion bed|community bed|\mbed\M','bed rail|bed stick|bed[ -]?end|headboard|footboard|mattress|overlay|underlay|table|pouch|bracket|upgrade kit|pad|protector|pole|castor|wedge|cradle|lumbar|transport kit|grab rail|chair',null,null),
  (40,'Bedroom & Comfort','Mattresses, Standard','mattress','protector|encasement|\mpad\M',null,null),
  (45,'Bedroom & Comfort','Pillows & Positioners','pillow|positioner|bolster|foot reliever',null,null,null),
  (46,'Bedroom & Comfort','Bedroom Furniture & Tables','overbed table|over bed table|bedside table|bedside locker|bedside cabinet',null,null,null),
  (49,'Mobility','Wheelchairs','tilt[ -]in[ -]space.*wheelchair|wheelchair.*tilt[ -]in[ -]space',null,null,'A tilt-in-space wheelchair is a wheelchair'),
  (50,'Seating & Chairs','Lift Recliner Chairs','lift (chair|recliner)|reclin','shower|commode',null,null),
  (51,'Seating & Chairs','Cushions & Pressure Seating','cushion|seat pad|roho|gel pad','bed |mattress',null,null),
  (52,'Seating & Chairs','Tilt-in-Space Chairs','tilt[ -]in[ -]space','wheelchair',null,null),
  (54,'Seating & Chairs','Stools & Perching','perching stool|perch stool','shower',null,null),
  (60,'Bathroom & Toileting','Shower Commodes','shower commode|commode',null,null,null),
  (61,'Bathroom & Toileting','Shower Stools & Chairs','shower (stool|chair|seat)|bath (stool|seat)|perching stool',null,null,null),
  (62,'Bathroom & Toileting','Over Toilet Frames','over toilet|toilet frame|toilet surround',null,null,null),
  (63,'Bathroom & Toileting','Raised Toilet Seats','raised toilet|toilet seat riser|toilet riser',null,null,null),
  (64,'Bathroom & Toileting','Bath Boards & Transfer Benches','bath board|transfer bench|bath lift',null,null,null),
  (65,'Bathroom & Toileting','Grab Rails','grab rail|grab bar|shower rail|safety rail|assistbar','bed',null,null),
  (66,'Bathroom & Toileting','Bathroom Safety','non slip|bath mat|shower mat|suction',null,null,null),
  (70,'Mobility','Power Wheelchairs','power (wheel)?chair|electric wheelchair',null,null,null),
  (71,'Mobility','Wheelchairs','wheelchair|transit chair|self propel','cushion|power|castor',null,null),
  (72,'Mobility','Mobility Scooters','scooter',null,null,null),
  (73,'Mobility','Walkers & Rollators','rollator|walker|wheeled walk',null,null,null),
  (74,'Mobility','Walking Frames & A-Frames','walking frame|a[ -]frame|pick up frame',null,null,null),
  (75,'Mobility','Crutches & Canes','crutch|walking stick|\mcane\M|quad stick',null,null,null),
  (76,'Mobility','Hoists & Stand Aids','hoist|stand aid|sling|standing aid',null,null,null),
  (77,'Mobility','Transfer Aids','transfer (belt|board|disc|aid)|walk belt|slide sheet|turntable',null,null,'Walk belts were under Wheelchairs'),
  (78,'Mobility','Ramps & Thresholds','ramp|threshold',null,null,null),
  (79,'Mobility','Postural & Positioning','postural|positioning|lateral support|harness','bed|mattress',null,null),
  (87,'Accessible & Consumables','Gloves & PPE','glove|apron|mask|ppe',null,null,null),
  (88,'Home & Safety','Falls Prevention','falls|sensor mat|alarm',null,null,null),
  (89,'Home & Safety','Kitchen & Dining Aids','kitchen|cutlery|plate|cup|dining',null,null,null),
  (90,'Home & Safety','Household Aids','blood pressure|monitor|thermometer|scale|reacher|dressing aid|sock aid|exerciser',null,null,'Blood pressure monitors land here, not pressure care');

-- Title with the brand removed. The whole Icare failure is fixed by this.
create or replace function public.sm_match_text(p_brand text, p_title text)
returns text
language sql immutable parallel safe set search_path = ''
as $$
  select btrim(regexp_replace(
    coalesce(p_title,''),
    '(?i)' || regexp_replace(coalesce(p_brand,'~~none~~'), '([.^$*+?()\[\]{}|\\])', '\\\1', 'g'),
    ' ', 'g'));
$$;

-- Writes a PROPOSAL only. Never touches the live category columns.
--
-- UPDATE ... FROM LATERAL cannot reference the update target, so the match is
-- computed in a CTE first. LEFT JOIN LATERAL so a family that matches no rule
-- gets a NULL proposal and any stale proposal is cleared.
create or replace function public.propose_product_taxonomy()
returns table (proposed integer, unmatched integer)
language plpgsql security definer set search_path = ''
as $$
declare v_proposed integer; v_unmatched integer;
begin
  with proposals as (
    select pf.id, r.top_level, r.subcategory, r.priority
      from public.product_families pf
      left join lateral (
        select cr.top_level, cr.subcategory, cr.priority
          from public.category_rules cr
         where cr.is_active
           and public.sm_match_text(pf.brand, pf.title) ~* cr.include_re
           and (cr.exclude_re is null
                or public.sm_match_text(pf.brand, pf.title) !~* cr.exclude_re)
           -- aux_re is an ADDITIONAL requirement, never an alternative.
           -- Treating it as an alternative made rule 23 swallow every mattress
           -- before the standard-mattress rule could run.
           and (cr.aux_re is null or exists (
                 select 1 from public.products_categorized pc
                  where pc.family_id = pf.id
                    and concat_ws(' ', pc.clinical_use_case, pc.description_long,
                                  pc.description_short) ~* cr.aux_re))
         order by cr.priority
         limit 1
      ) r on true
     where pf.is_active
  )
  update public.product_families pf
     set proposed_top_level   = p.top_level,
         proposed_subcategory = p.subcategory,
         proposed_rule        = p.priority
    from proposals p
   where p.id = pf.id;

  get diagnostics v_proposed = row_count;

  select count(*) into v_unmatched
    from public.product_families
   where is_active and proposed_subcategory is null;

  return query select v_proposed - v_unmatched, v_unmatched;
end;
$$;

-- Everything the rules refused to classify. Work this queue by hand.
create or replace view public.taxonomy_review_queue as
  select id, slug, brand, title, top_level_category, subcategory, variant_count
    from public.product_families
   where is_active and proposed_subcategory is null and not taxonomy_reviewed
   order by variant_count desc;

-- Deliberate, separate step. Run only after the proposal has been reviewed.
create or replace function public.apply_taxonomy_proposal()
returns integer
language plpgsql security definer set search_path = ''
as $$
declare v_count integer;
begin
  update public.product_families
     set top_level_category = proposed_top_level,
         subcategory        = proposed_subcategory,
         updated_at         = now()
   where is_active
     and proposed_subcategory is not null
     and (top_level_category, subcategory)
         is distinct from (proposed_top_level, proposed_subcategory);
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke execute on function public.propose_product_taxonomy()  from public, anon, authenticated;
revoke execute on function public.apply_taxonomy_proposal()   from public, anon, authenticated;
revoke execute on function public.sm_match_text(text, text)   from public, anon, authenticated;
grant  execute on function public.propose_product_taxonomy()  to service_role;
grant  execute on function public.apply_taxonomy_proposal()   to service_role;

-- Internal configuration, not public API. Supabase's default privileges would
-- otherwise hand anon full DML on this table the moment it is created.
alter table public.category_rules enable row level security;
revoke all on public.category_rules from anon, authenticated;

-- =============================================================================
-- ROLLBACK
--   drop view if exists public.taxonomy_review_queue;
--   drop function if exists public.apply_taxonomy_proposal();
--   drop function if exists public.propose_product_taxonomy();
--   drop function if exists public.sm_match_text(text, text);
--   drop table if exists public.category_rules;
--   alter table public.product_families
--     drop column if exists proposed_top_level,
--     drop column if exists proposed_subcategory,
--     drop column if exists proposed_rule,
--     drop column if exists taxonomy_reviewed;
-- =============================================================================
