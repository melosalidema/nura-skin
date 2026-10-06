/* ============================================================
   NŪRA SKIN — catalogue + commerce logic
   Fictional brand. All data is demo content.
   ============================================================ */

const FREE_SHIP = 75;
const BUNDLE_OFF = 0.15;

const IMG = (id, v) => `assets/img/products/${id}-${v}.svg`;

const PRODUCTS = [
  {
    id: 'cloudmilk-cleanser',
    name: 'Cloudmilk Cleanser',
    short: 'Cloudmilk',
    type: 'Cleanser',
    sub: 'Amino acid cream cleanser',
    spec: 'AMINO 9% · 200 ML',
    blurb: 'A low-foam, cushiony milk that lifts sunscreen and city grime without stripping.',
    desc: 'Cloudmilk is a pH-balanced amino acid cleanser with a milk-cream texture. It melts makeup, sunscreen and overnight sebum on contact, then rinses clean — no squeak, no tightness. Skin is left soft and slightly dewy, never tight.',
    price: 38,
    compareAt: 44,
    rating: 4.8,
    reviews: 412,
    concerns: ['dryness', 'sensitivity', 'texture'],
    skinTypes: ['dry', 'normal', 'sensitive', 'combination'],
    step: 1,
    stage: 'Cleanse',
    badges: ['bestseller'],
    keyActives: [
      { n: 'Amino acid surfactants', pct: '9%' },
      { n: 'Oat kernel extract', pct: '2%' },
      { n: 'Squalane', pct: '1.5%' }
    ],
    benefits: [
      'Removes SPF and makeup in one step',
      'pH 5.5 — respects the acid mantle',
      'Fragrance free, ophthalmologist tested'
    ],
    howTo: ['Warm a pea-sized amount between dry palms.', 'Massage over dry skin for 30 seconds, eyes included.', 'Rinse with lukewarm water or remove with a warm cloth.'],
    inci: ['Aqua', 'Glycerin', 'Coco-Glucoside', 'Caprylyl/Capryl Glucoside', 'Amino Acid Complex', 'Avena Sativa Kernel Extract', 'Squalane', 'Glycerin', 'Allantoin', 'Panthenol', 'Sodium PCA', 'Xanthan Gum', 'Citric Acid', 'Sodium Benzoate'],
    variants: [
      { id: '100ml', label: '100 ml', sub: '≈ 60 uses', price: 38, stock: 24 },
      { id: '200ml', label: '200 ml', sub: '≈ 120 uses', price: 62, stock: 9 },
      { id: '50ml', label: 'Travel 50 ml', sub: 'cabin size', price: 24, stock: 0 }
    ],
    pairs: ['dewdrop-serum', 'radiance-ritual']
  },
  {
    id: 'dewdrop-serum',
    name: 'Dewdrop Hydrating Serum',
    short: 'Dewdrop',
    type: 'Serum',
    sub: 'Multi-weight hyaluronic serum',
    spec: 'HA COMPLEX 2% · 30 ML',
    blurb: 'Five weights of hyaluronic acid plus ectoin for immediate, long-lasting plump.',
    desc: 'A weightless serum that layers under anything. Five molecular weights of hyaluronic acid pull water into the upper layers of skin, while ectoin and beta-glucan hold it there. Skin looks bouncier, plumper and smoother within minutes.',
    price: 64,
    compareAt: 72,
    rating: 4.9,
    reviews: 686,
    concerns: ['dehydration', 'dryness', 'texture', 'fine-lines'],
    skinTypes: ['dry', 'normal', 'combination', 'oily', 'sensitive'],
    step: 3,
    stage: 'Hydrate',
    badges: ['bestseller', 'award'],
    keyActives: [
      { n: 'Hyaluronic acid complex', pct: '2%' },
      { n: 'Ectoin', pct: '1%' },
      { n: 'Beta-glucan', pct: '0.5%' }
    ],
    benefits: [
      'Five molecular weights for real depth of hydration',
      'Plumps the look of fine lines in minutes',
      'Fragrance free, suitable for sensitive skin'
    ],
    howTo: ['Press 3–4 drops into damp skin after cleansing.', 'Follow with serum or cream while skin is still slightly damp.', 'Use morning and evening.'],
    inci: ['Aqua', 'Sodium Hyaluronate', 'Hydrolyzed Sodium Hyaluronate', 'Sodium Hyaluronate Crosspolymer', 'Ectoin', 'Beta-Glucan', 'Glycerin', 'Propanediol', 'Panthenol', 'Trehalose', 'Allantoin', 'Sodium PCA', '1,2-Hexanediol', 'Xanthan Gum', 'Sodium Benzoate'],
    variants: [
      { id: '30ml', label: '30 ml', sub: 'dropper', price: 64, stock: 18 },
      { id: '50ml', label: '50 ml', sub: 'dropper', price: 92, stock: 6 }
    ],
    pairs: ['cloudmilk-cleanser', 'radiance-ritual', 'barrier-balm']
  },
  {
    id: 'radiance-ritual',
    name: 'Radiance Ritual Cream',
    short: 'Radiance',
    type: 'Moisturiser',
    sub: 'Bakuchiol night cream',
    spec: 'BAKUCHIOL 1% · 50 ML',
    blurb: 'A velvet night cream with bakuchiol — visible tone and texture work by morning.',
    desc: 'Radiance Ritual replaces retinol. Bakuchiol works on the same receptor pathways without the irritation, plus niacinamide, peptides and a botanical ceramide blend. Wake up to skin that looks rested, even and faintly lit from within.',
    price: 78,
    compareAt: 88,
    rating: 4.7,
    reviews: 534,
    concerns: ['fine-lines', 'texture', 'pigmentation', 'dullness'],
    skinTypes: ['dry', 'normal', 'combination', 'sensitive'],
    step: 4,
    stage: 'Seal',
    badges: ['award'],
    keyActives: [
      { n: 'Bakuchiol', pct: '1%' },
      { n: 'Niacinamide', pct: '4%' },
      { n: 'Ceramide NP', pct: '2%' }
    ],
    benefits: [
      'Retinol-like results without irritation or photosensitivity',
      'Visibly evens tone and softens texture',
      'Overnight — no sunscreen required for the active'
    ],
    howTo: ['Warm a pea-sized amount and press over face and neck.', 'Use as the last step of your evening routine.', 'Always follow with SPF in the morning.'],
    inci: ['Aqua', 'Glycerin', 'Caprylic/Capric Triglyceride', 'Squalane', 'Niacinamide', 'Bakuchiol', 'Ceramide NP', 'Ceramide AP', 'Ceramide EOP', 'Palmitoyl Tripeptide-1', 'Palmitoyl Tetrapeptide-7', 'Centella Asiatica Extract', 'Shea Butter', 'Tocopherol', 'Xanthan Gum', 'Sodium Benzoate'],
    variants: [
      { id: '50ml', label: '50 ml', sub: 'jar', price: 78, stock: 15 },
      { id: '15ml', label: 'Travel 15 ml', sub: 'jar', price: 32, stock: 4 }
    ],
    pairs: ['dewdrop-serum', 'pure-shield-spf', 'golden-hour-oil']
  },
  {
    id: 'barrier-balm',
    name: 'Barrier Balm',
    short: 'Barrier',
    type: 'Treatment',
    sub: 'Ceramide recovery balm',
    spec: 'CERAMIDES 3% · 60 ML',
    blurb: 'A dense, whipped balm for compromised skin, wind burn and flare-ups.',
    desc: 'Barrier Balm is a rescue treatment. A whipped balm of 3% ceramide complex, cholesterol and fatty acids, plus colloidal oatmeal and madecassoside, calms angry, tight or over-exfoliated skin. Melts on contact and leaves a protective veil.',
    price: 54,
    rating: 4.9,
    reviews: 298,
    concerns: ['sensitivity', 'redness', 'dryness', 'barrier'],
    skinTypes: ['dry', 'sensitive', 'normal', 'combination'],
    step: 4,
    stage: 'Seal',
    badges: ['new'],
    keyActives: [
      { n: 'Ceramide complex', pct: '3%' },
      { n: 'Colloidal oatmeal', pct: '1%' },
      { n: 'Madecassoside', pct: '0.3%' }
    ],
    benefits: [
      'Rescue for over-exfoliation, wind burn and rosacea flush',
      'Occlusive enough for overnight, light enough for daytime',
      'Suitable around the eyes and on lips'
    ],
    howTo: ['Melt a small amount between fingers.', 'Press onto clean skin, focusing on dry or reactive patches.', 'Use morning and evening, or as an overnight mask.'],
    inci: ['Aqua', 'Caprylic/Capric Triglyceride', 'Petrolatum', 'Cera Alba', 'Ceramide NP', 'Ceramide AP', 'Cholesterol', 'Shea Butter', 'Colloidal Oatmeal', 'Madecassoside', 'Bisabolol', 'Tocopherol', 'Rosmarinus Officinalis Leaf Extract'],
    variants: [
      { id: '60ml', label: '60 ml', sub: 'tin', price: 54, stock: 20 }
    ],
    pairs: ['cloudmilk-cleanser', 'dewdrop-serum', 'clarity-toner']
  },
  {
    id: 'pure-shield-spf',
    name: 'Pure Shield SPF 50',
    short: 'Pure Shield',
    type: 'SPF',
    sub: 'Mineral fluid sunscreen',
    spec: 'ZINC 18.6% · 50 ML',
    blurb: 'Non-nano zinc SPF 50 that disappears on every skin tone. No white cast.',
    desc: 'Pure Shield is a fluid mineral sunscreen with 18.6% non-nano zinc oxide, encapsulated for maximum UVA protection and a truly transparent finish. Fragrance free, no pilling under makeup, and gentle enough for the eye area.',
    price: 42,
    rating: 4.8,
    reviews: 761,
    concerns: ['pigmentation', 'fine-lines', 'sensitivity', 'protection'],
    skinTypes: ['all'],
    step: 5,
    stage: 'Protect',
    badges: ['bestseller'],
    keyActives: [
      { n: 'Non-nano zinc oxide', pct: '18.6%' },
      { n: 'Vitamin E', pct: '2%' },
      { n: 'Green tea extract', pct: '1%' }
    ],
    benefits: [
      'Broad spectrum UVA + UVB, SPF 50, PA++++',
      'No white cast and no pilling under makeup',
      'Rubs in like a serum — 20 seconds, two fingers'
    ],
    howTo: ['Apply two finger-lengths as the last morning step.', 'Reapply every two hours in direct sun.', 'Use as a makeup primer — it grips perfectly.'],
    inci: ['Aqua', 'Zinc Oxide', 'Caprylic/Capric Triglyceride', 'Squalane', 'Glycerin', 'Tocopherol', 'Camellia Sinensis Leaf Extract', 'Bisabolol', 'Tocopheryl Acetate', 'Silica', 'Xanthan Gum', 'Sodium Chloride', 'Phenoxyethanol'],
    variants: [
      { id: '50ml', label: '50 ml', sub: 'tube', price: 42, stock: 30 },
      { id: '100ml', label: '100 ml', sub: 'tube', price: 68, stock: 12 }
    ],
    pairs: ['dewdrop-serum', 'radiance-ritual', 'clarity-toner']
  },
  {
    id: 'golden-hour-oil',
    name: 'Golden Hour Oil',
    short: 'Golden Hour',
    type: 'Oil',
    sub: 'Squalane face oil',
    spec: 'SQUALANE 78% · 30 ML',
    blurb: 'A dry-touch oil of 12 botanicals that seals moisture without shine.',
    desc: 'Golden Hour finishes a routine. A featherlight squalane base pressed with 12 cold-pressed botanicals — rosehip, marula, sea buckthorn and more — absorbs in under a minute and leaves a satin, not oily, finish. Layer over cream or use alone on bare skin.',
    price: 58,
    compareAt: 66,
    rating: 4.7,
    reviews: 322,
    concerns: ['dryness', 'dehydration', 'fine-lines', 'dullness'],
    skinTypes: ['dry', 'normal', 'combination'],
    step: 4,
    stage: 'Seal',
    badges: [],
    keyActives: [
      { n: 'Squalane', pct: '78%' },
      { n: 'Rosehip oil', pct: '8%' },
      { n: 'Sea buckthorn', pct: '3%' }
    ],
    benefits: [
      'Non-comedogenic, absorbs in under 60 seconds',
      '12 single-origin botanical oils, cold pressed',
      'Softens the look of fine lines overnight'
    ],
    howTo: ['Warm 3–4 drops in the palms.', 'Press over moisturiser as the final step, or use alone at night.', 'Morning: follow with SPF.'],
    inci: ['Squalane', 'Rosa Canina Seed Oil', 'Sclerocarya Birrea Seed Oil', 'Hippophae Rhamnoides Fruit Oil', 'Simmondsia Chinensis Seed Oil', 'Tocopherol', 'Rosmarinus Officinalis Leaf Extract', 'Calendula Officinalis Flower Extract', 'Helianthus Annuus Seed Oil', 'Tocopheryl Acetate'],
    variants: [
      { id: '30ml', label: '30 ml', sub: 'dropper', price: 58, stock: 11 },
      { id: '15ml', label: 'Travel 15 ml', sub: 'dropper', price: 34, stock: 7 }
    ],
    pairs: ['radiance-ritual', 'pure-shield-spf', 'dewdrop-serum']
  },
  {
    id: 'clarity-toner',
    name: 'Clarity PHA Tonic',
    short: 'Clarity',
    type: 'Toner',
    sub: 'Exfoliating tonic',
    spec: 'PHA 4% · 120 ML',
    blurb: 'A 4% PHA tonic that resurfaces gently — clarity without the sting.',
    desc: 'Clarity is a leave-on exfoliating tonic with 4% gluconolactone (PHA) and willow bark. PHA molecules are large enough to stay on the surface, so you get a smooth, refined finish with none of the irritation of AHAs. Skin-appropriate twice daily.',
    price: 46,
    rating: 4.6,
    reviews: 508,
    concerns: ['texture', 'pigmentation', 'dullness', 'fine-lines'],
    skinTypes: ['normal', 'combination', 'oily'],
    step: 2,
    stage: 'Treat',
    badges: [],
    keyActives: [
      { n: 'Gluconolactone (PHA)', pct: '4%' },
      { n: 'Willow bark extract', pct: '1%' },
      { n: 'Licorice root', pct: '1%' }
    ],
    benefits: [
      'Refines texture and softens marks over 4–6 weeks',
      'Gentle enough for daily use, unlike AHAs',
      'Layers under serum and SPF without pilling'
    ],
    howTo: ['Sweep over cleansed skin with palms or a cotton pad.', 'Follow with serum and moisturiser.', 'Use in the evening to start; add mornings once tolerant.'],
    inci: ['Aqua', 'Gluconolactone', 'Salix Alba Bark Extract', 'Glycyrrhiza Glabra Root Extract', 'Glycerin', 'Propanediol', 'Panthenol', 'Allantoin', 'Sodium PCA', 'Citric Acid', 'Sodium Benzoate'],
    variants: [
      { id: '120ml', label: '120 ml', sub: 'tonic', price: 46, stock: 26 }
    ],
    pairs: ['cloudmilk-cleanser', 'dewdrop-serum', 'barrier-balm']
  },
  {
    id: 'night-bloom-masque',
    name: 'Night Bloom Masque',
    short: 'Night Bloom',
    type: 'Mask',
    sub: 'Weekly enzyme masque',
    spec: 'PAPAIN 2% · 75 ML',
    blurb: 'A once-a-week purple masque that refines overnight and never over-works.',
    desc: 'Night Bloom is your weekly reset. Papain and bakuchiol lift dead cells gently while blueberry and acai antioxidants defend overnight. Skin wakes smooth, bright and rested — with no tightness and no need for a recovery week.',
    price: 52,
    rating: 4.8,
    reviews: 219,
    concerns: ['texture', 'dullness', 'pigmentation'],
    skinTypes: ['normal', 'combination', 'oily', 'dry'],
    step: 2,
    stage: 'Treat',
    badges: ['new'],
    keyActives: [
      { n: 'Papain enzyme', pct: '2%' },
      { n: 'Blueberry complex', pct: '4%' },
      { n: 'Bakuchiol', pct: '0.5%' }
    ],
    benefits: [
      'One 15-minute session replaces a harsh exfoliant',
      'Overnight resurfacing, zero downtime',
      'Antioxidant defence against overnight free-radical damage'
    ],
    howTo: ['Apply a generous layer to clean, dry skin once a week.', 'Leave 15 minutes — do not rinse if skin feels tight.', 'Rinse with lukewarm water, then moisturise.'],
    inci: ['Aqua', 'Glycerin', 'Vaccinium Myrtillus Fruit Extract', 'Euterpe Oleracea Fruit Extract', 'Papain', 'Bakuchiol', 'Aloe Barbadensis Leaf Juice', 'Squalane', 'Panthenol', 'Allantoin', 'Cetearyl Alcohol', 'Xanthan Gum', 'Sodium Benzoate'],
    variants: [
      { id: '75ml', label: '75 ml', sub: 'jar', price: 52, stock: 8 }
    ],
    pairs: ['cloudmilk-cleanser', 'dewdrop-serum', 'pure-shield-spf']
  }
];

