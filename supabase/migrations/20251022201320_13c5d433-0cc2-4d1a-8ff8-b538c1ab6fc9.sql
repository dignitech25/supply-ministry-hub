-- Update category names to match products_categorized top_level_category values
-- This ensures filtering works correctly

-- First, let's update existing categories to match the actual product data
UPDATE public.categories
SET 
  name = 'Mobility',
  slug = 'mobility',
  description = 'Wheelchairs, walkers, mobility scooters, and mobility aids for enhanced independence'
WHERE name = 'Wheelchairs' OR slug = 'wheelchairs';

UPDATE public.categories
SET 
  name = 'Bathroom & Toileting',
  slug = 'bathroom-toileting',
  description = 'Bathroom safety equipment, shower chairs, commodes, and toileting aids'
WHERE name = 'Bathroom Safety' OR slug = 'bathroom-safety';

UPDATE public.categories
SET 
  name = 'Bedroom & Comfort',
  slug = 'bedroom-comfort',
  description = 'Beds, mattresses, pressure care, and bedroom comfort solutions'
WHERE name = 'Bedroom Equipment' OR slug = 'bedroom-equipment';

UPDATE public.categories
SET 
  name = 'Home & Safety',
  slug = 'home-safety',
  description = 'Home safety equipment, fall prevention, and security solutions'
WHERE name = 'Home Safety' OR slug = 'home-safety';

-- Add missing categories that exist in products_categorized
INSERT INTO public.categories (name, slug, description, is_active, sort_order)
VALUES 
  ('Seating & Chairs', 'seating-chairs', 'Specialist seating, office chairs, recliners, and positioning equipment', true, 5),
  ('Accessible & Consumables', 'accessible-consumables', 'Consumable products and accessible daily living aids', true, 6)
ON CONFLICT (slug) DO NOTHING;