-- =============================================================================
-- Taxonomy overrides + six new subcategories -- APPLIED to production 2026-08-08
--
-- Rules generalise; overrides decide. 140 families carried no category noun in
-- their title, so no keyword rule could ever reach them. Each row below was
-- read against its products_categorized product_type, subtype and description
-- before being assigned.
--
-- product_type is NOT trusted on its own. "Conni Anti Slip Floor Mat" is typed
-- Bed / Static and "ROHO Pump" is typed Mattress / Foam. It is a signal to be
-- cross-checked against the description, not an answer.
--
-- Six subcategories are introduced because the data demanded them:
--   Bedding & Linen               sheet sets, WonderSheet, fitted sheets
--   Pressure Care Accessories     pumps, underlays, heel protectors, pads
--   Seating Accessories           armrests, backrests, headrests, handsets
--   Wheelchair Accessories        anti-tip bars
--   Personal Care & Bathing Aids  the Etac Beauty range, long-handled sponge
--   Heat & Cold Therapy           Lupin heat packs, Icare Hydrosense range
--
-- Result: the review queue went from 140 to 0. All 513 families now carry a
-- category that a human actually decided.
-- =============================================================================

create table if not exists public.category_overrides (
  brand        text not null,
  title        text not null,
  top_level    text not null,
  subcategory  text not null,
  note         text,
  created_at   timestamptz not null default now(),
  primary key (brand, title)
);

comment on table public.category_overrides is
  'Curated per-family taxonomy decisions. Applied after category_rules and always wins.';

alter table public.category_overrides enable row level security;
revoke all on public.category_overrides from anon, authenticated;