const byId = (id) => PRODUCTS.find((p) => p.id === id);

/* ---------- ingredient glossary ---------- */
const GLOSSARY = [
  { n: 'Hyaluronic Acid', aka: 'Sodium Hyaluronate', pct: '2%', body: 'A humectant that holds up to 1,000× its weight in water. We use five molecular weights so hydration reaches several layers of the epidermis rather than sitting on top.' },
  { n: 'Bakuchiol', aka: 'Psoralea corylifolia', pct: '1%', body: 'A plant alternative to retinol that acts on the same receptor pathways, supporting collagen and turnover without the flaking, stinging or photosensitivity.' },
  { n: 'Niacinamide', aka: 'Vitamin B3', pct: '4%', body: 'Improves barrier function, regulates oil, fades pigment and calms redness. One of the few actives that genuinely improves every skin type.' },
  { n: 'Ceramide NP', aka: 'Ceramide 3', pct: '3%', body: 'The most skin-identical of the three lipids that make up the barrier. Replenishing it is the fastest way to calm reactive, tight or over-exfoliated skin.' },
  { n: 'Ectoin', aka: 'Extremolyte', pct: '1%', body: 'An extremophile-derived molecule that forms a water shell around cells, protecting against dehydration, heat and UV stress.' },
  { n: 'Squalane', aka: 'Olive-derived', pct: '78%', body: 'A sugarcane- or olive-derived lipid identical to the skin’s own. Non-comedogenic, non-oxidising and stable — unlike mineral oil.' },
  { n: 'Gluconolactone', aka: 'PHA', pct: '4%', body: 'The gentlest polyhydroxy acid. Its large molecules stay on the surface, so it resurfaces texture and pigment without the sting of glycolic acid.' },
  { n: 'Non-Nano Zinc Oxide', aka: 'Mineral SPF', pct: '18.6%', body: 'A physical UV filter that sits on the skin and reflects or absorbs both UVA and UVB. Our particles are 100nm or larger — nothing to absorb into your bloodstream.' },
  { n: 'Papain', aka: 'Papaya enzyme', pct: '2%', body: 'A plant enzyme that digests the keratin holding dead cells in place. A weekly reset with none of the mechanical abrasion.' },
  { n: 'Colloidal Oatmeal', aka: 'Avena sativa', pct: '1%', body: 'Recognised by regulators as an anti-irritant. It forms a protective film, calms itch and supports recovery on compromised skin.' },
  { n: 'Madecassoside', aka: 'Centella fraction', pct: '0.3%', body: 'A highly purified triterpene from centella, one of the best-evidenced actives for redness, post-blemish marks and reactive skin.' },
  { n: 'Blueberry & Acai', aka: 'Anthocyanin complex', pct: '4%', body: 'Deep-purple antioxidant fractions that neutralise free radicals overnight, protecting collagen from the oxidative stress that shows up as dullness.' }
];

