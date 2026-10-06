/* shop page — filtering, sorting, URL state */
(function () {
  'use strict';
  const N = window.NURA, UI = window.UI;
  const $ = (s) => document.querySelector(s);

  const TYPES = [
    { id: 'all', label: 'All' },
    { id: 'cleanser', label: 'Cleansers' },
    { id: 'toner', label: 'Toners' },
    { id: 'serum', label: 'Serums' },
    { id: 'treatment', label: 'Treatments' },
    { id: 'moisturiser', label: 'Moisturisers' },
    { id: 'oil', label: 'Face Oils' },
    { id: 'mask', label: 'Masks' },
    { id: 'spf', label: 'SPF' }
  ];
  const CONCERNS = [
    { id: 'all', label: 'Every concern' },
    { id: 'dehydration', label: 'Dehydration', d: 'Dull, tight skin that drinks everything we give it' },
    { id: 'fine-lines', label: 'Fine lines', d: 'Firmness and texture change starting to show' },
    { id: 'pigmentation', label: 'Pigmentation', d: 'Uneven tone, sun spots and post-blemish shadow' },
    { id: 'texture', label: 'Texture', d: 'Roughness, congestion and visible pores' },
    { id: 'sensitivity', label: 'Sensitivity', d: 'Redness, stinging and a weakened barrier' },
    { id: 'dullness', label: 'Dullness', d: 'Skin that looks tired whatever you do' }
  ];
  const SKINS = [
    { id: 'all', label: 'Every skin type' },
    { id: 'dry', label: 'Dry' },
    { id: 'normal', label: 'Balanced' },
    { id: 'combination', label: 'Combination' },
    { id: 'oily', label: 'Oily' },
    { id: 'sensitive', label: 'Sensitive' }
  ];

  const state = { type: 'all', concern: 'all', skin: 'all', inStock: false, sort: 'featured' };

  const readURL = () => {
    const p = new URLSearchParams(location.search);
    if (p.get('f')) state.type = p.get('f');
    if (p.get('c')) state.concern = p.get('c');
    if (p.get('skin')) state.skin = p.get('skin');
    if (p.get('stock') === '1') state.inStock = true;
    if (p.get('sort')) state.sort = p.get('sort');
  };
  const writeURL = () => {
    const p = new URLSearchParams();
    if (state.type !== 'all') p.set('f', state.type);
    if (state.concern !== 'all') p.set('c', state.concern);
    if (state.skin !== 'all') p.set('skin', state.skin);
    if (state.inStock) p.set('stock', '1');
    if (state.sort !== 'featured') p.set('sort', state.sort);
    const q = p.toString();
    history.replaceState(null, '', q ? '?' + q : location.pathname);
  };

  const sorted = (list) => {
    const l = list.slice();
    if (state.sort === 'price-asc') l.sort((a, b) => a.price - b.price);
    if (state.sort === 'price-desc') l.sort((a, b) => b.price - a.price);
    if (state.sort === 'rating') l.sort((a, b) => b.rating - a.rating);
    if (state.sort === 'name') l.sort((a, b) => a.name.localeCompare(b.name));
    if (state.sort === 'featured') l.sort((a, b) => (b.badges.length ? 1 : 0) - (a.badges.length ? 1 : 0) || b.rating - a.rating);
    return l;
  };

  function chips(host, items, key) {
    host.innerHTML = items.map((c) =>
      '<button class="chip" type="button" data-chip="' + key + '" data-v="' + c.id + '" aria-pressed="' + (String(state[key]) === String(c.id)) + '">' + c.label + '</button>'
    ).join('');
    host.querySelectorAll('[data-chip]').forEach((b) => b.addEventListener('click', () => {
      state[key] = b.getAttribute('data-v');
      host.querySelectorAll('[data-chip]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      render();
    }));
  }

  function syncStock() {
    const box = $('#f-stock');
    if (!box) return;
    box.setAttribute('aria-pressed', String(state.inStock));
    box.classList.toggle('is-on', state.inStock);
  }

  function render() {
    const list = sorted(N.filterProducts(N.PRODUCTS, state));
    const grid = $('#grid');
    grid.innerHTML = list.map((p) => UI.cardHTML(p)).join('');
    UI.mountStagger(grid);
    UI.mountCardEvents(grid);
    UI.mountReveals();
    $('#empty').hidden = list.length > 0;
    grid.hidden = list.length === 0;
    $('#count').textContent = list.length + (list.length === 1 ? ' product' : ' products');
    writeURL();
  }

  function concernGrid() {
    const host = $('#concern-grid');
    host.innerHTML =
      '<div class="assay__head" aria-hidden="true"><span>Concern</span><span>Formulas</span><span>What it looks like</span></div>' +
      CONCERNS.filter((c) => c.id !== 'all').map((c) => {
        const n = N.PRODUCTS.filter((p) => p.concerns.indexOf(c.id) !== -1).length;
        return '<a class="assay__row assay__row--link" href="concern.html?c=' + c.id + '">' +
          '<span class="assay__n">' + c.label + '</span>' +
          '<span class="assay__pct">' + n + '</span>' +
          '<span class="assay__d">' + c.d + '</span></a>';
      }).join('');
  }

  readURL();
  chips($('#f-type'), TYPES, 'type');
  chips($('#f-concern'), CONCERNS, 'concern');
  const skinHost = $('#f-skin');
  if (skinHost) chips(skinHost, SKINS, 'skin');
  const stockBtn = $('#f-stock');
  if (stockBtn) stockBtn.addEventListener('click', () => { state.inStock = !state.inStock; syncStock(); render(); });
  syncStock();
  $('#sort').value = state.sort;
  $('#sort').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
  render();
  concernGrid();
  UI.mountReveals();
})();
