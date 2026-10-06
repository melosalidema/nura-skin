/* information pages — one template, many topics */
(function () {
  'use strict';
  const UI = window.UI;

  const FAQ_ITEMS = [
    ['Can I use NŪRA while pregnant?', 'Yes. None of our formulas contain retinol, retinoids, high-dose salicylic acid or essential oils. If your midwife or dermatologist advises otherwise for an individual ingredient, the full ingredient list is on every product page.'],
    ['How should I layer the routine?', 'Thinnest to thickest, water before oil: cleanser, treatment serums, moisturiser, then a facial oil to seal. SPF last in the morning, every day. The routine builder sequences this for you.'],
    ['Why no fragrance at all?', 'Fragrance is one of the most common triggers of contact dermatitis, and it offers no functional benefit to a barrier. We would rather leave it out than disguise it behind "sensitised" on a label.'],
    ['Is bakuchiol a retinol alternative?', 'It acts on the same receptor pathways as retinol, supporting turnover and collagen, without the irritation, flaking or photosensitivity. It is not as potent — but for most people it is far more usable, which is why adherence wins.'],
    ['Can I use the SPF on sensitive or reactive skin?', 'Yes. Pure Shield is 18.6% non-nano zinc oxide, fragrance free, and routinely tested around the eye area. If mineral sunscreens have caused a white cast on you before, the tint-free fluid finish is designed for deeper skin tones.'],
    ['Do you test on people, not just ingredients?', 'Every formula runs a 12-week wear study with 200 participants, instrument-measured for hydration and barrier function. Where results were modest or skin-type dependent, we say so on the product page.']
  ];

  const PAGES = {
    'shipping': {
      title: 'Shipping & returns',
      lede: 'Free carbon-neutral shipping over $75. Dispatched from our studio within 24 hours, tracked worldwide.',
      body:
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin-bottom:14px">Dispatch</h2>' +
        '<p class="lede" style="margin-bottom:34px">Orders placed before 2pm on a working day leave the same day. You will receive tracking by email as soon as the parcel is scanned.</p>' +
        '<table class="tbl"><thead><tr><th>Destination</th><th>Standard</th><th>Express</th></tr></thead><tbody>' +
        '<tr><td>United Kingdom</td><td>Free over $75 · else $6</td><td>$14 · 1–2 days</td></tr>' +
        '<tr><td>European Union</td><td>Free over $75 · else $9</td><td>$18 · 2–3 days</td></tr>' +
        '<tr><td>United States</td><td>Free over $75 · else $9</td><td>$18 · 2–3 days</td></tr>' +
        '<tr><td>Rest of world</td><td>$14 · 5–8 days</td><td>$32 · 2–4 days</td></tr>' +
        '</tbody></table>' +
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin:44px 0 14px">Returns</h2>' +
        '<p class="lede">30 days, opened or unopened. If a formula has not worked for your skin, tell us why — that feedback goes straight to the formulation team and is the most useful thing you can send us.</p>' +
        '<ul class="bullets"><li>Start a return from your order confirmation email</li><li>Refunds land within 5 working days of arrival at our studio</li><li>Original postage is non-refundable unless the item was faulty</li></ul>' +
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin:44px 0 14px">Refills</h2>' +
        '<p class="lede">Every NŪRA vessel is refillable. Return the empty glass and we will send a refill pouch free for the first year, with a prepaid return label inside the original box.</p>'
    },
    'faq': {
      title: 'Frequently asked',
      lede: 'The questions our team answers most often, in the order they usually arrive.',
      body: FAQ_ITEMS.map(function (r) {
        return '<h2 class="display" style="font-size:clamp(20px,2.4vw,30px);margin:34px 0 10px">' + r[0] + '</h2><p class="lede">' + r[1] + '</p>';
      }).join('')
    },
    'privacy': {
      title: 'Privacy',
      lede: 'What we collect, why, and how to make us delete it.',
      body:
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin-bottom:14px">What we collect</h2>' +
        '<p class="lede">Order details (name, address, email), and anonymous analytics about how the site is used. If you create an account, we store your routines and saved products.</p>' +
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin:44px 0 14px">What we never do</h2>' +
        '<ul class="bullets"><li>Sell or rent your data to anyone</li><li>Send more than one email a month without you asking</li><li>Share your skin data with advertisers</li></ul>' +
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin:44px 0 14px">Your rights</h2>' +
        '<p class="lede">Write to privacy@nura.example from the address on your order and we will export or erase your data within 30 days. Cart contents live in your own browser (localStorage) and are never transmitted until checkout.</p>'
    },
    'terms': {
      title: 'Terms',
      lede: 'The small print, written to be read.',
      body:
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin-bottom:14px">Orders</h2>' +
        '<p class="lede">An order is accepted when we send a dispatch confirmation. If a product is out of stock after you order, we will offer an equivalent or a full refund — your choice.</p>' +
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin:44px 0 14px">Pricing</h2>' +
        '<p class="lede">Prices are shown in USD and include applicable sales tax at checkout. Bundle pricing is applied automatically in the cart and cannot be combined with other offers.</p>' +
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin:44px 0 14px">Claims</h2>' +
        '<p class="lede">Efficacy claims reflect our own wear studies and published research on the ingredients used. Individual results vary — skin is not a controlled variable.</p>' +
        '<p class="eyebrow" style="margin-top:44px">NŪRA Skin is a fictional brand created as a front-end commerce concept. No real products are sold.</p>'
    },
    'accessibility': {
      title: 'Accessibility',
      lede: 'This site targets WCAG 2.2 AA. Here is how, and where to tell us when we fall short.',
      body:
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin-bottom:14px">What we have done</h2>' +
        '<ul class="bullets"><li>All interactive elements reachable and operable by keyboard, with a visible focus ring</li><li>Semantic landmarks, one H1 per page, and a skip-to-content link</li><li>Alternative text on all meaningful imagery; decorative images are hidden from assistive tech</li><li>Cart drawer and mobile menu trap focus while open and restore it on close</li><li>Every animation respects prefers-reduced-motion</li><li>Text and interface colours meet 4.5:1 contrast against their backgrounds</li></ul>' +
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin:44px 0 14px">Known gaps</h2>' +
        '<p class="lede">The routine builder communicates its progress through a numbered step indicator, which is visual as well as textual. Checkout is not implemented in this concept build.</p>' +
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin:44px 0 14px">Tell us</h2>' +
        '<p class="lede">Email access@nura.example with the page and what you were trying to do. We aim to reply within two working days.</p>'
    },
    'contact': {
      title: 'Contact',
      lede: 'A real person reads every message. Typical reply time is one working day.',
      body:
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin-bottom:14px">Talk to us</h2>' +
        '<ul class="bullets"><li><b>Order help</b> — orders@nura.example</li><li><b>Skin advice</b> — clinic@nura.example</li><li><b>Press &amp; partnerships</b> — press@nura.example</li><li><b>Accessibility</b> — access@nura.example</li></ul>' +
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin:44px 0 14px">Studio</h2>' +
        '<p class="lede">NŪRA Skin, Unit 4 Fitzroy Works, 41 Ashby Street, London EC2R 7EA, United Kingdom. Visits by appointment — email clinic@nura.example to book a formulation consultation.</p>' +
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin:44px 0 14px">Reformulation requests</h2>' +
        '<p class="lede">If a formula disagrees with your skin, tell us the product and the reaction. We track every report and feed it into the next production run.</p>'
    },
    'journal': {
      title: 'The Journal',
      lede: 'Notes from the formulation bench — written by our chemists, not a marketing team.',
      body: [
        ['Why we publish the percentage on the front', 'A label that lists twenty ingredients tells you nothing about how much of any of them is present. Every NŪRA product prints the concentration of its three lead actives, because a percentage is the only claim a customer can actually act on.'],
        ['Retinol, or bakuchiol?', 'Retinol still has the strongest evidence base for photoageing. It also has the highest abandonment rate, because of irritation and photosensitivity. Bakuchiol is not as potent. For most people, the usable option beats the optimal one over a twelve-week study.'],
        ['What 4% PHA actually does', 'Polyhydroxy acids are large enough to stay on the surface of the stratum corneum, which is why they exfoliate without the sting. At 4% twice daily you are looking at a measurable smoothing effect by week four and pigment improvement by week eight.'],
        ['Ceramide ratios, and why we do not publish ours', 'The three lipids in the barrier — ceramide, cholesterol, free fatty acids — work as a system at a specific ratio. Ours sits in the range used in barrier-repair trials. Publishing the exact ratio would help nobody choose between two good ceramides, so we do not.'],
        ['Refills and the cost of glass', 'Postage on refills is free for the first year because the emissions saved by not shipping a new jar are real, and because we would rather you kept the vessel on your shelf than in a drawer.']
      ].map(function (r, i) {
        return '<article class="post" data-rv style="--d:' + (i * 0.05) + 's">' +
          '<div class="post__meta">' +
            '<p class="eyebrow">' + new Date(2026, i, 3 + i * 2, 12).toDateString().slice(4) + '</p>' +
            '<p class="post__num" aria-hidden="true">0' + (i + 1) + '</p>' +
          '</div>' +
          '<div class="post__body">' +
            '<p class="eyebrow">Formulation</p>' +
            '<h2 class="display" style="font-size:clamp(24px,3.2vw,44px);margin:12px 0 14px">' + r[0] + '</h2>' +
            '<p class="lede">' + r[1] + '</p>' +
            '<p style="margin-top:20px"><a class="link-u" href="shop.html">Shop the formulas</a></p>' +
          '</div>' +
        '</article>';
      }).join('')
    },
    'stockists': {
      title: 'Stockists',
      lede: 'NŪRA is sold direct and through a small number of independent stockists.',
      body:
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin-bottom:14px">United Kingdom</h2>' +
        '<ul class="bullets"><li>Shambles, 19 King Street, London WC2</li><li>Haeckels-style concept, 8 Bathurst Mews, London W2</li><li>The Kindred, 44 Buchanan Street, Glasgow</li></ul>' +
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin:44px 0 14px">United States</h2>' +
        '<ul class="bullets"><li>Ten Yi, 123 Elizabeth Street, New York</li><li>Cos Standard, 2920 North Clark Street, Chicago</li></ul>' +
        '<h2 class="display" style="font-size:clamp(24px,3vw,38px);margin:44px 0 14px">Become a stockist</h2>' +
        '<p class="lede">We supply roughly forty retailers across twelve countries. If you sell skincare with a similar evidence-led philosophy, write to trade@nura.example with your store and a note on your clientele.</p>'
    }
  };

  const key = (new URLSearchParams(location.search).get('p') || 'shipping').toLowerCase();
  const page = PAGES[key] || PAGES.shipping;

  document.title = page.title + ' — NŪRA Skin';
  document.getElementById('page-title').textContent = page.title;
  document.getElementById('crumb-here').textContent = page.title;
  document.getElementById('page-lede').textContent = page.lede;
  document.getElementById('body').innerHTML = page.body;

  document.querySelector('meta[name="description"]').setAttribute('content', page.lede.slice(0, 155));

  /* FAQ schema mirrors the visible Q&A only — no hidden or invented content */
  if (key === 'faq') {
    const faq = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((r) => ({
        '@type': 'Question', name: r[0],
        acceptedAnswer: { '@type': 'Answer', text: r[1] }
      }))
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(faq);
    document.head.appendChild(s);
  }

  UI.mountReveals();
})();