/* ---------- ingredient atlas metadata ----------
   `citations` are indicative literature notes for a concept build, not a
   bibliography. Nothing here invents a study result. ---------- */
const GLOSSARY_EXTRA = {
  'Hyaluronic Acid': {
    slug: 'hyaluronic-acid', type: 'Humectant', source: 'Microbial fermentation',
    contains: ['hyaluronic acid'],
    compatible: ['Niacinamide', 'Ectoin'], avoid: [],
    citations: ['Multi-weight HA blends compared for depth of hydration', 'Humectant layering on damp skin increases water uptake']
  },
  'Bakuchiol': {
    slug: 'bakuchiol', type: 'Retinoid alternative', source: 'Psoralea corylifolia seed',
    contains: ['bakuchiol'],
    compatible: ['Niacinamide', 'Ceramide NP'], avoid: ['Papain'],
    citations: ['12-week bakuchiol vs retinol tolerance comparison', 'Receptor-pathway activity without photosensitivity']
  },
  'Niacinamide': {
    slug: 'niacinamide', type: 'Barrier + tone', source: 'Synthetic (vitamin B3)',
    contains: ['niacinamide'],
    compatible: ['Hyaluronic Acid', 'Ceramide NP', 'Gluconolactone'], avoid: [],
    citations: ['Tone and barrier effects across 2–5%', 'Sebum regulation in oily skin']
  },
  'Ceramide NP': {
    slug: 'ceramide-np', type: 'Barrier lipid', source: 'Synthetic, skin-identical',
    contains: ['ceramide'],
    compatible: ['Niacinamide', 'Colloidal Oatmeal', 'Squalane'], avoid: [],
    citations: ['Ceramide/cholesterol/fatty-acid ratios in barrier repair', 'Replenishment reduces tightness and reactivity']
  },
  'Ectoin': {
    slug: 'ectoin', type: 'Humectant + protectant', source: 'Extremophile fermentation',
    contains: ['ectoin'],
    compatible: ['Hyaluronic Acid', 'Beta-glucan'], avoid: [],
    citations: ['Cell water-shell protection under heat and dehydration stress']
  },
  'Squalane': {
    slug: 'squalane', type: 'Emollient', source: 'Olive / sugarcane',
    contains: ['squalane'],
    compatible: ['Ceramide NP', 'Vitamin E'], avoid: [],
    citations: ['Non-comedogenic, oxidation-stable emollient compared with mineral oil']
  },
  'Gluconolactone': {
    slug: 'gluconolactone', type: 'Exfoliant (PHA)', source: 'Synthetic polyhydroxy acid',
    contains: ['gluconolactone'],
    compatible: ['Niacinamide', 'Hyaluronic Acid'], avoid: ['Papain'],
    citations: ['Large-molecule PHA stays on the stratum corneum', 'Surface smoothing without AHA stinging']
  },
  'Non-Nano Zinc Oxide': {
    slug: 'zinc-oxide', type: 'UV filter (mineral)', source: 'Mineral, non-nano',
    contains: ['zinc oxide'],
    compatible: ['Vitamin E', 'Squalane'], avoid: [],
    citations: ['Broad-spectrum UVA/UVB at 18.6% with a transparent finish']
  },
  'Papain': {
    slug: 'papain', type: 'Enzyme exfoliant', source: 'Carica papaya',
    contains: ['papain'],
    compatible: ['Blueberry & Acai'], avoid: ['Gluconolactone', 'Bakuchiol'],
    citations: ['Keratin digestion for a weekly surface reset']
  },
  'Colloidal Oatmeal': {
    slug: 'colloidal-oatmeal', type: 'Soothing', source: 'Avena sativa',
    contains: ['oatmeal', 'oat kernel'],
    compatible: ['Ceramide NP', 'Madecassoside'], avoid: [],
    citations: ['Regulator-recognised anti-irritant; protective film on compromised skin']
  },
  'Madecassoside': {
    slug: 'madecassoside', type: 'Soothing', source: 'Centella asiatica fraction',
    contains: ['madecassoside'],
    compatible: ['Colloidal Oatmeal', 'Ceramide NP'], avoid: [],
    citations: ['Redness and post-blemish mark support']
  },
  'Blueberry & Acai': {
    slug: 'blueberry-acai', type: 'Antioxidant', source: 'Cold-pressed fruit fractions',
    contains: ['blueberry'],
    compatible: ['Papain', 'Vitamin E'], avoid: [],
    citations: ['Anthocyanin antioxidant fractions against overnight oxidative stress']
  }
};
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
GLOSSARY.forEach((g) => {
  Object.assign(g, GLOSSARY_EXTRA[g.n] || {});
  g.slug = g.slug || slugify(g.n);
  const frags = g.contains || [g.n.toLowerCase()];
  g.products = PRODUCTS.filter((p) => p.keyActives.some((k) => {
    const kn = k.n.toLowerCase();
    return frags.some((f) => kn.includes(f.toLowerCase()));
  })).map((p) => p.id);
});

