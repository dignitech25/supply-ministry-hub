import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const migration = readFileSync(
  new URL('../supabase/migrations/20260808070000_product_families_and_search.sql', import.meta.url),
  'utf8',
);

describe('product families migration security guards', () => {
  it('revokes PUBLIC access to the privileged rebuild function', () => {
    assert.ok(migration.includes(
      'revoke execute on function public.rebuild_product_families() from public, anon, authenticated;',
    ));
    assert.ok(migration.includes(
      'grant  execute on function public.rebuild_product_families() to service_role;',
    ));
  });

  it('runs public read RPCs with caller privileges', () => {
    assert.equal(migration.match(/security invoker/g)?.length, 2);
  });

  it('preserves live discounted pricing instead of silently taking the lower RRP', () => {
    assert.doesNotMatch(migration, /least\(pc\.price_rrp::numeric/);
    assert.ok(migration.includes(
      'coalesce(public.sm_safe_numeric(pc.price_discounted),',
    ));
  });

  it('recovers persisted family identity before matching editable titles', () => {
    const recovery = migration.indexOf('from private.product_family_variant_keys known');
    const titleUpdate = migration.indexOf('with linked_identity as');
    const titleUpsert = migration.indexOf('on conflict (brand, title) do update set');

    assert.ok(recovery > 0);
    assert.ok(titleUpdate > recovery);
    assert.ok(titleUpsert > titleUpdate);
  });
});
