/* concern hub — a short guide plus every formula tagged for the concern */
(function () {
  'use strict';
  const N = window.NURA, UI = window.UI;
  const $ = (s) => document.querySelector(s);

  const GUIDES = {
    dehydration: {
      lede: 'Tightness, dullness and fine lines that appear worse by afternoon usually mean water loss, not dryness. The fix is humectants underneath and an occlusive on top.',
      title: 'Water in, water held',
      body: [
        'Layer a multi-weight hyaluronic serum onto damp skin, then seal it with a lipid — a cream or a squalane oil.',
        'Avoid foaming cleansers; they strip the lipids that hold water in.',
        'Reassess after two weeks. Hydration is one of the fastest things to change.'
      ],
      img: 'texture-leaves.jpg'
    },
    'fine-lines': {
      lede: 'Fine lines are mostly collagen and hydration. You cannot undo sun damage, but you can support turnover and keep skin plump — without the irritation that makes people quit retinol.',
      title: 'Turnover without the drama',
      body: [
        'A retinol alternative such as bakuchiol supports the same pathways with far better tolerance.',
        'Pair it with hydration — dehydrated skin makes every line look deeper.',
        'Consistency over intensity. Twelve weeks beats a week of over-use.'
      ],
      img: 'texture-cream.jpg'
    },
    pigmentation: {
      lede: 'Pigment is a long game. Sun protection is the only step that prevents it; actives only get to work once UV is controlled.',
      title: 'Protect first, then lighten',
      body: [
        'SPF every morning is non-negotiable — without it, nothing else compounds.',
        'Niacinamide and licorice root even tone gradually over eight weeks.',
        'Expect improvement, not erasure. Honest expectations keep people going.'
      ],
      img: 'still-bottle.jpg'
    },
    texture: {
      lede: 'Roughness, congestion and visible pores respond well to gentle, frequent exfoliation — not aggressive weekly peels that damage the barrier.',
      title: 'Smooth, do not strip',
      body: [
        'Large-molecule PHAs stay on the surface, so they refine without the sting of AHAs.',
        'Daily and gentle beats weekly and harsh.',
        'Follow with hydration so the surface stays comfortable.'
      ],
      img: 'application.jpg'
    },
    sensitivity: {
      lede: 'Reactive skin needs less, not more. Rebuild the barrier before adding anything active, and give it time.',
      title: 'Less, but consistent',
      body: [
        'Ceramides, cholesterol and fatty acids replenish the barrier directly.',
        'Fragrance-free, essential-oil-free formulas reduce avoidable triggers.',
        'Introduce one new thing at a time, and patch-test.'
      ],
      img: 'atelier-jar.jpg'
    },
    dullness: {
      lede: 'Dullness is usually a combination of dead-cell build-up, dehydration and slow turnover. A little of each fix compounds quickly.',
      title: 'Light, from the surface up',
      body: [
        'Gentle exfoliation removes the layer that scatters light.',
        'Antioxidants defend against the oxidative stress that reads as tired.',
        'Hydration plus a night active is the fastest visible change.'
      ],
      img: 'ritual-dropper.jpg'
    }
  };

  const id = (new URLSearchParams(location.search).get('c') || 'dehydration').toLowerCase();
  const concern = N.CONCERNS.find((c) => c.id === id) || N.CONCERNS[0];
  const guide = GUIDES[concern.id] || GUIDES.dehydration;

  document.title = concern.label + ' — NŪRA Skin';
  $('meta[name="description"]').setAttribute('content', concern.desc + ' Formulas and guidance from NŪRA Skin.');
  $('#crumb-here').textContent = concern.label;
  $('#page-title').textContent = concern.label;
  $('#page-lede').textContent = guide.lede;
  $('#guide-title').textContent = guide.title;
  $('#grid-title').textContent = 'Formulas for ' + concern.label.toLowerCase();
  $('#guide-body').innerHTML = '<ul class="split__list">' + guide.body.map((b) => '<li>' + b + '</li>').join('') + '</ul>';
  const gi = $('#guide-img');
  gi.outerHTML = UI.picture('assets/img/' + guide.img, 'Texture reference for ' + concern.label.toLowerCase(), { width: 1200, height: 1500 });

  const list = N.filterProducts(N.PRODUCTS, { concern: concern.id });
  UI.renderCards('#grid', list);
  if (!list.length) $('#grid').innerHTML = '<p class="lede">No formulas are tagged for this concern yet.</p>';

  $('#other-concerns').innerHTML = N.CONCERNS.filter((c) => c.id !== concern.id)
    .map((c) => '<a class="chip" href="concern.html?c=' + c.id + '">' + c.label + '</a>').join('');

  UI.mountReveals();
})();