/* ---------- routine builder ---------- */const STEPS = [
  { id: 0, name: 'Cleanse' },
  { id: 1, name: 'Treat' },
  { id: 2, name: 'Hydrate' },
  { id: 3, name: 'Protect' }
];

const CONCERNS = [
  { id: 'dehydration', label: 'Dehydration', desc: 'Dull, tight skin that drinks up everything', icon: 'drop' },
  { id: 'fine-lines', label: 'Fine lines', desc: 'First signs of firmness and texture change', icon: 'clock' },
  { id: 'pigmentation', label: 'Pigmentation', desc: 'Uneven tone, marks and post-blemish shadow', icon: 'sun' },
  { id: 'texture', label: 'Texture', desc: 'Roughness, congestion or visible pores', icon: 'wave' },
  { id: 'sensitivity', label: 'Sensitivity', desc: 'Redness, reactivity and a weakened barrier', icon: 'leaf' },
  { id: 'dullness', label: 'Dullness', desc: 'Skin that looks tired no matter what', icon: 'spark' }
];

const TYPES = [
  { id: 'dry', label: 'Dry', desc: 'Rarely oily, often tight and flaky' },
  { id: 'normal', label: 'Balanced', desc: 'Comfortable most days' },
  { id: 'combination', label: 'Combination', desc: 'Oily T-zone, dry cheeks' },
  { id: 'oily', label: 'Oily', desc: 'Shine by midday, visible pores' },
  { id: 'sensitive', label: 'Sensitive', desc: 'Stings, flushes, reacts easily' }
];

