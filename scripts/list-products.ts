import { createClient } from '@supabase/supabase-js';
const url = process.env.VITE_SUPABASE_URL!;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
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
  const name = p.product_name.toLowerCase();
  const group = (p.clinical_group || p.category || '').toLowerCase();
  if (name.includes('chair') || name.includes('recliner') || name.includes('seat') || name.includes('lift')) {
    console.log(`${p.product_code}\t${p.product_name}\t${p.clinical_group}\t${p.category}\t${p.family_slug || ''}`);
  }
}
