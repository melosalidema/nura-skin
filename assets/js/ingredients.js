/* ingredient atlas — every active with dose, source, products and layering */
(function () {
  'use strict';
  const N = window.NURA, UI = window.UI;
  const $ = (s) => document.querySelector(s);

  const CAT = {
    'Hyaluronic Acid': 'Humectant', 'Ectoin': 'Humectant',
    'Gluconolactone': 'Exfoliant', 'Papain': 'Exfoliant',
    'Blueberry & Acai': 'Antioxidant',
    'Squalane': 'Emollient', 'Ceramide NP': 'Emollient',
    'Non-Nano Zinc Oxide': 'Protect',
    'Bakuchiol': 'Renew',
    'Niacinamide': 'Tone & barrier',
    'Colloidal Oatmeal': 'Soothing', 'Madecassoside': 'Soothing'
  };
  N.GLOSSARY.forEach((g) => { g.cat = CAT[g.n] || g.type; });

  const state = { cat: 'all', q: '' };

  N.GLOSSARY.sort((a, b) => a.n.localeCompare(b.n));

  function productList(ids) {
    if (!ids.length) return '<span class="gl__none">Not in a current formula</span>';
    return ids.map((id) => {
      const p = N.byId(id);
      return '<a class="gl__product" href="product.html?id=' + id + '">' + p.short + '</a>';
    }).join('');
  }

  function metaRows(g) {
    const rows = [
      ['Function', g.type],
      ['Source', g.source || '—'],
      ['Dose used', g.pct],
      ['Pairs with', (g.compatible || []).join(', ') || '—'],
      ['Avoid with', (g.avoid || []).length ? (g.avoid || []).join(', ') : 'Nothing'],
      ['References', (g.citations || []).map((c) => '<span class="gl__cite">' + c + '</span>').join('') || '—']
    ];
    return rows.map((r) => '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>').join('');
  }

  function rowHTML(g, i) {
    return '<div class="gl" data-gl="' + i + '" id="' + g.slug + '">' +
      '<button class="gl__head" type="button" aria-expanded="false" style="display:contents">' +
        '<span class="gl__t"><b>' + g.n + '</b><i>' + g.aka + '</i><span class="gl__type">' + g.cat + '</span></span>' +
        '<span class="gl__n">' + g.pct + '</span>' +
      '</button>' +
      '<div class="gl__body"><div>' +
        '<p>' + g.body + '</p>' +
        '<p class="gl__found">Found in ' + productList(g.products || []) + '</p>' +
        '<dl class="gl__meta">' + metaRows(g) + '</dl>' +
      '</div></div>' +
    '</div>';
  }

  function filtered() {
    const q = state.q.trim().toLowerCase();
    return N.GLOSSARY.filter((g) => {
      if (state.cat !== 'all' && g.cat !== state.cat) return false;
      if (q && !((g.n + ' ' + g.aka + ' ' + g.body + ' ' + g.type).toLowerCase().includes(q))) return false;
      return true;
    });
  }

  function render() {
    const list = filtered();
    const host = $('#atlas');
    host.innerHTML = list.length
      ? list.map(rowHTML).join('')
      : '<p class="lede" style="padding:40px 0">No ingredient matches that. <button class="link-u" type="button" id="atlas-reset">Clear the filter</button>.</p>';
    $('#atlas-count').textContent = list.length + (list.length === 1 ? ' ingredient' : ' ingredients');
    UI.mountReveals();
    const reset = $('#atlas-reset');
    if (reset) reset.addEventListener('click', () => { state.q = ''; state.cat = 'all'; $('#atlas-q').value = ''; chips(); render(); });
  }

  const cats = ['all'].concat(Array.from(new Set(N.GLOSSARY.map((g) => g.cat))));
  function chips() {
    $('#atlas-type').innerHTML = cats.map((c) =>
      '<button class="chip" type="button" data-cat="' + c + '" aria-pressed="' + (state.cat === c) + '">' + (c === 'all' ? 'All' : c) + '</button>').join('');
    $('#atlas-type').querySelectorAll('[data-cat]').forEach((b) => b.addEventListener('click', () => {
      state.cat = b.getAttribute('data-cat');
      $('#atlas-type').querySelectorAll('[data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      render();
    }));
  }

  $('#atlas').addEventListener('click', (e) => {
    const b = e.target.closest('.gl__head');
    if (!b) return;
    const item = b.closest('.gl');
    const open = item.classList.toggle('is-open');
    b.setAttribute('aria-expanded', String(open));
  });

  $('#atlas-q').addEventListener('input', (e) => { state.q = e.target.value; render(); });

  chips();
  render();

  /* deep link to an ingredient (e.g. ingredients.html#niacinamide) */
  if (location.hash) {
    const item = document.getElementById(location.hash.slice(1));
    if (item) {
      item.classList.add('is-open');
      const head = item.querySelector('.gl__head');
      if (head) head.setAttribute('aria-expanded', 'true');
      setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
    }
  }
})();