truncate public.category_overrides;
insert into public.category_overrides (brand, title, top_level, subcategory, note) values
  ('Conni','Conni Allrounder Pad','Accessible & Consumables','Bedding Protectors',null),
  ('Conni','Conni Micro-Plush Waterproof Fitted Sheet','Accessible & Consumables','Bedding Protectors','Described as a waterproof mattress protector'),
  ('Conni','Conni Chair Pad','Accessible & Consumables','Incontinence, Briefs & Pads',null),
  ('Aspire','Bath Sponge - Long Handled','Bathroom & Toileting','Personal Care & Bathing Aids',null),
  ('Etac','Etac Beauty Back Washer','Bathroom & Toileting','Personal Care & Bathing Aids',null),
  ('Etac','Etac Beauty Back Washer Replacement Cloths, 2 Pack','Bathroom & Toileting','Personal Care & Bathing Aids',null),
  ('Etac','Etac Beauty Body Washer','Bathroom & Toileting','Personal Care & Bathing Aids',null),
  ('Etac','Etac Beauty Body Washer Replacement Cloths, 2 Pack','Bathroom & Toileting','Personal Care & Bathing Aids',null),
  ('Etac','Etac Beauty Comb','Bathroom & Toileting','Personal Care & Bathing Aids',null),
  ('Etac','Etac Beauty Hair Washer','Bathroom & Toileting','Personal Care & Bathing Aids',null),
  ('Etac','Etac Beauty Hairbrush','Bathroom & Toileting','Personal Care & Bathing Aids',null),
  ('Aspire','Aspire Toilet Seat Raiser - No Lid','Bathroom & Toileting','Raised Toilet Seats',null),
  ('Aspire','Aspire Toilet Seat Raiser with Lid','Bathroom & Toileting','Raised Toilet Seats',null),
  ('Betterliving','BetterLiving Adjustable Toilet Seat Raiser','Bathroom & Toileting','Raised Toilet Seats',null),
  ('Etac','Etac Cloo Toilet Seat Raiser with Arm Supports','Bathroom & Toileting','Raised Toilet Seats',null),
  ('Aspire','Aspire ComfiMotion Activ Care Adjustable Bed','Bedroom & Comfort','Adjustable Beds',null),
  ('Avante','Ergoadjust Care Adjustable Bed','Bedroom & Comfort','Adjustable Beds',null),
  ('Avante','Ergoadjust Delux Adjustable Bed','Bedroom & Comfort','Adjustable Beds',null),
  ('Avante','ErgoAdjust Lo Adjustable Bed Pewter','Bedroom & Comfort','Adjustable Beds',null),
  ('Avante','HiLo Flex Adjustable Base','Bedroom & Comfort','Adjustable Beds',null),
  ('Avante','LoLo Adjustable Bed','Bedroom & Comfort','Adjustable Beds',null),
  ('Avante','Smartflex 2 Adjustable Bed','Bedroom & Comfort','Adjustable Beds',null),
  ('Avante','Smartflex 3 Adjustable Bed','Bedroom & Comfort','Adjustable Beds',null),
  ('Avante','Ultimate Ensemble Base','Bedroom & Comfort','Adjustable Beds','Bed base for all mattresses'),
  ('Avante','Ultimate Flex Adjustable Bed','Bedroom & Comfort','Adjustable Beds',null),
  ('Icare','ICARE Companion Base','Bedroom & Comfort','Adjustable Beds',null),
  ('Icare','ICARE IC111','Bedroom & Comfort','Adjustable Beds','Description: "The Essentials Homecare Bed"'),
  ('Aspire','Aspire Bed Cradle - Adjustable Treated Steel','Bedroom & Comfort','Bed Accessories',null),
  ('Aspire','Aspire Lifestyle Community Bed Transport Kit','Bedroom & Comfort','Bed Accessories',null),
  ('Aspire','BATTERY BACKUP','Bedroom & Comfort','Bed Accessories','For ComfiMotion adjustable beds'),
  ('Aspire','FL250 Folding Assist Bar','Bedroom & Comfort','Bed Accessories',null),
  ('Avante','Smartflex 3 Glides','Bedroom & Comfort','Bed Accessories','Bed glide part'),
  ('Icare','iCare Rail Cover','Bedroom & Comfort','Bed Accessories',null),
  ('Avante','Microfibre Sheet Sets','Bedroom & Comfort','Bedding & Linen',null),
  ('Icare','Icare Extra Long Sheet Set','Bedroom & Comfort','Bedding & Linen','Fits Icare profiling beds'),
  ('Wondersheet','WonderSheet +Plus (fitted sheet - 35cm depth)','Bedroom & Comfort','Bedding & Linen',null),
  ('Wondersheet','WonderSheet +Plus fitted sheet - 45cm depth','Bedroom & Comfort','Bedding & Linen',null),
  ('Wondersheet','WonderSheet fitted sheet - 35cm depth','Bedroom & Comfort','Bedding & Linen',null),
  ('Wondersheet','WonderSheet fitted sheet - 45cm depth','Bedroom & Comfort','Bedding & Linen','Satin panel aids bed mobility; arguably also a transfer aid'),
  ('Aspire','Aspire Overchair Table Extra Wide - Laminate Top Beech','Bedroom & Comfort','Bedroom Furniture & Tables',null),
  ('Icare','Icare Bedside Attachment Table','Bedroom & Comfort','Bedroom Furniture & Tables',null),
  ('Icare','Icare Folding Tray Attachment','Bedroom & Comfort','Bedroom Furniture & Tables',null),
  ('Icare','ICARE Organiser Tray','Bedroom & Comfort','Bedroom Furniture & Tables',null),
  ('Aspire','Aspire Active Air ACUTE 8 w/ turnassist','Bedroom & Comfort','Mattresses, Dynamic & Alternating Air','1 in 3 cell alternation cycle'),
  ('Forte','ICON MAXX 350KG','Bedroom & Comfort','Mattresses, Pressure Care','Bariatric foam mattress, pressure care cover'),
  ('Forte','ICON MAXX 500KG','Bedroom & Comfort','Mattresses, Pressure Care',null),
  ('Oscar','Health Flex - With Side Walls Firm','Bedroom & Comfort','Mattresses, Standard',null),
  ('Oscar','Health Flex - With Side Walls Medium','Bedroom & Comfort','Mattresses, Standard',null),
  ('Oscar','Health Flex - With Side Walls Plush','Bedroom & Comfort','Mattresses, Standard',null),
  ('Icare','Icare Reform Knee Support','Bedroom & Comfort','Pillows & Positioners','Raises knees in supine'),
  ('Therapeutic Pillow','Knee Raiser Support','Bedroom & Comfort','Pillows & Positioners',null),
  ('Therapeutic Pillow','Knee Relaxer Support','Bedroom & Comfort','Pillows & Positioners',null),
  ('Aspire','Aspire Heel Protection','Bedroom & Comfort','Pressure Care Accessories',null),
  ('Aspire','Aspire Lifecomfort Digital Pump','Bedroom & Comfort','Pressure Care Accessories',null),
  ('Aspire','Aspire Lifecomfort Pressure Safety Underlay - King Single','Bedroom & Comfort','Pressure Care Accessories',null),
  ('Aspire','Aspire Lifecomfort Pressure Safety Underlay - Single','Bedroom & Comfort','Pressure Care Accessories',null),
  ('Aspire','Aspire Rapid Inflation Turbo Pump','Bedroom & Comfort','Pressure Care Accessories',null),
  ('Betterliving','BetterLiving Silicone Fibre Heel Protectors','Bedroom & Comfort','Pressure Care Accessories',null),
  ('Icare','Icare Pressure Pad','Bedroom & Comfort','Pressure Care Accessories',null),
  ('Roho','ROHO Pump - Standard','Bedroom & Comfort','Pressure Care Accessories','Typed Mattress/Foam upstream; it is a pump'),
  ('Aspire','Aspire Lifecomfort Fall Safety Mat','Home & Safety','Falls Prevention',null),
  ('Betterliving','BetterLiving Multi Function Light','Home & Safety','Falls Prevention','Marketed for falls risk'),
  ('Betterliving','BetterLiving Portable Sensor Light','Home & Safety','Falls Prevention',null),
  ('Betterliving','BetterLiving Portable Sensor Strip Light','Home & Safety','Falls Prevention',null),
  ('Betterliving','BetterLiving Toilet Bowl Night Light','Home & Safety','Falls Prevention',null),
  ('Betterliving','BetterLiving Touch Lamp','Home & Safety','Falls Prevention',null),
  ('Conni','Conni Anti Slip Floor Mat','Home & Safety','Falls Prevention','Description: "prevent trips and slips"; typed Bed/Static upstream'),
  ('Gripsox','GripSox Anklet Socks','Home & Safety','Falls Prevention','Non-slip socks for high falls risk'),
  ('Gripsox','GripSox Stretch Top','Home & Safety','Falls Prevention',null),
  ('Icare','Hydrosense Back / Shoulder Vest','Home & Safety','Heat & Cold Therapy',null),
  ('Icare','Hydrosense Dual Function Splitter','Home & Safety','Heat & Cold Therapy',null),
  ('Icare','Hydrosense Foot And Leg Cuff','Home & Safety','Heat & Cold Therapy',null),
  ('Icare','Hydrosense Mattress Pad','Home & Safety','Heat & Cold Therapy',null),
  ('Icare','Hydrosense Neck / Limb Head Wrap','Home & Safety','Heat & Cold Therapy',null),
  ('Icare','Hydrosense PVC Multi-Use Pad','Home & Safety','Heat & Cold Therapy',null),
  ('Icare','Hydrosense System Unit','Home & Safety','Heat & Cold Therapy',null),
  ('Therapeutic Pillow','Natural Lupin Heat Pack - Square Heating Pad','Home & Safety','Heat & Cold Therapy',null),
  ('Therapeutic Pillow','Natural Lupin Heat Pack for Neck & Shoulders','Home & Safety','Heat & Cold Therapy',null),
  ('Therapeutic Pillow','Natural Lupin Pack - Hand Mitt','Home & Safety','Heat & Cold Therapy',null),
  ('Therapeutic Pillow','Natural Lupin Pack - Lower Back Heat Wrap','Home & Safety','Heat & Cold Therapy',null),
  ('Therapeutic Pillow','Natural Lupin Pack - Rectangle Heating Pad','Home & Safety','Heat & Cold Therapy',null),
  ('Dycem','Dycem Anchorpad Rectangle','Home & Safety','Household Aids',null),
  ('Etac','ETAC Uni Turner, Universal Grip','Home & Safety','Household Aids',null),
  ('Aspire','Aspire Meal Trolley','Home & Safety','Kitchen & Dining Aids',null),
  ('Dycem','Dycem Non-Slip Jar Opener','Home & Safety','Kitchen & Dining Aids',null),
  ('Uccello','Uccello Tipping Kettle','Home & Safety','Kitchen & Dining Aids',null),
  ('Aspire','Aspire A150F Aluminium Folding Patient Lifter','Mobility','Hoists & Stand Aids',null),
  ('Aspire','Aspire Star Patient Mover','Mobility','Transfer Aids','Sit-to-stand transfer'),
  ('Aspire','Standing and Transport Aid - Aspire GO Turner','Mobility','Transfer Aids',null),
  ('Aspire','ASPIRE Vogue Carbon Fibre - Short Sapphire Blue','Mobility','Walkers & Rollators','Description says "Aspire Vogue Walkers"'),
  ('Aspire','ASPIRE Vogue Carbon Fibre - Tall Emerald Green','Mobility','Walkers & Rollators',null),
  ('Aspire','Aspire WChair Anti Tip Bar - Evoke2/Assist2/Transit2/Rehab RS/Rehab RX','Mobility','Wheelchair Accessories',null),
  ('Aspire','Aspire Assist 2','Mobility','Wheelchairs','Transport chair'),
  ('Aspire','Aspire Assist 2 Deluxe Vinyl','Mobility','Wheelchairs',null),
  ('Aspire','Aspire Lite','Mobility','Wheelchairs',null),
  ('Aspire','Aspire Lite Transit','Mobility','Wheelchairs',null),
  ('Aspire','Aspire Transit 2','Mobility','Wheelchairs',null),
  ('Aspire','Aspire VIDA - Attendant Propelled','Mobility','Wheelchairs',null),
  ('Icare','Icare Reform Full Back Support','Seating & Chairs','Cushions & Pressure Seating',null),
  ('Icare','Icare Reform Low Back Support','Seating & Chairs','Cushions & Pressure Seating',null),
  ('Icare','Icare Reform Neck Support','Seating & Chairs','Cushions & Pressure Seating',null),
  ('Icare','Icare Reform Seat Support','Seating & Chairs','Cushions & Pressure Seating',null),
  ('Therapeutic Pillow','Contoured Back Support','Seating & Chairs','Cushions & Pressure Seating',null),
  ('Therapeutic Pillow','FloBac Back Support with No Seat - Model 2','Seating & Chairs','Cushions & Pressure Seating',null),
  ('Therapeutic Pillow','FloBac Back Support with Seat - Model 3','Seating & Chairs','Cushions & Pressure Seating',null),
  ('Therapeutic Pillow','Koala Komfort Back Support','Seating & Chairs','Cushions & Pressure Seating',null),
  ('Therapeutic Pillow','MemoGel Butterfly Support','Seating & Chairs','Cushions & Pressure Seating',null),
  ('Therapeutic Pillow','Spine Saver Lumbar Roll','Seating & Chairs','Cushions & Pressure Seating',null),
  ('Therapeutic Pillow','Total Spinal Support','Seating & Chairs','Cushions & Pressure Seating',null),
  ('Vicair','Vicair Adjuster O2 with Incotec Cover','Seating & Chairs','Cushions & Pressure Seating',null),
  ('Vicair','Vicair Centre Relief O2 incl Incotec Cover','Seating & Chairs','Cushions & Pressure Seating',null),
  ('Aspire','Aspire Shell Chair 450mm','Seating & Chairs','Day Chairs & High Back Chairs',null),
  ('Configura','Configura Advance Electric Chair','Seating & Chairs','Day Chairs & High Back Chairs','Specialist chair'),
  ('Configura','Configura Advance Manual Chair','Seating & Chairs','Day Chairs & High Back Chairs',null),
  ('Configura','Configura Bariatric Chair, Standard, 254kg 16 inch','Seating & Chairs','Lift Recliner Chairs',null),
  ('Configura','Configura Bariatric Chair, Standard, 254kg 18 inch','Seating & Chairs','Lift Recliner Chairs',null),
  ('Configura','Configura Bariatric Chair, Standard, 317kg 18 inch','Seating & Chairs','Lift Recliner Chairs',null),
  ('Icare','Icare VMotion Lifter Chair Firm','Seating & Chairs','Lift Recliner Chairs','Rise and recline chair'),
  ('Icare','Icare VMotion Lifter Chair Medium','Seating & Chairs','Lift Recliner Chairs',null),
  ('Icare','Icare VMotion Lifter Chair Soft','Seating & Chairs','Lift Recliner Chairs',null),
  ('Theorem','Kennington Twin Seat Sofa - Dual Motor Stonewash','Seating & Chairs','Lift Recliner Chairs',null),
  ('Theorem','Somerset - Rainer (Ocean)','Seating & Chairs','Lift Recliner Chairs',null),
  ('Aspire','Aspire Chair Protector - Universal','Seating & Chairs','Seating Accessories',null),
  ('Aspire','Aspire Padded Footrest - Champagne Vinyl','Seating & Chairs','Seating Accessories',null),
  ('Aspire','Aspire Padded Footrest - Slate Vinyl','Seating & Chairs','Seating Accessories',null),
  ('Aspire','Aspire PostureFit - Advance Immersion Backrest','Seating & Chairs','Seating Accessories',null),
  ('Aspire','Aspire PostureFit - Channel Legrest','Seating & Chairs','Seating Accessories',null),
  ('Aspire','Aspire PostureFit - Classic Backrest','Seating & Chairs','Seating Accessories',null),
  ('Aspire','Aspire PostureFit - Profiled Headrest','Seating & Chairs','Seating Accessories',null),
  ('Aspire','TRANSPORT LEGS WITH WHEELS','Seating & Chairs','Seating Accessories',null),
  ('Configura','Configura Advance Cocoon Backrest','Seating & Chairs','Seating Accessories',null),
  ('Configura','Configura Comfort 2 Button Handset','Seating & Chairs','Seating Accessories',null),
  ('Configura','Configura Comfort Dropdown Armrest','Seating & Chairs','Seating Accessories',null),
  ('Configura','Configura Comfort Height Adjustment Kit','Seating & Chairs','Seating Accessories',null),
  ('Configura','Configura Comfort Legrest Channel','Seating & Chairs','Seating Accessories',null),
  ('Configura','Configura Comfort Profiled Headrest','Seating & Chairs','Seating Accessories',null),
  ('Configura','Configura Dropdown Armrest','Seating & Chairs','Seating Accessories',null),
  ('Configura','Configura Handset Holder','Seating & Chairs','Seating Accessories',null),
  ('Configura','Configura R/R Depth Adjustment Kit, All Sizes','Seating & Chairs','Seating Accessories',null),
  ('Icare','Icare VMotion Inseat','Seating & Chairs','Seating Accessories',null);

-- Overrides win over rules. Writes to the proposal columns only; making them
-- live still requires apply_taxonomy_proposal().
create or replace function public.apply_category_overrides()
returns integer
language plpgsql security definer set search_path = ''
as $$
declare v_count integer;
begin
  update public.product_families pf
     set proposed_top_level   = o.top_level,
         proposed_subcategory = o.subcategory,
         proposed_rule        = -1
    from public.category_overrides o
   where pf.is_active
     and pf.brand = o.brand
     and pf.title = o.title;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke execute on function public.apply_category_overrides() from public, anon, authenticated;
grant  execute on function public.apply_category_overrides() to service_role;

-- =============================================================================
-- ROLLBACK
--   drop function if exists public.apply_category_overrides();
--   drop table if exists public.category_overrides;
--   -- then re-run propose_product_taxonomy() to fall back to rules alone.
-- =============================================================================