const GOALS = [
  { id: 'minimal', label: 'Keep it simple', desc: 'Three steps, done properly', steps: ['Cleanse', 'Treat', 'Protect'] },
  { id: 'layered', label: 'Layer it up', desc: 'The full six-step ritual', steps: ['Cleanse', 'Treat', 'Treat', 'Hydrate', 'Seal', 'Protect'] },
  { id: 'reset', label: 'Weekly reset', desc: 'Deep care with a masque', steps: ['Cleanse', 'Treat', 'Hydrate', 'Mask', 'Protect'] }
];

/* Builds a routine from answers. Rules are intentionally simple and legible.
   Steps are ordered by each product's `step` (1 Cleanse → 5 Protect). */
function buildRoutine({ concern, type, goal }) {
  let out = [];
  const add = (id, why) => {
    const p = byId(id);
    if (p && !out.find((o) => o.id === id)) out.push({ id, why });
  };
  const has = (id) => out.some((o) => o.id === id);

  /* 1 — Cleanse */
  add('cloudmilk-cleanser', 'Amino-acid cleanser that lifts SPF without stripping the barrier');

  /* 2 — Treat */
  if (concern === 'texture' || type === 'oily') add('clarity-toner', '4% PHA refines roughness and congestion between washes');
  if (concern === 'pigmentation' || concern === 'fine-lines' || concern === 'dullness') add('radiance-ritual', 'Bakuchiol and niacinamide even tone while you sleep');
  if (concern === 'sensitivity' && !has('barrier-balm')) add('barrier-balm', 'Ceramide complex to rebuild what actives can strip');
  if (goal === 'reset') add('night-bloom-masque', 'One weekly enzyme reset, no downtime');

  /* 3 — Hydrate */
  if (concern === 'dehydration' || type === 'dry' || concern === 'fine-lines' || concern === 'dullness') add('dewdrop-serum', 'Five weights of hyaluronic acid for immediate plump');
  if (type === 'oily' || type === 'combination') add('dewdrop-serum', 'Water-weight hydration without heaviness');

  /* 4 — Seal */
  if (concern === 'sensitivity' || type === 'dry') add('barrier-balm', 'Rescue balm for a compromised or reactive barrier');
  if (goal === 'layered') add('golden-hour-oil', 'Seals the routine with a satin finish');

  /* 5 — Protect */
  add('pure-shield-spf', 'Non-nano mineral SPF 50 — the step that protects everything else');

  /* keep to the chosen length, but never drop SPF */
  const cap = goal === 'minimal' ? 3 : goal === 'reset' ? 5 : 6;
  if (out.length > cap) {
    const keep = new Set(['pure-shield-spf']);
    const priority = ['cloudmilk-cleanser', 'dewdrop-serum', 'radiance-ritual', 'night-bloom-masque', 'clarity-toner', 'barrier-balm', 'golden-hour-oil'];
    out = out.filter((o) => keep.has(o.id) || priority.indexOf(o.id) < cap - 1);
  }

  /* canonical layering order: thinnest to thickest, always */
  out.sort((a, b) => byId(a.id).step - byId(b.id).step);
  return out;
}

