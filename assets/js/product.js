/* product detail page — variants, gallery, accordions */
(function () {
  'use strict';
  const N = window.NURA, UI = window.UI;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const money = N.money;

  const id = new URLSearchParams(location.search).get('id');
  const p = N.byId(id) || N.PRODUCTS[0];
  const sel = { variant: (p.variants.find((v) => v.stock > 0) || p.variants[0]).id, view: 1, qty: 1 };

  document.title = p.name + ' — NŪRA Skin';
  $('meta[name="description"]').setAttribute('content', p.desc.slice(0, 155));

  /* ---------- crumbs ---------- */
  $('[data-crumb]').innerHTML =
    '<a href="index.html">Home</a><span>/</span><a href="shop.html">Shop</a><span>/</span><span>' + p.type + '</span><span>/</span><span>' + p.short + '</span>';

  /* ---------- gallery ---------- */
  function gallery() {
    return '<div class="gallery">' +
      '<div class="gallery__thumbs" role="group" aria-label="Product images">' +
        [1, 2, 3].map((v) => '<button class="gallery__thumb" type="button" data-view="' + v + '" aria-pressed="' + (v === sel.view) + '" aria-label="View ' + v + '"><img src="' + N.IMG(p.id, v) + '" alt="" loading="lazy"></button>').join('') +
      '</div>' +
      '<div class="gallery__main"><img id="gmain" src="' + N.IMG(p.id, sel.view) + '" alt="' + p.name + ' — view ' + sel.view + '" width="800" height="1000"></div>' +
    '</div>';
  }

  /* ---------- info panel ---------- */
  function stars(r) {
    return '<span class="stars" data-stars="' + r + '"></span>';
  }

  function info() {
    const v = () => p.variants.find((x) => x.id === sel.variant) || p.variants[0];
    const now = v();
    const low = now.stock > 0 && now.stock <= 6;
    return '<div class="pdp__info">' +
      '<p class="eyebrow">' + p.type + ' · Step ' + p.step + ' of 5 · ' + (p.stage || '') + '</p>' +
      '<h1 class="display pdp__title">' + p.name + '</h1>' +
      '<p class="pdp__sub">' + p.sub + '</p>' +
      '<div class="pdp__rating">' + stars(p.rating) + '<span>' + p.rating.toFixed(1) + ' · ' + p.reviews + ' reviews</span></div>' +
      '<div class="pdp__price">' +
        '<b data-price>' + money(now.price) + '</b>' +
        (p.compareAt ? '<s>' + money(p.compareAt) + '</s><em>Save ' + money(p.compareAt - p.price) + '</em>' : '') +
      '</div>' +
      '<p class="pdp__spec">' + p.spec + ' · FRAGRANCE FREE</p>' +
      '<p class="pdp__meta-line">' + (p.texture ? p.texture : '') +
        (function () { const pm = N.pricePerMl(p); return pm ? ' · $' + pm.toFixed(2) + ' per ml' : ''; })() + '</p>' +
      '<p class="pdp__desc">' + p.desc + '</p>' +

      '<div class="opt">' +
        '<div class="opt__label"><span>Size</span><b data-variant-label>' + now.label + '</b></div>' +
        '<div class="opt__list" role="group" aria-label="Choose size">' +
          p.variants.map((x) => '<button class="opt__btn" type="button" data-var="' + x.id + '" aria-pressed="' + (x.id === sel.variant) + '" data-soldout="' + (x.stock === 0) + '">' +
            x.label + '<small>' + (x.stock === 0 ? 'Sold out' : x.sub) + '</small></button>').join('') +
        '</div>' +
        '<p class="eyebrow" style="margin-top:10px" data-stock>' + (now.stock === 0 ? 'Sold out — restocking soon' : low ? 'Only ' + now.stock + ' left in this size' : 'In stock · ships within 24 hours') + '</p>' +
      '</div>' +

      '<div class="pdp__buy">' +
        '<div class="qty" style="height:48px">' +
          '<button type="button" data-q-dec aria-label="Decrease quantity" style="width:40px;height:46px">&minus;</button>' +
          '<output data-q style="min-width:30px;font-size:14px">' + sel.qty + '</output>' +
          '<button type="button" data-q-inc aria-label="Increase quantity" style="width:40px;height:46px">+</button>' +
        '</div>' +
        '<button class="btn" type="button" data-add="' + p.id + '" data-variant="' + sel.variant + '" data-qty="' + sel.qty + '" data-open data-main-add>' + (now.stock === 0 ? 'Sold out' : 'Add to bag · ' + money(now.price * sel.qty)) + '</button>' +
        (now.stock === 0 ? '<button class="btn btn-ghost" type="button" data-notify="' + p.id + '">Notify me</button>' : '') +
      '</div>' +
      '<p class="pdp__refill">Refillable vessel — refills ship free for the first year. <a class="link-u" href="info.html?p=shipping">How refills work</a></p>' +

      '<div class="pdp__perks">' +
        '<div class="perk">' + UI.icon('truck') + '<span>Free shipping over $75 · dispatched within 24 hours from our studio</span></div>' +
        '<div class="perk">' + UI.icon('leaf') + '<span>Vegan, cruelty free and made in small batches</span></div>' +
        '<div class="perk">' + UI.icon('shield') + '<span>30-day returns, opened or unopened</span></div>' +
      '</div>' +

      acc() +
    '</div>';
  }

  /* ---------- accordions ---------- */
  function row(id, title, body, open) {
    return '<div class="acc__item' + (open ? ' is-open' : '') + '" data-acc="' + id + '">' +
      '<h3><button class="acc__btn" type="button" aria-expanded="' + !!open + '" data-acc-btn>' + title + '<i></i></button></h3>' +
      '<div class="acc__panel"><div>' + body + '</div></div>' +
    '</div>';
  }

  function acc() {
    const acts = p.keyActives.map((k) => {
      const cid = N.CLAIM_BY_ACTIVE[k.n];
      const name = cid
        ? '<b data-claim="' + cid + '" role="button" tabindex="0" title="See the evidence note">' + k.n + '</b>'
        : '<b>' + k.n + '</b>';
      return '<li>' + name + '<span>' + k.pct + '</span><span>' + describe(k.n) + '</span></li>';
    }).join('');
    return '<h2 class="sr-only">Product details</h2><div class="acc">' +
      row('benefits', 'Why it works',
        '<ul>' + p.benefits.map((b) => '<li>' + b + '</li>').join('') + '</ul>', true) +
      row('actives', 'Key actives &amp; percentages',
        '<ul>' + acts + '</ul>' +
        '<p style="padding-bottom:var(--space-m)"><a class="link-u" href="ingredients.html">See the full ingredient index</a></p>', false) +
      row('how', 'How to use',
        '<p>' + p.howTo.map((s, i) => '<b>' + (i + 1) + '.</b> ' + s).join('<br>') + '</p>', false) +
      (N.AVOID[p.id] ? row('layer', 'What not to layer it with',
        '<p>Not on the same night as ' + N.AVOID[p.id].map((id) => '<b>' + N.byId(id).name + '</b>').join(' or ') +
        '. Two exfoliating steps in one session is the fastest way to compromise a barrier.</p>', false) : '') +
      row('inci', 'Full ingredients (' + p.inci.length + ')',
        '<div class="inci">' + p.inci.map((i) => '<span>' + i + '</span>').join('') + '</div>', false) +
    '</div>';
  }

  const NOTES = {
    'Amino acid surfactants': 'Gentle cleansing that will not strip the acid mantle',
    'Oat kernel extract': 'Calms and reduces the feeling of tightness',
    Squalane: 'Skin-identical lipid that seals and softens',
    'Hyaluronic acid complex': 'Five molecular weights for layered hydration',
    Ectoin: 'Protects cells from dehydration and heat stress',
    'Beta-glucan': 'Deeply hydrating, soothing oat-derived polysaccharide',
    Bakuchiol: 'Retinol-like turnover support without irritation',
    Niacinamide: 'Evens tone, regulates oil, strengthens the barrier',
    'Ceramide NP': 'Replenishes the lipids your barrier is made of',
    'Ceramide complex': 'Full ceramide stack for barrier recovery',
    'Colloidal oatmeal': 'Recognised anti-irritant for reactive skin',
    Madecassoside: 'Redness and post-blemish mark support',
    'Non-nano zinc oxide': 'Physical broad-spectrum UV filter',
    'Vitamin E': 'Antioxidant that supports SPF stability',
    'Green tea extract': 'Antioxidant and calming catechin source',
    'Rosehip oil': 'Cold-pressed, naturally rich in vitamin C',
    'Sea buckthorn': 'Deep orange carotenoid antioxidant oil',
    'Gluconolactone (PHA)': 'Surface-level exfoliation without stinging',
    'Willow bark extract': 'Gentle natural salicylate',
    'Licorice root': 'Calms redness and evens pigmentation',
    'Papain enzyme': 'Digests dead keratin for a smooth surface',
    'Blueberry complex': 'Overnight antioxidant defence',
    'Glucosamine': 'Amino sugar for hydration and resilience'
  };
  const describe = (n) => NOTES[n] || '';

  /* ---------- detail section ---------- */
  function detail() {
    const others = p.pairs.map(N.byId).filter(Boolean);
    const res = N.RESULTS[p.id];
    const resultsBlock = res
      ? '<div class="mt-l results"><div class="sec-head">' +
          '<div><p class="eyebrow" data-rv>Wear study · sample data</p>' +
          '<h2 class="display sec-head__t mt-s" data-rv style="--d:.06s">What testers reported</h2></div>' +
          '<p class="sec-head__d" data-rv style="--d:.12s">' + res.metric + ', at each timepoint. Sample data for this concept build.</p>' +
        '</div>' +
        '<div class="results__chart" data-stagger="0.08">' +
          res.points.map(function (pt) {
            return '<div class="results__bar" style="--v:' + pt[1] + '">' +
              '<span class="results__val">+' + pt[1] + '%</span><i></i><span class="results__wk">Week ' + pt[0] + '</span></div>';
          }).join('') +
        '</div>' +
        '<p class="lede mt-s">' + res.note + '</p></div>'
      : '';
    return '<div class="wrap"><div class="split">' +
      '<div class="split__body">' +
        '<p class="eyebrow" data-rv>Ingredient story</p>' +
        '<h2 class="display sec-head__t" data-rv style="--d:.06s">' + headline(p) + '</h2>' +
        '<p class="lede" data-rv style="--d:.12s">' + p.blurb + '</p>' +
        '<div class="assay assay--compact mt-s" data-stagger="0.05">' +
          p.keyActives.map((k) => {
            const cid = N.CLAIM_BY_ACTIVE[k.n];
            return '<div class="assay__row">' +
              '<h3 class="assay__n"' + (cid ? ' data-claim="' + cid + '" role="button" tabindex="0" title="See the evidence note"' : '') + '>' + k.n + '</h3>' +
              '<span class="assay__pct">' + k.pct + '</span>' +
              '<p class="assay__d">' + describe(k.n) + '</p></div>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="split__media" data-rv="mask">' + UI.picture('assets/img/' + detailPhoto(p), 'Texture of ' + p.name, { width: 1200, height: 1500 }) + '</div>' +
    '</div>' +
    resultsBlock +
    '<div class="mt-l"><div class="sec-head">' +
      '<div><p class="eyebrow" data-rv>In the routine</p><h2 class="display sec-head__t mt-s" data-rv style="--d:.06s">Where it sits</h2></div>' +
    '</div><div class="grid-products grid-4" id="detail-pairs" data-stagger="0.07"></div>' +
    '<ul class="pairs-why mt-s">' + others.map(function (q) {
      return '<li><b>' + q.name + '</b> — ' + pairsReason(p, q) + '</li>';
    }).join('') + '</ul></div>' +
    '</div>';
  }

  const PHOTOS = {
    'dewdrop-serum': 'texture-leaves.jpg',
    'radiance-ritual': 'texture-cream.jpg',
    'golden-hour-oil': 'texture-leaves.jpg',
    'barrier-balm': 'atelier-jar.jpg',
    'night-bloom-masque': 'texture-cream.jpg',
    'pure-shield-spf': 'still-bottle.jpg',
    'clarity-toner': 'application.jpg',
    'cloudmilk-cleanser': 'ritual-dropper.jpg'
  };
  const detailPhoto = (x) => PHOTOS[x.id] || 'texture-cream.jpg';

  /* why a paired product sits where it does — derived, never invented */
  function pairsReason(p, q) {
    const rel = q.step > p.step ? 'later' : q.step < p.step ? 'earlier' : 'at the same stage';
    const shared = p.concerns.filter((c) => q.concerns.indexOf(c) !== -1)[0];
    const found = shared ? N.CONCERNS.find((c) => c.id === shared) : null;
    return 'a ' + q.stage.toLowerCase() + ' step, ' + rel + ' in the sequence' + (found ? ', for ' + found.label.toLowerCase() : '') + '.';
  }

  function headline(x) {
    const m = {
      'cloudmilk-cleanser': 'Cleansing should not cost you your barrier.',
      'dewdrop-serum': 'Hydration, layered by molecular weight.',
      'radiance-ritual': 'Retinol’s work, none of its drama.',
      'barrier-balm': 'Rescue for skin that has had enough.',
      'pure-shield-spf': 'The most important bottle in the routine.',
      'golden-hour-oil': 'Seal it, and let it sink in.',
      'clarity-toner': 'Exfoliation you can use every day.',
      'night-bloom-masque': 'One night a week is enough.'
    };
    return m[x.id] || 'Formulated for the skin you actually have.';
  }

  /* ---------- render ---------- */
  function render() {
    $('#pdp').innerHTML = gallery() + info();
    bind();
    UI.mountStars($('#pdp'));
    const sb = $('#sticky');
    const v = p.variants.find((x) => x.id === sel.variant) || p.variants[0];
    $('[data-sb-name]', sb).textContent = p.name;
    $('[data-sb-price]', sb).textContent = v.label + ' · ' + money(v.price);
    $('[data-sb-add]', sb).setAttribute('data-add', p.id);
    $('[data-sb-add]', sb).setAttribute('data-variant', sel.variant);
    $('[data-sb-add]', sb).setAttribute('data-open', '');
  }

  function bind() {
    const root = $('#pdp');

    root.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => {
      sel.view = +b.getAttribute('data-view');
      root.querySelectorAll('[data-view]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const img = $('#gmain', root);
      img.style.opacity = '0';                       /* fade out … */
      setTimeout(() => {
        img.src = N.IMG(p.id, sel.view);
        img.alt = p.name + ' — view ' + sel.view;
        const show = () => { img.style.opacity = '1'; };   /* … swap … */
        if (img.complete) show();                          /* … fade in */
        else img.addEventListener('load', show, { once: true });
      }, 300);
    }));

    root.querySelectorAll('[data-var]').forEach((b) => b.addEventListener('click', () => {
      const v = p.variants.find((x) => x.id === b.getAttribute('data-var'));
      if (v.stock === 0) { window.toast('That size is sold out'); return; }
      sel.variant = v.id;
      root.querySelectorAll('[data-var]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      syncVariant(root, v);
    }));

    const q = () => +root.querySelector('[data-q]').textContent;
    root.querySelector('[data-q-dec]').addEventListener('click', () => { sel.qty = Math.max(1, q() - 1); syncQty(root); });
    root.querySelector('[data-q-inc]').addEventListener('click', () => { sel.qty = Math.min(9, q() + 1); syncQty(root); });
    syncQty(root);
  }

  function syncQty(root) {
    root.querySelector('[data-q]').textContent = sel.qty;
    const v = p.variants.find((x) => x.id === sel.variant) || p.variants[0];
    const b = root.querySelector('[data-main-add]');
    b.setAttribute('data-qty', sel.qty);
    b.textContent = (v.stock === 0 ? 'Sold out' : 'Add to bag · ' + money(v.price * sel.qty));
  }

  function syncVariant(root, v) {
    root.querySelector('[data-price]').textContent = money(v.price);
    root.querySelector('[data-variant-label]').textContent = v.label;
    root.querySelector('[data-stock]').textContent =
      v.stock === 0 ? 'Sold out — restocking soon' : v.stock <= 6 ? 'Only ' + v.stock + ' left in this size' : 'In stock · ships within 24 hours';
    syncQty(root);
    const sb = $('#sticky');
    $('[data-sb-price]', sb).textContent = v.label + ' · ' + money(v.price);
    $('[data-sb-add]', sb).setAttribute('data-variant', v.id);
  }

  /* accordions (static markup below the fold too) */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-acc-btn]');
    if (!b) return;
    const item = b.closest('.acc__item');
    const open = item.classList.toggle('is-open');
    b.setAttribute('aria-expanded', String(open));
  });

  /* ---------- reviews ---------- */
  const NAMES = ['Amara O.', 'Jo L.', 'Nadia R.', 'Tess W.', 'Priya S.', 'Marta K.', 'Yuki T.', 'Elena F.'];
  const REVIEWS = {
    'cloudmilk-cleanser': [
      ['My barrier was wrecked from a strong acid. Six weeks of Cloudmilk and Dewdrop and the tightness is completely gone.', 5],
      ['It takes off a full face of SPF in one pass, which nothing gentle ever managed for me before.', 5],
      ['Bought the 200ml for my bathroom and my partner has started using it too. Sinks in faster than a water-based gel.', 4]
    ],
    'dewdrop-serum': [
      ['Five weights of HA is not a gimmick — this is the first serum where my skin stays plump past lunchtime.', 5],
      ['Plump in about four minutes. I use it under everything and nothing has ever pillied on top.', 5],
      ['Bought it for my husband who thinks skincare is a scam. He has now bought two more.', 5]
    ],
    'radiance-ritual': [
      ['The first retinol alternative that did not give me a single flake. The tone on my cheeks has visibly evened.', 5],
      ['Eight weeks in and the texture on my chin is genuinely different, not just photographically.', 4.5],
      ['Rich but not heavy. I wear it at night and my makeup still goes on smoothly.', 4.5]
    ],
    'barrier-balm': [
      ['Saved my face after I overdid the retinol. Redness gone in three days.', 5],
      ['I use it on my lips and around my nose in winter. It does not feel like a heavy occlusive.', 5],
      ['Small tin goes a long way. I am on my second.', 4.5]
    ],
    'pure-shield-spf': [
      ['Finally an SPF that does not leave a white cast on my skin tone. It goes under makeup like nothing is there.', 5],
      ['No sting, no pilling, and it genuinely looks like a serum going on.', 5],
      ['I reapply at lunch and it sits fine over makeup. Rare.', 4.5]
    ],
    'golden-hour-oil': [
      ['Absorbs in under a minute and leaves satin, not shine. My makeup slides on over it perfectly.', 5],
      ['The rosehip is doing something for my winter dryness that no cream managed.', 4.5],
      ['Gorgeous bottle, small amount goes a long way.', 4]
    ],
    'clarity-toner': [
      ['I have used AHAs that burned and this did not sting once. Smoothing came in around week four.', 5],
      ['Using it twice a day with no irritation at all. My pores on the nose are visibly smaller.', 4.5],
      ['The texture is lovely, not sticky. Layers under everything.', 4.5]
    ],
    'night-bloom-masque': [
      ['One night a week instead of a harsh exfoliant and my skin is smoother by morning.', 5],
      ['Never had a masque that did not make my face tight afterwards. This one does not.', 5],
      ['I look forward to it. That is a strange thing to say about a mask.', 4.5]
    ]
  };

  function renderReviews() {
    const set = REVIEWS[p.id] || REVIEWS['dewdrop-serum'];
    document.getElementById('rev-title').textContent = p.short + ', in their words.';
    document.getElementById('rev-sub').innerHTML =
      p.rating.toFixed(1) + ' average from ' + p.reviews.toLocaleString() + ' verified reviews. ' +
      '<a class="link-u" href="info.html?p=faq">Read the FAQ</a>';
    const host = document.getElementById('rev-quotes');
    host.innerHTML = set.map((r, i) =>
      '<figure class="quote"><div class="stars" data-stars="' + r[1] + '"></div>' +
      '<blockquote>' + r[0] + '</blockquote>' +
      '<figcaption>' + NAMES[i % NAMES.length] + ' · Verified</figcaption></figure>').join('');
    UI.mountStars(host);
  }

  render();
  $('#detail').innerHTML = detail();
  UI.renderCards('#detail-pairs', p.pairs.map(N.byId).filter(Boolean));
  renderReviews();
  UI.mountReveals();

  /* structured data — Product + Offer + BreadcrumbList.
     Deliberately omits aggregateRating: the reviews here are fictional concept
     content and must not be published to search engines as a real rating. */
  (function structuredData() {
    const v = p.variants.find((x) => x.stock > 0) || p.variants[0];
    const product = {
      '@context': 'https://schema.org', '@type': 'Product',
      name: p.name, description: p.desc, sku: p.id, category: p.type,
      brand: { '@type': 'Brand', name: 'NŪRA Skin' },
      image: ['https://nura.example/' + N.IMG(p.id, 1)],
      offers: {
        '@type': 'Offer',
        price: String(p.price),
        priceCurrency: 'USD',
        availability: v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: 'https://nura.example/product.html?id=' + p.id
      }
    };
    const crumbs = {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://nura.example/' },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://nura.example/shop.html' },
        { '@type': 'ListItem', position: 3, name: p.type, item: 'https://nura.example/shop.html?f=' + p.type.toLowerCase() },
        { '@type': 'ListItem', position: 4, name: p.short }
      ]
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'pdp-ld';
    s.textContent = JSON.stringify(product);
    document.head.appendChild(s);
    const b = document.createElement('script');
    b.type = 'application/ld+json';
    b.id = 'crumb-ld';
    b.textContent = JSON.stringify(crumbs);
    document.head.appendChild(b);
  })();

  /* sticky mobile buy bar: shown only once the in-page CTA has scrolled away */
  const sb = $('#sticky');
  const mainBtn = () => document.querySelector('[data-main-add]');
  let ticking = false;
  const syncSticky = () => {
    const b = mainBtn();
    if (!b) return;
    const past = b.getBoundingClientRect().top < 0;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
    sb.classList.toggle('is-on', past && !atBottom);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(syncSticky); }
  }, { passive: true });
  window.addEventListener('resize', syncSticky, { passive: true });
  syncSticky();
})();
