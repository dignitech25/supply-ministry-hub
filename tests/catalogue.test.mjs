import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readFilterParam } from '../src/utils/catalogueFilters.ts';
import { buildProductSearchFilter, sanitiseFilterTerm } from '../src/utils/searchQuery.ts';
import {
  getEffectiveVariantPrice,
  parseCataloguePrice,
  selectDefaultPricedVariant,
} from '../src/utils/catalogueSelection.ts';
import { groupRepresentativeVariants } from '../supabase/functions/_shared/catalogueSelection.ts';

describe('catalogue URL filters', () => {
  it('preserves a real comma inside a subcategory', () => {
    const params = new URLSearchParams('subcategory=Mattresses%2C+Pressure+Care');
    assert.deepEqual(readFilterParam(params, 'subcategory', false), [
      'Mattresses, Pressure Care',
    ]);
  });

  it('reads repeated keys without corrupting either value', () => {
    const params = new URLSearchParams();
    params.append('subcategory', 'Mattresses, Pressure Care');
    params.append('subcategory', 'Beds');
    assert.deepEqual(readFilterParam(params, 'subcategory', false), [
      'Mattresses, Pressure Care',
      'Beds',
    ]);
  });

  it('continues to read legacy comma-separated brand links', () => {
    const params = new URLSearchParams('brand=Aspire,Aidacare');
    assert.deepEqual(readFilterParam(params, 'brand', true), ['Aspire', 'Aidacare']);
  });
});

describe('catalogue search filters', () => {
  it('neutralises PostgREST structural punctuation', () => {
    assert.equal(
      sanitiseFilterTerm('mattress, pressure (king)'),
      'mattress pressure king',
    );
  });

  it('builds one quoted clause per allowed column', () => {
    assert.equal(
      buildProductSearchFilter('mattress, pressure', ['title', 'sku']),
      'title.ilike."%mattress pressure%",sku.ilike."%mattress pressure%"',
    );
  });

  it('does not turn punctuation-only input into a match-all query', () => {
    assert.equal(buildProductSearchFilter('(),\\"', ['title']), null);
  });
});

describe('catalogue price and canonical selection', () => {
  it('coerces imported text prices to numbers', () => {
    assert.equal(parseCataloguePrice('1000'), 1000);
    assert.equal(parseCataloguePrice('not-a-price'), null);
  });

  it('treats the live discounted price as authoritative even above RRP', () => {
    assert.equal(
      getEffectiveVariantPrice({ priceDiscounted: 1000, priceRrp: 900 }),
      1000,
    );
  });

  it('uses the same deterministic canonical SKU in the client and sitemap', () => {
    const clientRows = [
      { sku: 'RRP-CHEAP', priceRrp: 700, priceDiscounted: 1000 },
      { sku: 'LIVE-CHEAP', priceRrp: 900, priceDiscounted: 800 },
    ];
    const sitemapRows = [
      {
        sku: 'RRP-CHEAP', brand: 'Aspire', title: 'Test Bed',
        price_rrp: 700, price_discounted: '1000',
      },
      {
        sku: 'LIVE-CHEAP', brand: 'Aspire', title: 'Test Bed',
        price_rrp: 900, price_discounted: '800',
      },
    ];

    const clientCanonical = selectDefaultPricedVariant(clientRows);
    const sitemapCanonical = groupRepresentativeVariants(sitemapRows)[0];

    assert.equal(clientCanonical.sku, 'LIVE-CHEAP');
    assert.equal(sitemapCanonical.sku, clientCanonical.sku);
  });

  it('breaks equal-price ties by SKU rather than response order', () => {
    const clientCanonical = selectDefaultPricedVariant([
      { sku: 'B', priceRrp: 800, priceDiscounted: null },
      { sku: 'A', priceRrp: 800, priceDiscounted: null },
    ]);
    const sitemapCanonical = groupRepresentativeVariants([
      { sku: 'B', brand: 'Aspire', title: 'Chair', price_rrp: 800, price_discounted: null },
      { sku: 'A', brand: 'Aspire', title: 'Chair', price_rrp: 800, price_discounted: null },
    ])[0];

    assert.equal(clientCanonical.sku, 'A');
    assert.equal(sitemapCanonical.sku, 'A');
  });
});