/* Pure discovery filter shared by shop + concern hubs.
   state: { type, concern, skin, step, ingredient, minPrice, maxPrice, inStock } */
function filterProducts(list, state) {
  state = state || {};
  const all = (v) => v == null || v === '' || v === 'all';
  return list.filter((p) => {
    if (!all(state.type) && p.type.toLowerCase() !== state.type) return false;
    if (!all(state.concern) && p.concerns.indexOf(state.concern) === -1) return false;
    if (!all(state.skin) && !(p.skinTypes.indexOf(state.skin) !== -1 || p.skinTypes.indexOf('all') !== -1)) return false;
    if (!all(state.step) && String(p.step) !== String(state.step)) return false;
    if (!all(state.ingredient)) {
      const q = String(state.ingredient).toLowerCase();
      const hit = (p.keyActives || []).some((k) => k.n.toLowerCase().indexOf(q) !== -1);
      if (!hit) return false;
    }
    if (state.inStock && !p.variants.some((v) => v.stock > 0)) return false;
    if (state.minPrice != null && p.price < state.minPrice) return false;
    if (state.maxPrice != null && p.price > state.maxPrice) return false;
    return true;
  });
}

function routineTotals(items) {
  const list = items.map((o) => ({ ...o, p: byId(o.id) }));
  const full = list.reduce((s, o) => s + o.p.price, 0);
  const bundle = Math.round(full * (1 - BUNDLE_OFF) * 100) / 100;
  return { list, full, bundle, save: Math.round((full - bundle) * 100) / 100 };
}

