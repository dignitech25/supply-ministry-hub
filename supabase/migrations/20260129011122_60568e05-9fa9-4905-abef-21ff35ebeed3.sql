UPDATE public.products_categorized
SET 
  top_level_category = 'Bedroom & Comfort',
  subcategory = 'Bed Accessories',
  category_path = 'Bedroom & Comfort > Bed Accessories',
  category_confidence = 'high',
  category_rule = 'manual_correction'
WHERE sku = 'BEB046520';