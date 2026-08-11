import { createClient } from '@supabase/supabase-js';
const url = process.env.VITE_SUPABASE_URL!;
const key = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(url, key);
const { data, error } = await supabase
  .from('microsite_products')
  .select('product_code, product_name, clinical_group, category, family_slug')
  .eq('collection', 'medhealth')
  .eq('status', 'priced')
  .order('sort_order', { ascending: true });
if (error) { console.error(error); process.exit(1); }
console.log('Total:', data?.length);
for (const p of data || []) {
  const group = (p.clinical_group || p.category || '').toLowerCase();
  const name = p.product_name.toLowerCase();
  if (group.includes('bed') || group.includes('mattress') || group.includes('sleep') || name.includes('bed') || name.includes('recliner') || name.includes('rollator') || name.includes('rail') || name.includes('wedge')) {
    console.log(`${p.product_code}\t${p.product_name}\t${p.clinical_group}\t${p.category}\t${p.family_slug || ''}`);
  }
}
