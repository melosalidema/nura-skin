/* ============================================================
   NŪRA SKIN — pure-logic tests (node --test)
   Loads assets/js/data.js in a VM with a window stub and
   asserts the catalogue, filters and routine rules.
   Run: node --test
   ============================================================ */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';
import assert from 'node:assert/strict';

function loadNura() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(readFileSync(new URL('../assets/js/data.js', import.meta.url), 'utf8'), ctx);
  return ctx.window.NURA;
}
const N = loadNura();

test('catalogue loads 8 products', () => {
  assert.equal(N.PRODUCTS.length, 8);
});

test('byId resolves a product', () => {
  assert.equal(N.byId('dewdrop-serum').name, 'Dewdrop Hydrating Serum');
});

test('every product step is an integer in 0..5', () => {
  for (const p of N.PRODUCTS) {
    assert.ok(Number.isInteger(p.step), `${p.id} step not integer: ${p.step}`);
    assert.ok(p.step >= 0 && p.step <= 5, `${p.id} step out of range: ${p.step}`);
  }
});

test('every product has a stage name', () => {
  for (const p of N.PRODUCTS) {
    assert.ok(typeof p.stage === 'string' && p.stage.length > 0, `${p.id} missing stage`);
  }
});

test('filterProducts exposes Oil type', () => {
  const oil = N.filterProducts(N.PRODUCTS, { type: 'oil' });
  assert.ok(oil.find((p) => p.id === 'golden-hour-oil'), 'oil filter must include Golden Hour');
});

test('filterProducts exposes Toner type', () => {
  const toner = N.filterProducts(N.PRODUCTS, { type: 'toner' });
  assert.ok(toner.find((p) => p.id === 'clarity-toner'), 'toner filter must include Clarity');
});

test('filterProducts filters by skin type', () => {
  const oily = N.filterProducts(N.PRODUCTS, { skin: 'oily' });
  assert.ok(oily.every((p) => p.skinTypes.includes('oily') || p.skinTypes.includes('all')));
  assert.ok(oily.length > 0);
});

test('filterProducts filters by availability', () => {
  const inStock = N.filterProducts(N.PRODUCTS, { inStock: true });
  assert.ok(inStock.length > 0);
  assert.ok(inStock.every((p) => p.variants.some((v) => v.stock > 0)));
});

test('routine: outputs unique products in canonical step order', () => {
  for (const goal of ['minimal', 'layered', 'reset']) {
    for (const type of N.TYPES.map((t) => t.id)) {
      const list = N.buildRoutine({ concern: 'texture', type, goal });
      const ids = list.map((o) => o.id);
      assert.equal(new Set(ids).size, ids.length, `duplicate product for ${type}/${goal}`);
      const steps = list.map((o) => N.byId(o.id).step);
      const sorted = steps.slice().sort((a, b) => a - b);
      assert.deepEqual(steps, sorted, `not in step order for ${type}/${goal}`);
    }
  }
});

test('routine: every result includes SPF', () => {
  for (const type of N.TYPES.map((t) => t.id)) {
    const list = N.buildRoutine({ concern: 'dehydration', type, goal: 'minimal' });
    assert.ok(list.find((o) => o.id === 'pure-shield-spf'), `SPF missing for type ${type}`);
  }
});

test('routine totals apply the bundle discount', () => {
  const list = [{ id: 'cloudmilk-cleanser' }, { id: 'dewdrop-serum' }];
  const t = N.routineTotals(list);
  assert.equal(t.full, 38 + 64);
  assert.equal(t.bundle, Math.round(102 * 0.85 * 100) / 100);
});

test('every glossary entry is atlas-ready', () => {
  for (const g of N.GLOSSARY) {
    assert.ok(g.slug && /^[a-z0-9-]+$/.test(g.slug), `${g.n} bad slug`);
    assert.ok(typeof g.type === 'string' && g.type, `${g.n} missing type`);
    assert.ok(Array.isArray(g.products), `${g.n} missing products`);
  }
});

test('glossary maps actives to the products that contain them', () => {
  const squalane = N.GLOSSARY.find((g) => g.n === 'Squalane');
  assert.ok(squalane.products.includes('golden-hour-oil'), 'squalane should map to Golden Hour Oil');
  const ha = N.GLOSSARY.find((g) => g.n === 'Hyaluronic Acid');
  assert.ok(ha.products.includes('dewdrop-serum'), 'HA should map to Dewdrop');
});

test('pricePerMl computes from the first in-stock variant', () => {
  const p = N.byId('dewdrop-serum'); // 30 ml at $64
  assert.equal(Math.round(N.pricePerMl(p) * 100) / 100, Math.round((64 / 30) * 100) / 100);
});
