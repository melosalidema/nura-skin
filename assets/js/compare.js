/* ============================================================
   NŪRA SKIN — comparison store + tray
   Select up to three products anywhere, then compare.html lays
   them out as a ledger. State persists in localStorage.
   ============================================================ */
(function () {
  'use strict';
  const N = window.NURA;
  const KEY = 'nura.compare.v1';

  const Compare = {
    ids: [],
    load() {
      try { this.ids = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { this.ids = []; }
      this.ids = this.ids.filter((id) => N.byId(id)).slice(0, 3);
    },
    save() { try { localStorage.setItem(KEY, JSON.stringify(this.ids)); } catch (e) {} },
    has(id) { return this.ids.indexOf(id) !== -1; },
    toggle(id) {
      const i = this.ids.indexOf(id);
      if (i === -1) {
        if (this.ids.length >= 3) { window.toast('Compare up to three products'); return; }
        this.ids.push(id);
      } else this.ids.splice(i, 1);
      this.save(); this.emit();
    },
    remove(id) { this.ids = this.ids.filter((x) => x !== id); this.save(); this.emit(); },
    clear() { this.ids = []; this.save(); this.emit(); },
    subs: [],
    emit() { this.subs.forEach((f) => f()); },
    on(f) { this.subs.push(f); }
  };
  window.Compare = Compare;
  Compare.load();

  const tray = document.createElement('div');
  tray.className = 'cmp-tray';
  document.body.appendChild(tray);

  function render() {
    document.querySelectorAll('[data-compare]').forEach((b) => {
      b.setAttribute('aria-pressed', String(Compare.has(b.getAttribute('data-compare'))));
    });
    if (!Compare.ids.length) { tray.classList.remove('is-on'); tray.innerHTML = ''; return; }
    tray.classList.add('is-on');
    tray.innerHTML =
      '<div class="cmp-tray__head"><b>Compare</b><span>' + Compare.ids.length + ' of 3</span></div>' +
      '<div class="cmp-tray__items">' + Compare.ids.map((id) => {
        const p = N.byId(id);
        return '<span class="cmp-chip"><img src="' + N.IMG(id, 1) + '" alt="">' + p.short +
          '<button type="button" data-cmp-rm="' + id + '" aria-label="Remove ' + p.name + ' from comparison">&times;</button></span>';
      }).join('') + '</div>' +
      '<div class="cmp-tray__act">' +
        '<a class="btn btn-sm" href="compare.html?ids=' + Compare.ids.join(',') + '">Compare</a>' +
        '<button class="btn btn-ghost btn-sm" type="button" data-cmp-clear>Clear</button>' +
      '</div>';
  }

  Compare.on(render);
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-compare]');
    if (t) { e.preventDefault(); e.stopPropagation(); Compare.toggle(t.getAttribute('data-compare')); return; }
    const rm = e.target.closest('[data-cmp-rm]');
    if (rm) { Compare.remove(rm.getAttribute('data-cmp-rm')); return; }
    if (e.target.closest('[data-cmp-clear]')) Compare.clear();
  });
  render();

  /* ---------- compare page ---------- */
  const host = document.getElementById('cmp-table');
  if (host) {
    const money = N.money;
    const ids = (new URLSearchParams(location.search).get('ids') || '')
      .split(',').filter((id) => N.byId(id)).slice(0, 3);
    if (ids.length < 2) {
      host.innerHTML = '<p class="lede">Select at least two products to compare. <a class="link-u" href="shop.html">Browse the collection</a>.</p>';
    } else {
      const ps = ids.map(N.byId);
      const rows = [
        ['Type', (p) => p.type],
        ['Step', (p) => 'Step ' + p.step + ' · ' + p.stage],
        ['Texture', (p) => p.texture || '—'],
        ['Key actives', (p) => p.keyActives.map((k) => k.n + ' <b>' + k.pct + '</b>').join('<br>')],
        ['Best for', (p) => p.bestFor || '—'],
        ['Price', (p) => money(p.price)],
        ['Cost per ml', (p) => { const v = N.pricePerMl(p); return v ? '$' + v.toFixed(2) : '—'; }],
        ['Fragrance', () => 'Free'],
        ['Rating', (p) => p.rating.toFixed(1) + ' · ' + p.reviews.toLocaleString() + ' reviews']
      ];
      host.innerHTML = '<table class="cmp"><thead><tr><th class="cmp__rowhead"></th>' +
        ps.map((p) => '<th scope="col"><a href="product.html?id=' + p.id + '">' +
          '<img src="' + N.IMG(p.id, 1) + '" alt="" loading="lazy"><span>' + p.name + '</span></a></th>').join('') +
        '</tr></thead><tbody>' +
        rows.map((r) => '<tr><th scope="row">' + r[0] + '</th>' + ps.map((p) => '<td>' + r[1](p) + '</td>').join('') + '</tr>').join('') +
        '</tbody></table>';
    }
  }
})();