/* ---------- texture + suitability (merchandising copy, shared by PDP + compare) ---------- */
const TISSUE = {
  'cloudmilk-cleanser': { texture: 'Cushiony milk cream', bestFor: 'Dry, reactive and combination skin that tightens after washing' },
  'dewdrop-serum': { texture: 'Weightless water gel', bestFor: 'Dehydrated skin, or anyone layering under makeup' },
  'radiance-ritual': { texture: 'Velvet night cream', bestFor: 'Tone, texture and first fine lines; retinol-sensitive skin' },
  'barrier-balm': { texture: 'Whipped occlusive balm', bestFor: 'Over-exfoliated, wind-burnt or reactive skin' },
  'pure-shield-spf': { texture: 'Fluid mineral lotion', bestFor: 'Every skin tone; reactive skin and eye area' },
  'golden-hour-oil': { texture: 'Dry-touch face oil', bestFor: 'Dry and mature skin that wants a satin finish' },
  'clarity-toner': { texture: 'Watery leave-on tonic', bestFor: 'Congestion, texture and visible pores' },
  'night-bloom-masque': { texture: 'Purple enzyme masque', bestFor: 'Weekly resurfacing without downtime' }
};
PRODUCTS.forEach((p) => Object.assign(p, TISSUE[p.id] || {}));

/* when each step is used: am only, pm only, or both */
const TIME_OF_USE = {
  'cloudmilk-cleanser': 'both', 'dewdrop-serum': 'both', 'radiance-ritual': 'pm',
  'barrier-balm': 'both', 'pure-shield-spf': 'am', 'golden-hour-oil': 'pm',
  'clarity-toner': 'both', 'night-bloom-masque': 'pm'
};
PRODUCTS.forEach((p) => { p.timeOfUse = TIME_OF_USE[p.id] || 'both'; });

/* ---------- evidence: claims + sample study data ----------
   The whole brand promises published evidence. `CLAIMS` makes every figure
   auditable; `RESULTS` renders a wear-study timeline. BOTH ARE SAMPLE DATA
   for this concept build and must carry the "sample" marker wherever shown. */
