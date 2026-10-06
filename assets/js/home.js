/* home page */
(function () {
  'use strict';
  const N = window.NURA, UI = window.UI;

  /* featured: bestsellers first, then award winners */
  const featured = N.PRODUCTS
    .slice()
    .sort((a, b) => (b.badges.length ? 1 : 0) - (a.badges.length ? 1 : 0) || b.rating - a.rating)
    .slice(0, 4);

  UI.renderCards('#featured', featured);
  UI.mountReveals();

  /* actives assay — every distinct key active across the range, with its dose
     and the formula it lives in. Presented as data, not as feature cards. */
  const seen = new Set();
  const actives = [];
  N.PRODUCTS.forEach((p) => p.keyActives.forEach((k) => {
    const key = k.n.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    actives.push({ n: k.n, pct: k.pct, formula: p.name });
  }));
  const box = document.getElementById('actives');
  if (box) {
    box.innerHTML =
      '<div class="assay__head" aria-hidden="true"><span>Active</span><span>Dose</span><span>Formula</span></div>' +
      actives.slice(0, 8).map((a) => {
        const cid = N.CLAIM_BY_ACTIVE[a.n];
        return '<div class="assay__row">' +
          '<h3 class="assay__n"' + (cid ? ' data-claim="' + cid + '" role="button" tabindex="0" title="See the evidence note"' : '') + '>' + a.n + '</h3>' +
          '<span class="assay__pct">' + a.pct + '</span>' +
          '<p class="assay__d">' + a.formula + '</p>' +
        '</div>';
      }).join('');
    UI.mountStagger(box);
    UI.mountReveals();
  }
})();
