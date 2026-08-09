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

  it('strips the DML grants Supabase adds to every new public table', () => {
    // Supabase sets `alter default privileges in schema public grant all on
    // tables to anon, authenticated, service_role`, so product_families was
    // created on production with anon holding INSERT/UPDATE/DELETE. RLS denied
    // the writes, but only because a single SELECT policy happened to be the
    // sole policy -- the grants themselves have to go.
    assert.ok(migration.includes(
      'revoke insert, update, delete, truncate, references, trigger\n  on public.product_families from anon, authenticated;',
    ));
    assert.ok(migration.includes(
      'grant select on table public.product_families to anon, authenticated;',
    ));
  });

  it('matches LIKE metacharacters in search input literally', () => {
    // Verified on PostgreSQL 17.10: before this escaping, a query of '%'
    // expanded to ILIKE '%%%' and returned every active family. That both
    // misleads the shopper and erases the genuine zero-result signal that
    // catalogue-gap reporting is meant to collect.
    assert.ok(migration.includes("'%', '\\%'"), 'percent must be escaped');
    assert.ok(migration.includes("'_', '\\_'"), 'underscore must be escaped');

    // Every ILIKE against user input must consume the escaped pattern.
    assert.doesNotMatch(migration, /ilike '%' \|\| params\.q \|\| '%'/);
    assert.doesNotMatch(migration, /ilike '%' \|\| \(select q from params\) \|\| '%'/);
    assert.equal(migration.match(/ilike[\s\S]{0,40}?escape '\\'/g)?.length, 3);
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
