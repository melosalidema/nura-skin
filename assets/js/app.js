/* ============================================================
   NŪRA SKIN — app shell: cart, drawer, nav, reveals
   ============================================================ */
(function () {
  'use strict';
  const N = window.NURA;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const money = N.money;

  /* ---------------- cart store ---------------- */
  const KEY = 'nura.cart.v1';
  const Cart = {
    items: [],
    load() {
      try { this.items = JSON.parse(localStorage.getItem(KEY)) || []; }
      catch (e) { this.items = []; }
      this.items = this.items.filter((i) => N.byId(i.id) && i.variant);
    },
    save() {
      try { localStorage.setItem(KEY, JSON.stringify(this.items)); } catch (e) {}
    },
    key: (id, variant) => id + '::' + variant,
    add(id, variant, qty) {
      qty = qty || 1;
      const p = N.byId(id);
      if (!p) return;
      const v = p.variants.find((x) => x.id === variant) || p.variants[0];
      const k = this.key(id, v.id);
      const found = this.items.find((i) => this.key(i.id, i.variant) === k);
      if (found) found.qty = Math.min(found.qty + qty, 99);
      else this.items.push({ id: id, variant: v.id, qty: Math.min(qty, 99) });
      this.save();
      this.emit();
    },
    setQty(id, variant, qty) {
      const k = this.key(id, variant);
      const i = this.items.find((x) => this.key(x.id, x.variant) === k);
      if (!i) return;
      if (qty <= 0) return this.remove(id, variant);
      i.qty = Math.min(qty, 99);
      this.save();
      this.emit();
    },
    remove(id, variant) {
      this.items = this.items.filter((x) => this.key(x.id, x.variant) !== this.key(id, variant));
      this.save();
      this.emit();
    },
    clear() { this.items = []; this.save(); this.emit(); },
    count() { return this.items.reduce((s, i) => s + i.qty, 0); },
    subtotal() {
      return this.items.reduce((s, i) => {
        const p = N.byId(i.id);
        const v = p && p.variants.find((x) => x.id === i.variant);
        return s + (v ? v.price * i.qty : 0);
      }, 0);
    },
    subs: [],
    emit() {
      this.subs.forEach((f) => f());
      document.dispatchEvent(new CustomEvent('cart:change', { detail: this }));
    },
    on(f) { this.subs.push(f); }
  };

  window.Cart = Cart;

  /* ---------------- toast ---------------- */
  let toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 6 9 17l-5-5"/></svg><span></span>';
      document.body.appendChild(toastEl);
    }
    $('span', toastEl).textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  }
  window.toast = toast;

  /* ---------------- shared chrome markup ---------------- */
  const ICONS = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 5l14 14M19 5 5 19"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M20 4C10 4 4 9 4 16c0 2 1 4 1 4s3-9 15-11"/><path d="M20 4c0 10-6 16-12 16"/></svg>',
    drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 3s6 6.5 6 10.5A6 6 0 0 1 6 13.5C6 9.5 12 3 12 3Z"/></svg>',
    flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M9 3h6M10 3v6L5 19a1 1 0 0 0 .9 1.5h12.2A1 1 0 0 0 19 19l-5-10V3"/><path d="M7.5 15h9"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 3 5 6v6c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2 7h11v10H2zM13 10h4l3 3v4h-7z"/><circle cx="6" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 6 9 17l-5-5"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3h3v10a4 4 0 1 1-4-4v3a1 1 0 1 0 1 1V3h-2v10a4 4 0 1 0 4 4V3h-2Z"/></svg>',
    pi: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5.5 13.2a1 1 0 0 1-1.4.3c-1.6-1-3.6-1.2-6-.7a1 1 0 1 1-.5-1.9c2.8-.7 5.3-.4 7.2.9.5.3.6 1 .7 1.4Zm1.3-3.6a1.3 1.3 0 0 1-1.8.4c-2-1.3-5-1.7-7.4-.9a1.3 1.3 0 1 1-.7-2.4c2.9-1 6.6-.5 9.1 1.1.6.4.8 1.3.4 1.8Zm.1-3.7C15.6 5.7 9.2 5.5 6.3 6.5a1.5 1.5 0 1 1-.9-2.9c3.4-1.1 10.5-1 14.6 2.4a1.5 1.5 0 0 1-1.7 2.4Z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3.2l-7 8 8.3 10h-6.5l-5-6.2L4.7 21H1.5l7.5-8.6L1 3h6.7l4.6 5.6L17.5 3Zm-1.1 16.1h1.8L6.7 4.8H4.8l11.6 14.3Z"/></svg>'
  };
  const icon = (n) => ICONS[n] || '';

  /* monogram roundel — the house mark */
  const MARK =
    '<svg class="logo__mark" viewBox="0 0 30 30" fill="none" aria-hidden="true">' +
      '<circle cx="15" cy="15" r="14.2" stroke="currentColor" stroke-width=".7"/>' +
      '<circle cx="15" cy="15" r="12.3" stroke="currentColor" stroke-width=".45" opacity=".6"/>' +
      '<text class="logo__monogram" x="15" y="19.5" text-anchor="middle">N</text>' +
    '</svg>';

  /* the seal that closes every page */
  const SEAL =
    '<svg class="ftr__seal" viewBox="0 0 200 200" fill="none" aria-hidden="true">' +
      '<circle cx="100" cy="100" r="96" stroke="currentColor" stroke-width="1"/>' +
      '<circle cx="100" cy="100" r="87" stroke="currentColor" stroke-width=".55" opacity=".75"/>' +
      '<circle cx="100" cy="100" r="62" stroke="currentColor" stroke-width=".55" opacity=".75"/>' +
      '<text class="seal__small" x="100" y="76" text-anchor="middle">N&#362;RA</text>' +
      '<text class="seal__monogram" x="100" y="120" text-anchor="middle">N</text>' +
      '<text class="seal__small" x="100" y="146" text-anchor="middle">EST. MMXIX</text>' +
      '<path d="M100 20l3.5 7.5-3.5 7.5-3.5-7.5 3.5-7.5Z" fill="currentColor" opacity=".85"/>' +
      '<path d="M100 165l3.5 7.5-3.5 7.5-3.5-7.5 3.5-7.5Z" fill="currentColor" opacity=".85"/>' +
    '</svg>';

  const NAV = [
    { href: 'shop.html', label: 'Shop' },
    { href: 'routine.html', label: 'Routine Builder' },
    { href: 'about.html', label: 'Science' }
  ];

  function currentPage() {
    const f = location.pathname.split('/').pop();
    return !f || f === '' ? 'index.html' : f;
  }

  function mountHeader() {
    const here = currentPage();
    const host = document.createElement('header');
    host.className = 'hdr';
    host.innerHTML =
      '<div class="hdr__in">' +
        '<nav class="nav" aria-label="Primary">' +
          NAV.map((n) => '<a class="nav__link" href="' + n.href + '"' + (here === n.href ? ' aria-current="page"' : '') + '>' + n.label + '</a>').join('') +
        '</nav>' +
        '<a class="logo" href="index.html" aria-label="NURA Skin — home">' + MARK + '<span class="logo__word">NŪRA</span></a>' +
        '<div class="nav nav--right hdr__tools">' +
          '<a class="nav__link" href="about.html"' + (here === 'about.html' ? ' aria-current="page"' : '') + '>About</a>' +
          '<button class="icon-btn" type="button" data-search aria-label="Search products"><span class="sr-only">Search</span>' + icon('search') + '</button>' +
          '<button class="icon-btn" type="button" data-open-cart aria-label="Open cart">' + icon('bag') + '<span class="cart-count" data-cart-count>0</span><span class="sr-only">Cart</span></button>' +
          '<button class="icon-btn burger" type="button" data-open-nav aria-label="Open menu" aria-expanded="false">' +
            '<span class="i-menu">' + icon('menu') + '</span>' +
            '<span class="i-x">' + icon('close') + '</span>' +
          '</button>' +
        '</div>' +
      '</div>';
    document.body.insertBefore(host, document.body.firstChild);
    /* the skip link belongs to the banner landmark */
    const skip = $('.skip');
    if (skip) host.insertBefore(skip, host.firstChild);

    /* mobile nav */
    const mnav = document.createElement('div');
    mnav.className = 'mnav';
    mnav.setAttribute('aria-hidden', 'true');
    const mItems = NAV.concat([{ href: 'about.html', label: 'About' }]);
    mnav.innerHTML =
      '<nav class="mnav__list" aria-label="Mobile">' +
        mItems.map((n, i) =>
          '<li><a href="' + n.href + '"' + (here === n.href ? ' aria-current="page"' : '') + ' style="transition-delay:' + (0.08 + i * 0.06) + 's">' +
            '<i class="mnav__num" aria-hidden="true">0' + (i + 1) + '</i>' + n.label + '</a></li>'
        ).join('') +
      '</nav>' +
      '<div class="mnav__foot">' +
        '<span>Free shipping over $75</span><span>30-day returns</span><span>UK · EU · US</span>' +
        '<span class="mnav__socials">' +
          '<a href="info.html?p=contact" aria-label="NURA Skin on Instagram">' + icon('ig') + '</a>' +
          '<a href="info.html?p=contact" aria-label="NURA Skin on TikTok">' + icon('tt') + '</a>' +
          '<a href="info.html?p=contact" aria-label="NURA Skin on Pinterest">' + icon('pi') + '</a>' +
          '<a href="info.html?p=contact" aria-label="NURA Skin on X">' + icon('x') + '</a>' +
        '</span>' +
      '</div>';
    document.body.appendChild(mnav);

    const burger = $('[data-open-nav]', host);
    const closeNav = () => {
      mnav.classList.remove('is-open');
      mnav.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      host.classList.remove('is-nav-open');
      if (!$('.drawer.is-open')) document.body.classList.remove('is-locked');
    };
    window.closeNav = closeNav;
    burger.addEventListener('click', () => {
      const open = !mnav.classList.contains('is-open');
      mnav.classList.toggle('is-open', open);
      mnav.setAttribute('aria-hidden', String(!open));
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      host.classList.toggle('is-nav-open', open);
      document.body.classList.toggle('is-locked', open);
      if (open) setTimeout(() => { const a = $('.mnav__list a'); if (a) a.focus(); }, 340);
    });
    mnav.addEventListener('click', (e) => { if (e.target.tagName === 'A') closeNav(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mnav.classList.contains('is-open')) { closeNav(); burger.focus(); } });

    /* scroll behaviour */
    const hero = $('[data-hero]');
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      host.classList.toggle('is-stuck', y > 24);
      if (hero) {
        const over = y < hero.offsetHeight - 90;
        host.classList.toggle('is-over-hero', over);
      }
      const hide = y > 320 && y > last + 4 && !$('html').scrollTop;
      host.classList.toggle('is-hidden', hide && !document.body.classList.contains('is-locked'));
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return host;
  }

  function mountDrawer() {
    const scrim = document.createElement('div');
    scrim.className = 'scrim';
    const dr = document.createElement('div');
    dr.className = 'drawer';
    dr.setAttribute('role', 'dialog');
    dr.setAttribute('aria-modal', 'true');
    dr.setAttribute('aria-label', 'Shopping bag');
    dr.innerHTML =
      '<div class="drawer__head">' +
        '<h2 class="drawer__title">Your bag <span data-drawer-count>(0)</span></h2>' +
        '<button class="icon-btn" type="button" data-close-cart aria-label="Close cart">' + icon('close') + '</button>' +
      '</div>' +
      '<div class="drawer__ship"><p data-ship-msg></p><div class="bar"><i data-ship-bar></i></div></div>' +
      '<div class="drawer__body" data-drawer-body></div>' +
      '<div class="drawer__foot">' +
        '<dl class="drawer__sum"><dt>Subtotal</dt><dd data-subtotal>$0</dd></dl>' +
        '<p class="drawer__note">Shipping and taxes calculated at checkout. Complimentary shipping over $75.</p>' +
        '<button class="btn btn-block" type="button" data-checkout>Checkout</button>' +
        '<button class="btn btn-ghost btn-block btn-sm" type="button" data-close-cart>Continue shopping</button>' +
        '<p class="drawer__viewall"><a class="link-u" href="cart-page.html">View full bag</a></p>' +
      '</div>';
    document.body.append(scrim, dr);

    const body = $('[data-drawer-body]', dr);
    const lastFocus = { el: null };

    function open() {
      lastFocus.el = document.activeElement;
      if (window.closeNav) window.closeNav();
      dr.classList.add('is-open');
      scrim.classList.add('is-on');
      document.body.classList.add('is-locked');
      setTimeout(() => $('[data-close-cart]', dr).focus(), 220);
    }
    function close() {
      dr.classList.remove('is-open');
      scrim.classList.remove('is-on');
      document.body.classList.remove('is-locked');
      if (lastFocus.el && lastFocus.el.focus) lastFocus.el.focus();
    }
    window.openCart = open;
    window.closeCart = close;

    scrim.addEventListener('click', close);
    $$('[data-close-cart]', dr).forEach((b) => b.addEventListener('click', close));
    $('[data-checkout]', dr).addEventListener('click', () => {
      toast('Demo store — checkout is disabled');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dr.classList.contains('is-open')) close();
      if (e.key === 'Tab' && dr.classList.contains('is-open')) {
        const f = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', dr).filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    function lineHTML(it) {
      const p = N.byId(it.id);
      const v = p.variants.find((x) => x.id === it.variant) || p.variants[0];
      return '<div class="line" data-k="' + p.id + '::' + v.id + '">' +
        '<a class="line__img" href="product.html?id=' + p.id + '" tabindex="-1"><img src="' + N.IMG(p.id, 1) + '" alt="' + p.name + '" loading="lazy"></a>' +
        '<div class="line__body">' +
          '<a class="line__name" href="product.html?id=' + p.id + '">' + p.name + '</a>' +
          '<span class="line__variant">' + v.label + (v.sub ? ' · ' + v.sub : '') + '</span>' +
          '<div class="line__row">' +
            '<span class="qty"><button type="button" data-dec aria-label="Decrease quantity">&minus;</button><output>' + it.qty + '</output><button type="button" data-inc aria-label="Increase quantity">+</button></span>' +
            '<span class="line__price">' + money(v.price * it.qty) + '</span>' +
          '</div>' +
          '<button class="line__rm" type="button" data-rm>Remove</button>' +
        '</div></div>';
    }

    function render() {
      const items = Cart.items;
      $('[data-drawer-count]', dr).textContent = '(' + Cart.count() + ')';
      $('[data-subtotal]', dr).textContent = money(Cart.subtotal());

      if (!items.length) {
        body.innerHTML =
          '<div class="drawer__empty">' + icon('bag') +
          '<p>Your bag is empty.</p>' +
          '<button class="btn btn-ghost btn-sm" type="button" data-close-cart>Browse the collection</button></div>';
      } else {
        body.innerHTML = items.map(lineHTML).join('');
      }

      const sub = Cart.subtotal();
      const left = N.FREE_SHIP - sub;
      $('[data-ship-msg]', dr).innerHTML = left > 0
        ? 'You are <b>' + money(left) + '</b> away from complimentary shipping'
        : '<b>Complimentary shipping unlocked</b>';
      $('[data-ship-bar]', dr).style.width = Math.min(100, (sub / N.FREE_SHIP) * 100) + '%';

      $$('[data-inc]', body).forEach((b) => b.addEventListener('click', () => {
        const k = b.closest('.line').dataset.k.split('::');
        Cart.setQty(k[0], k[1], +b.closest('.line').querySelector('output').textContent + 1);
      }));
      $$('[data-dec]', body).forEach((b) => b.addEventListener('click', () => {
        const k = b.closest('.line').dataset.k.split('::');
        Cart.setQty(k[0], k[1], +b.closest('.line').querySelector('output').textContent - 1);
      }));
      $$('[data-rm]', body).forEach((b) => b.addEventListener('click', () => {
        const row = b.closest('.line');
        const k = row.dataset.k.split('::');
        row.classList.add('is-out');
        setTimeout(() => Cart.remove(k[0], k[1]), 260);
      }));
      $$('[data-close-cart]', body).forEach((b) => b.addEventListener('click', close));
    }

    Cart.on(render);
    render();
    document.addEventListener('cart:open', open);
    document.addEventListener('cart:add', open);
  }

  function mountFooter() {
    const f = document.createElement('footer');
    f.className = 'ftr';
    f.innerHTML = SEAL +
      '<div class="wrap">' +
        '<div class="ftr__top">' +
          '<div class="ftr__brand">' +
            '<a class="logo" href="index.html" style="justify-self:start">' + MARK + '<span class="logo__word">NŪRA</span></a>' +
            '<p>Clinical skincare built on evidence and restraint. Dermatologist tested, fragrance free, and made in small batches.</p>' +
            '<div class="socials mt-s">' +
              '<a href="info.html?p=contact" aria-label="NURA Skin on Instagram">' + icon('ig') + '</a>' +
              '<a href="info.html?p=contact" aria-label="NURA Skin on TikTok">' + icon('tt') + '</a>' +
              '<a href="info.html?p=contact" aria-label="NURA Skin on Pinterest">' + icon('pi') + '</a>' +
              '<a href="info.html?p=contact" aria-label="NURA Skin on X">' + icon('x') + '</a>' +
            '</div>' +
          '</div>' +
          '<nav aria-label="Shop"><h3>Shop</h3><ul>' +
            '<li><a href="shop.html">All products</a></li>' +
            '<li><a href="shop.html?f=cleanser">Cleansers</a></li>' +
            '<li><a href="shop.html?f=serum">Serums</a></li>' +
            '<li><a href="shop.html?f=spf">SPF</a></li>' +
            '<li><a href="routine.html#stacks">Bundles</a></li>' +
          '</ul></nav>' +
          '<nav aria-label="Learn"><h3>Learn</h3><ul>' +
            '<li><a href="about.html">Our science</a></li>' +
            '<li><a href="methodology.html">How we test</a></li>' +
            '<li><a href="ingredients.html">Ingredient index</a></li>' +
            '<li><a href="routine.html">Routine builder</a></li>' +
            '<li><a href="info.html?p=journal">Journal</a></li>' +
            '<li><a href="info.html?p=stockists">Stockists</a></li>' +
          '</ul></nav>' +
          '<nav aria-label="Care"><h3>Care</h3><ul>' +
            '<li><a href="info.html?p=contact">Contact</a></li>' +
            '<li><a href="info.html?p=shipping">Shipping &amp; returns</a></li>' +
            '<li><a href="info.html?p=faq">FAQ</a></li>' +
            '<li><a href="info.html?p=privacy">Privacy</a></li>' +
            '<li><a href="info.html?p=terms">Terms</a></li>' +
          '</ul></nav>' +
        '</div>' +
        '<div class="ftr__bot">' +
          '<span>&copy; 2026 N&#363;RA Skin. A fictional brand concept.</span>' +
          '<nav><a href="info.html?p=privacy">Privacy</a><a href="info.html?p=terms">Terms</a><a href="info.html?p=accessibility">Accessibility</a></nav>' +
        '</div>' +
      '</div>';
    document.body.appendChild(f);
  }

  function mountNewsletter() {
    const s = document.createElement('section');
    s.className = 'news section-sm';
    s.innerHTML =
      '<div class="wrap"><div class="news__in">' +
        '<div><p class="eyebrow" style="color:rgba(233,224,204,.72)">The N&#363;RA letter</p>' +
        '<h2 class="display mt-s">Skin notes, once a month.</h2>' +
        '<p>Formulation deep-dives, ingredient explainers and early access to drops. No noise, no daily sends.</p></div>' +
        '<form class="field" data-news novalidate>' +
          '<label class="sr-only" for="news-email">Email address</label>' +
          '<input id="news-email" type="email" name="email" placeholder="you@example.com" required>' +
          '<button class="btn btn-light" type="submit">Subscribe</button>' +
          '<p class="news__fine" style="flex-basis:100%">By subscribing you agree to our privacy policy. Unsubscribe any time.</p>' +
        '</form>' +
      '</div></div>';
    const anchor = $('.news-mount');
    (anchor || document.body).appendChild(s);
    $('[data-news]', s).addEventListener('submit', (e) => {
      e.preventDefault();
      const i = $('input', e.currentTarget);
      if (!i.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value)) { toast('Enter a valid email address'); i.focus(); return; }
      e.currentTarget.reset();
      toast('Welcome to the NŪRA letter');
    });
  }

  function mountReveals() {
    const els = $$('[data-rv]');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.01 });
    els.forEach((e) => io.observe(e));
  }

  function mountStagger(scope) {
    $$('[data-stagger]', scope || document).forEach((row) => {
      const step = parseFloat(row.getAttribute('data-stagger')) || 0.05;
      Array.from(row.children).forEach((c, i) => {
        if (!c.hasAttribute('data-rv')) c.setAttribute('data-rv', '');
        c.style.setProperty('--d', (i * step) + 's');
      });
    });
  }

  function mountStars(scope) {
    $$('[data-stars]', scope || document).forEach((el) => {
      const r = parseFloat(el.getAttribute('data-stars')) || 5;
      el.innerHTML = Array.from({ length: 5 }, (_, i) =>
        '<span style="opacity:' + (i < Math.round(r) ? 1 : 0.28) + '">' + icon('star') + '</span>').join('');
    });
  }

  /* responsive image markup: avif + webp sources with a jpg fallback */
  function picture(src, alt, opts) {
    opts = opts || {};
    const dims = opts.width && opts.height ? ' width="' + opts.width + '" height="' + opts.height + '"' : '';
    const lazy = opts.eager ? '' : ' loading="lazy"';
    const m = /^(.*)\.(jpe?g)$/i.exec(src);
    if (!m) return '<img src="' + src + '" alt="' + alt + '"' + lazy + dims + '>';
    const base = m[1];
    return '<picture>' +
      '<source type="image/avif" srcset="' + base + '.avif">' +
      '<source type="image/webp" srcset="' + base + '.webp">' +
      '<img src="' + src + '" alt="' + alt + '"' + lazy + dims + '>' +
      '</picture>';
  }

  /* product card factory — shared by home, shop, routine */
  function cardHTML(p, opts) {
    opts = opts || {};
    /* one badge per card, highest signal first — stacked badges read as noise */
    const order = ['bestseller', 'award', 'new'];
    const pick = order.find((x) => p.badges.indexOf(x) !== -1);
    const b = pick
      ? '<span class="badge' + (pick === 'award' ? ' badge--gold' : pick === 'new' ? ' badge--light' : '') + '">' +
        (pick === 'bestseller' ? 'Bestseller' : pick === 'award' ? 'Awarded' : 'New') + '</span>'
      : '';
    const from = p.price;
    const quick = opts.noQuick ? '' :
      '<div class="card__quick">' +
        '<div class="variants-mini" role="group" aria-label="Choose size for ' + p.name + '">' +
          p.variants.map((v, i) => '<button type="button" data-quick-variant="' + p.id + '" data-v="' + v.id + '" aria-pressed="' + (i === 0) + '"' + (v.stock === 0 ? ' disabled title="Sold out"' : '') + '>' + v.label + '</button>').join('') +
        '</div>' +
        '<button class="btn btn-sm btn-block" type="button" data-quick-add="' + p.id + '">Add to bag</button>' +
      '</div>';
    return '<article class="card" data-card="' + p.id + '">' +
      '<div class="card__frame">' +
        '<a class="card__media" href="product.html?id=' + p.id + '" aria-label="' + p.name + '">' +
          (b ? '<span class="card__badges">' + b + '</span>' : '') +
          '<img class="main" src="' + N.IMG(p.id, 1) + '" alt="' + p.name + '" loading="lazy">' +
        '</a>' +
        (typeof window.Compare !== 'undefined'
          ? '<button class="card__cmp" type="button" data-compare="' + p.id + '" aria-pressed="false" aria-label="Compare ' + p.name + '">+ Compare</button>'
          : '') +
        quick +
      '</div>' +
      '<div class="card__body">' +
        '<div class="card__meta"><h3 class="card__name">' + p.name + '</h3>' +
        '<span class="card__price">' + (p.compareAt ? '<s>' + money(p.compareAt) + '</s>' : '') + money(from) + '</span></div>' +
        '<p class="card__spec">' + p.spec + '</p>' +
      '</div></article>';
  }

  function mountCardEvents(scope) {
    $$('[data-quick-add]', scope || document).forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = b.closest('[data-card]');
      const sel = card && card.querySelector('[data-quick-variant][aria-pressed="true"]');
      const id = b.getAttribute('data-quick-add');
      const p = N.byId(id);
      const v = sel ? sel.getAttribute('data-v') : p.variants[0].id;
      const variant = p.variants.find((x) => x.id === v);
      if (variant.stock === 0) { toast('That size is sold out'); return; }
      Cart.add(id, v, 1);
      toast(p.short + ' added to bag');
    }));
    $$('[data-quick-variant]', scope || document).forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const group = b.closest('.variants-mini');
      $$('button', group).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    }));
  }

  function renderCards(target, list, opts) {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    el.innerHTML = list.map((p) => cardHTML(p, opts)).join('');
    mountStagger(el);
    mountCardEvents(el);
  }

  /* global delegated add-to-cart: <button data-add="id" data-variant="v" data-qty="2" data-open> */
  document.addEventListener('click', (e) => {
    const n = e.target.closest('[data-notify]');
    if (n) {
      e.preventDefault();
      const p = N.byId(n.getAttribute('data-notify'));
      toast('We will email you when ' + (p ? p.short : 'this') + ' is back');
      return;
    }
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const id = b.getAttribute('data-add');
    const p = N.byId(id);
    if (!p) return;
    const v = b.getAttribute('data-variant') || p.variants[0].id;
    const variant = p.variants.find((x) => x.id === v);
    if (variant.stock === 0) { toast('That size is sold out'); return; }
    const q = parseInt(b.getAttribute('data-qty') || '1', 10);
    Cart.add(id, v, q);
    if (b.hasAttribute('data-open')) window.openCart();
    else toast(p.short + ' added to bag');
  });

  function mountSearch() {
    /* one searchable index across products, ingredients and concerns */
    const INDEX = [];
    N.PRODUCTS.forEach((p) => INDEX.push({
      group: 'Products', name: p.name, meta: p.type,
      href: 'product.html?id=' + p.id, img: N.IMG(p.id, 1), price: money(p.price),
      hay: (p.name + ' ' + p.sub + ' ' + p.type + ' ' + p.blurb + ' ' + p.concerns.join(' ') + ' ' + p.skinTypes.join(' ') + ' ' + p.keyActives.map((k) => k.n).join(' ')).toLowerCase()
    }));
    N.GLOSSARY.forEach((g) => INDEX.push({
      group: 'Ingredients', name: g.n, meta: g.aka + ' · ' + g.pct,
      href: 'about.html#glossary', img: '', price: '',
      hay: (g.n + ' ' + g.aka + ' ' + g.body).toLowerCase()
    }));
    N.CONCERNS.forEach((c) => INDEX.push({
      group: 'Concerns', name: c.label, meta: c.desc,
      href: 'concern.html?c=' + c.id, img: '', price: '',
      hay: (c.label + ' ' + c.desc).toLowerCase()
    }));

    const overlay = document.createElement('div');
    overlay.className = 'drawer drawer--search';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Search');
    overlay.innerHTML =
      '<div class="drawer__head"><h2 class="drawer__title">Search</h2>' +
        '<button class="icon-btn" type="button" data-close-search aria-label="Close search">' + icon('close') + '</button></div>' +
      '<div class="search-body"><label class="sr-only" for="q">Search</label>' +
        '<input id="q" class="search-input" type="search" autocomplete="off" placeholder="Search a product, ingredient or concern…" aria-describedby="q-count">' +
        '<p class="search-count" id="q-count" aria-live="polite" role="status"></p>' +
        '<div class="search-results" data-results></div></div>';
    const scrim = document.createElement('div');
    scrim.className = 'scrim';
    document.body.append(scrim, overlay);

    const results = $('[data-results]', overlay);
    const count = $('#q-count', overlay);
    const input = $('#q', overlay);
    let lastFocus = null;
    let hits = [];
    const isOpen = () => overlay.classList.contains('is-open');

    function close() {
      overlay.classList.remove('is-open');
      scrim.classList.remove('is-on');
      if (!$('.drawer.is-open')) document.body.classList.remove('is-locked');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function open(trigger) {
      lastFocus = trigger;
      if (window.closeCart) window.closeCart();
      if (window.closeNav) window.closeNav();
      overlay.classList.add('is-open');
      scrim.classList.add('is-on');
      document.body.classList.add('is-locked');
      input.value = '';
      run();
      setTimeout(() => input.focus(), 320);
    }

    function hitHTML(e) {
      const thumb = e.img
        ? '<img src="' + e.img + '" alt="" loading="lazy">'
        : '<span class="search-hit__mark" aria-hidden="true"></span>';
      return '<a class="search-hit" href="' + e.href + '" data-hit>' + thumb +
        '<span><b class="search-hit__name">' + e.name + '</b>' +
        '<span class="search-hit__type">' + e.meta + '</span></span>' +
        '<span class="search-hit__price">' + (e.price || '') + '</span></a>';
    }

    function run() {
      const q = input.value.trim().toLowerCase();
      hits = !q ? INDEX.filter((e) => e.group === 'Products').slice(0, 4) : INDEX.filter((e) => e.hay.includes(q));
      count.textContent = q ? hits.length + (hits.length === 1 ? ' match' : ' matches') : 'Popular now';
      if (!hits.length) {
        results.innerHTML = '<p class="search-empty">No matches for “' + input.value + '”.</p>' +
          '<div class="search-recover"><p>Try a different word, or:</p>' +
          '<a class="btn btn-ghost btn-sm" href="routine.html">Build my routine</a>' +
          '<a class="btn btn-ghost btn-sm" href="shop.html">Browse the collection</a></div>';
        return;
      }
      const groups = {};
      hits.forEach((e) => { (groups[e.group] = groups[e.group] || []).push(e); });
      results.innerHTML = Object.keys(groups).map((g) =>
        '<p class="search-group">' + g + '</p>' + groups[g].map(hitHTML).join('')).join('');
    }

    input.addEventListener('input', run);
    overlay.addEventListener('keydown', (e) => {
      const items = $$('[data-hit]', results);
      if (!items.length) return;
      const i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
    });
    $('[data-close-search]', overlay).addEventListener('click', close);
    scrim.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        const f = $$('button, [href], input, [tabindex]:not([tabindex="-1"])', overlay).filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-search]');
      if (trigger) open(trigger);
    });
  }

  /* evidence ledger: every published figure opens an auditable note.
     All claim data is sample content for this concept build. */
  function mountLedger() {
    const panel = document.createElement('aside');
    panel.className = 'ledger';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'ledger-title');
    panel.innerHTML =
      '<div class="ledger__head"><p class="eyebrow">Evidence note</p>' +
        '<button class="icon-btn" type="button" data-close-ledger aria-label="Close note">' + icon('close') + '</button></div>' +
      '<h2 class="display ledger__title" id="ledger-title"></h2>' +
      '<p class="ledger__wording"></p>' +
      '<dl class="ledger__meta"></dl>' +
      '<p class="ledger__flag">Sample data — concept build</p>';
    const scrim = document.createElement('div');
    scrim.className = 'scrim';
    document.body.append(scrim, panel);

    let last = null;
    function close() {
      panel.classList.remove('is-on');
      scrim.classList.remove('is-on');
      if (last && last.focus) last.focus();
    }
    function open(el, claim) {
      last = el;
      $('.ledger__title', panel).textContent = claim.label;
      $('.ledger__wording', panel).textContent = claim.wording;
      $('.ledger__meta', panel).innerHTML =
        '<div><dt>Basis</dt><dd>' + claim.basis + '</dd></div>' +
        '<div><dt>Confidence</dt><dd>' + claim.confidence + '</dd></div>' +
        '<div><dt>Appears in</dt><dd>' + claim.where + '</dd></div>';
      panel.classList.add('is-on');
      scrim.classList.add('is-on');
      setTimeout(function () { $('[data-close-ledger]', panel).focus(); }, 60);
    }
    document.addEventListener('keydown', function (e) {
      const b = e.target.closest && e.target.closest('[data-claim]');
      if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); b.click(); }
    });
    scrim.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-on')) close();
    });
    document.addEventListener('click', function (e) {
      const b = e.target.closest('[data-claim]');
      if (b) {
        e.preventDefault();
        const c = N.CLAIMS[b.getAttribute('data-claim')];
        if (c) open(b, c);
        return;
      }
      if (e.target.closest('[data-close-ledger]')) close();
    });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    Cart.load();
    mountHeader();
    mountDrawer();
    mountFooter();
    if ($('.news-mount')) mountNewsletter();
    mountStagger();
    mountReveals();
    mountStars();
    mountSearch();
    mountLedger();

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-open-cart]')) { e.preventDefault(); window.openCart(); }
    });
    document.addEventListener('cart:change', () => {
      const c = Cart.count();
      $$('[data-cart-count]').forEach((el) => {
        el.textContent = c;
        el.classList.toggle('is-on', c > 0);
      });
    });
    /* when a cart line is added via the grid quick-add, nudge the bag button */
    document.addEventListener('cart:change', () => {
      const btn = $('[data-open-cart]');
      if (!btn) return;
      btn.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }],
        { duration: 420, easing: 'cubic-bezier(0.22,0.61,0.36,1)' }
      );
    });
    const c = Cart.count();
    $$('[data-cart-count]').forEach((el) => { el.textContent = c; el.classList.toggle('is-on', c > 0); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.UI = { cardHTML, renderCards, mountCardEvents, mountReveals, mountStars, mountStagger, toast, icon, picture };
})();