const CLAIMS = {
  'ha-2': { label: '2% HA complex', wording: 'Five molecular weights of hyaluronic acid, total 2%', basis: 'Concentration used in published multi-weight HA studies', confidence: 'Strong', where: 'Dewdrop Hydrating Serum' },
  'ectoin-1': { label: '1% ectoin', wording: 'Ectoin at 1%', basis: 'Within the 0.5–2% range used in barrier and dehydration trials', confidence: 'Moderate', where: 'Dewdrop Hydrating Serum' },
  'bakuchiol-1': { label: '1% bakuchiol', wording: 'Bakuchiol at 1%', basis: 'Concentration used in the 12-week bakuchiol comparison study', confidence: 'Strong', where: 'Radiance Ritual Cream' },
  'niacinamide-4': { label: '4% niacinamide', wording: 'Niacinamide at 4%', basis: 'Effective for tone and barrier at 2–5% without flushing', confidence: 'Strong', where: 'Radiance Ritual Cream' },
  'ceramide-3': { label: '3% ceramide complex', wording: 'Ceramide NP/AP/EOP stack at 3%', basis: 'Sits inside the range used in barrier-repair trials', confidence: 'Strong', where: 'Barrier Balm' },
  'zinc-18.6': { label: '18.6% zinc oxide', wording: 'Non-nano zinc oxide at 18.6%', basis: 'Provides SPF 50 with UVA protection at this level', confidence: 'Strong', where: 'Pure Shield SPF 50' },
  'squalane-78': { label: '78% squalane', wording: 'Olive/sugarcane squalane at 78%', basis: 'Emollient base level; non-comedogenic', confidence: 'Moderate', where: 'Golden Hour Oil' },
  'pha-4': { label: '4% PHA', wording: 'Gluconolactone (PHA) at 4%', basis: 'Surface resurfacing without the sting of AHAs', confidence: 'Strong', where: 'Clarity PHA Tonic' },
  'papain-2': { label: '2% papain', wording: 'Papain enzyme at 2%', basis: 'Weekly enzymatic exfoliation dose', confidence: 'Moderate', where: 'Night Bloom Masque' },
  'patch-200': { label: '200 volunteers, 12 weeks', wording: 'Patch-tested on 200 volunteers over 12 weeks', basis: 'Internal wear study — self-report plus instrument measures', confidence: 'Company study', where: 'Referenced sitewide' },
  'reviews-3740': { label: '3,740 verified reviews', wording: '3,740 verified reviews across the range', basis: 'Sum of per-product review counts on this site', confidence: 'Site data', where: 'Home page' }
};

/* Sample wear-study results per product. `sample: true` is rendered in the UI. */
const RESULTS = {
  'dewdrop-serum': { metric: 'Instrument-measured hydration', points: [[4, 18], [8, 31], [12, 40]], note: '92% of participants reported skin that stayed comfortable past mid-afternoon.' },
  'radiance-ritual': { metric: 'Visible tone evenness (expert-graded)', points: [[4, 12], [8, 24], [12, 33]], note: 'Two participants withdrew for unrelated reasons; results are mixed at week 4.' },
  'barrier-balm': { metric: 'Reduced feeling of tightness', points: [[1, 22], [4, 48], [12, 61]], note: 'Most useful as a rescue during over-exfoliation.' },
  'pure-shield-spf': { metric: 'Reported no white cast', points: [[1, 96]], note: 'Tested across Fitzpatrick III–VI. No reapplication-related pilling reported.' },
  'cloudmilk-cleanser': { metric: 'Barrier lipids retained after cleansing', points: [[2, 14], [8, 21], [12, 26]], note: 'Measured against a foaming cleanser control.' },
  'golden-hour-oil': { metric: 'Reported softer skin on waking', points: [[2, 27], [8, 44], [12, 52]], note: 'Best tolerated on dry and mature skin.' },
  'clarity-toner': { metric: 'Tactile smoothness (expert-graded)', points: [[4, 16], [6, 28], [12, 37]], note: 'Pigment improvement is slower — around week eight.' },
  'night-bloom-masque': { metric: 'Surface refinement after 15 minutes', points: [[1, 19], [4, 34], [8, 41]], note: 'No reported tightness or peeling; safe weekly.' }
};

/* genuine layering conflicts (no fabricated warnings) */
const AVOID = {
  'clarity-toner': ['night-bloom-masque'],
  'night-bloom-masque': ['clarity-toner'],
  'radiance-ritual': ['night-bloom-masque']
};

/* maps a product's key-active name to a claim id, so figures can be audited */
const CLAIM_BY_ACTIVE = {
  'Hyaluronic acid complex': 'ha-2',
  'Ectoin': 'ectoin-1',
  'Bakuchiol': 'bakuchiol-1',
  'Niacinamide': 'niacinamide-4',
  'Ceramide NP': 'ceramide-3',
  'Ceramide complex': 'ceramide-3',
  'Non-nano zinc oxide': 'zinc-18.6',
  'Squalane': 'squalane-78',
  'Gluconolactone (PHA)': 'pha-4',
  'Papain enzyme': 'papain-2'
};

/* ---------- money ---------- */
const money = (n) => '$' + n.toFixed(2).replace(/\.00$/, '');

/* price per millilitre from the first purchasable variant */
function pricePerMl(p) {
  const v = p.variants.find((x) => x.stock > 0) || p.variants[0];
  const ml = parseFloat((v.label.match(/(\d+)\s*ml/i) || [])[1]);
  return ml ? v.price / ml : null;
}

window.NURA = { PRODUCTS, byId, GLOSSARY, STEPS, CONCERNS, TYPES, GOALS, CLAIMS, RESULTS, CLAIM_BY_ACTIVE, AVOID, buildRoutine, routineTotals, filterProducts, pricePerMl, money, IMG, FREE_SHIP, BUNDLE_OFF };
