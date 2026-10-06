/* ============================================================
   NŪRA SKIN — full bag page
   Line editing, gift note, delivery estimate, free-shipping
   progress and a "complete your routine" cross-sell.
   ============================================================ */
(function () {
  'use strict';
  const N = window.NURA, UI = window.UI;
  const Cart = window.Cart;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const money = N.money;
  const GIFT_KEY = 'nura.gift.v1';

  function estimate() {
    const a = new Date(); a.setDate(a.getDate() + 3);
    const b = new Date(); b.setDate(b.getDate() + 5);
    const f = (x) => x.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    return f(a) + ' – ' + f(b);
  }

  function lineHTML(it) {
    const p = N.byId(it.id);
    const v = p.variants.find((x) => x.id === it.variant) || p.variants[0];
    return '<div class="cline" data-k="' + p.id + '::' + v.id + '">' +
      '<a class="cline__img" href="product.html?id=' + p.id + '">' +
        '<img src="' + N.IMG(p.id, 1) + '" alt="' + p.name + '" loading="lazy"></a>' +
      '<div class="cline__body">' +
        '<div class="cline__top">' +
          '<a class="cline__name" href="product.html?id=' + p.id + '">' + p.name + '</a>' +
          '<span class="cline__price">' + money(v.price * it.qty) + '</span>' +
        '</div>' +
        '<p class="cline__var">' + v.label + (v.sub ? ' · ' + v.sub : '') + '</p>' +
        '<div class="cline__row">' +
          '<span class="qty"><button type="button" data-dec aria-label="Decrease quantity of ' + p.name + '">&minus;</button>' +
            '<output>' + it.qty + '</output>' +
            '<button type="button" data-inc aria-label="Increase quantity of ' + p.name + '">+</button></span>' +
          '<button class="cline__rm" type="button" data-rm>Remove</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function summaryHTML(sub, left) {
    const gift = localStorage.getItem(GIFT_KEY) || '';
    return '<h2 class="cart-sum__h">Summary</h2>' +
      '<div class="cart-sum__ship">' +
        '<p>' + (left > 0 ? 'You are <b>' + money(left) + '</b> away from complimentary shipping' : '<b>Complimentary shipping unlocked</b>') + '</p>' +
        '<div class="bar"><i style="width:' + Math.min(100, (sub / N.FREE_SHIP) * 100) + '%"></i></div>' +
      '</div>' +
      '<dl class="cart-sum__tot"><dt>Subtotal</dt><dd>' + money(sub) + '</dd></dl>' +
      '<p class="cart-sum__note">Shipping and taxes calculated at checkout. Estimated delivery <b>' + estimate() + '</b>.</p>' +
      '<label class="cart-sum__gift"><span>Add a gift note (optional)</span>' +
        '<textarea id="gift" rows="2" maxlength="180" placeholder="A short message, printed on the packing slip">' + gift + '</textarea></label>' +
      '<button class="btn btn-block" type="button" data-checkout>Checkout</button>' +
      '<a class="btn btn-ghost btn-block btn-sm" href="shop.html">Continue shopping</a>' +
      '<p class="cart-sum__refill">Every vessel is refillable. Refills ship free for the first year — <a class="link-u" href="info.html?p=shipping">how refills work</a>.</p>';
  }

  function crossSell() {
    const inCart = {};
    Cart.items.forEach((i) => { inCart[i.id] = true; });
    const concerns = {};
    Cart.items.forEach((i) => { const p = N.byId(i.id); if (p) p.concerns.forEach((c) => { concerns[c] = true; }); });
    return N.PRODUCTS.filter((p) => !inCart[p.id])
      .sort((a, b) => {
        const sa = a.concerns.filter((c) => concerns[c]).length;
        const sb = b.concerns.filter((c) => concerns[c]).length;
        return sb - sa || b.rating - a.rating;
      })
      .slice(0, 3);
  }

  function render() {
    const root = $('#cart-root');
    const items = Cart.items;

    if (!items.length) {
      root.innerHTML = '<div class="cart-empty">' +
        '<p class="display cart-empty__t">Your bag is empty.</p>' +
        '<p class="lede" style="margin-inline:auto">Eight formulas, all fragrance free. Start with the essentials, or answer three questions and we will build the routine.</p>' +
        '<div class="cart-empty__cta"><a class="btn" href="shop.html">Shop all 8 formulas</a>' +
        '<a class="btn btn-ghost" href="routine.html">Build my routine</a></div></div>';
      return;
    }

    const sub = Cart.subtotal();
    const left = N.FREE_SHIP - sub;
    const cross = crossSell();

    root.innerHTML =
      '<div class="cart-grid">' +
        '<div class="cart-items">' + items.map(lineHTML).join('') + '</div>' +
        '<aside class="cart-sum" aria-label="Order summary">' + summaryHTML(sub, left) + '</aside>' +
      '</div>' +
      (cross.length
        ? '<section class="section-sm cart-cross"><div class="sec-head">' +
            '<div><p class="eyebrow">Complete your routine</p>' +
            '<h2 class="display sec-head__t mt-s">Chosen alongside this.</h2></div>' +
            '<p class="sec-head__d">Formulas that pair with what is already in your bag.</p>' +
          '</div><div class="grid-products grid-3" id="cart-cross"></div></section>'
        : '');

    bind();
    if (cross.length) UI.renderCards('#cart-cross', cross);

    const gift = $('#gift');
    if (gift) gift.addEventListener('input', () => { try { localStorage.setItem(GIFT_KEY, gift.value); } catch (e) {} });
  }

  function bind() {
    $$('[data-inc]').forEach((b) => b.addEventListener('click', () => {
      const k = b.closest('.cline').dataset.k.split('::');
      Cart.setQty(k[0], k[1], +b.closest('.cline').querySelector('output').textContent + 1);
    }));
    $$('[data-dec]').forEach((b) => b.addEventListener('click', () => {
      const k = b.closest('.cline').dataset.k.split('::');
      Cart.setQty(k[0], k[1], +b.closest('.cline').querySelector('output').textContent - 1);
    }));
    $$('[data-rm]').forEach((b) => b.addEventListener('click', () => {
      const row = b.closest('.cline');
      const k = row.dataset.k.split('::');
      row.classList.add('is-out');
      setTimeout(() => Cart.remove(k[0], k[1]), 240);
    }));
    const co = $('[data-checkout]');
    if (co) co.addEventListener('click', () => window.toast('Demo store — checkout is disabled'));
  }

  function start() {
    Cart.load();
    Cart.on(render);
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
