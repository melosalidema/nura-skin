# NŪRA Skin — Implementation Plan

> **For the builder agent:** REQUIRED SUB-SKILL: use `subagent-driven-development` (or `executing-plans`) to implement task-by-task. Keep the `- [ ]` checkboxes. Load the skills named in each task's **Builder skills** line before starting. Do not add runtime dependencies to the site.

**Goal:** Turn a beautiful but unproven static storefront into the most evidence-forward, best-discovering clinical skincare commerce experience on the web, without losing the "Heritage Apothecary" identity.

**Architecture:** Pure static HTML/CSS/vanilla JS. No build step, no runtime dependencies. Data lives in `assets/js/data.js` plus new sibling data modules. New behaviour ships as isolated page modules; shared chrome stays in `app.js`. Tests: Node's built-in runner (pure logic via VM loader) + Python Playwright (DOM, responsive, accessibility).

**Tech Stack:** HTML5, CSS custom properties, vanilla ES2019, localStorage, IntersectionObserver, View Transitions, `node --test`, Playwright (Python), Pillow (dev-only image optimization).

---

## Decision Log (ideas chosen, justified by famous skincare sites)

| ID | Decision | Justified by |
|---|---|---|
| HERO-01 | Product-as-hero | Aesop, Grown Alchemist, Le Labo, Tatcha |
| HERO-02 | Three-question hero | Curology, Proven, Function of Beauty, Murad (BASIC/DEPT) |
| DISC-01/02/03/04 | Skin type, routine step, ingredient, price/availability filters | Sephora, Cult Beauty, Paula's Choice, Soko Glam, The Ordinary |
| DISC-05 | Concern hub pages | Paula's Choice, Murad, La Roche-Posay |
| DISC-06 | Find-your-match chooser | Murad/BASIC/DEPT, SkinCeuticals |
| DISC-08 | Build-your-own bundle | Ritual, Function of Beauty |
| PDP-01/05/14 | Results timeline, clinical data card, "expect by week 4" | No7, Dermalogica, Clinical Skin, SkinCeuticals |
| PDP-02 | Active → glossary links | Paula's Choice, DECIEM |
| PDP-03/04 | Texture demo, routine placement | Aesop, Tatcha, Soko Glam |
| PDP-06 | Compatibility / "don't layer with" | The Ordinary regimen conflicts |
| PDP-07 / CMP-01/02/07 | Comparison suite | Sephora, Paula's Choice, SkinCeuticals |
| PDP-08 | Desktop sticky buy | Retail standard |
| PDP-09 ★ | Cost-per-use transparency | The Ordinary unit pricing, extended |
| PDP-16 | Pairs with — and why | The Ordinary, Sephora |
| ING-01/02/03/10 | Ingredient atlas, reverse index, INCI annotator | Paula's Choice Beautypedia, INCI Decoder, Skincarisma |
| ING-06/08 | Why we use/leave out, citations | Paula's Choice, DECIEM/NIOD |
| ROUT-01/02/04/05/11 | Rule fix, AM/PM, layering, compatibility, safety | Soko Glam, Curology, The Ordinary |
| ROUT-13 | Stacks show all products | Honesty norm |
| QUIZ-01/02/05/10 | Quiz expansion, no email gate, rationale, printable | Curology, Proven, Function of Beauty, Murad |
| STORY-06 | Exclusion-list page | Paula's Choice no-no list |
| CONT-01/02/07/10 | Journal hub, concern guides, glossary links, FAQ schema | Murad, La Roche-Posay, Paula's Choice |
| SEARCH-01/02/03/06 | Instant grouped search, ingredient/concern, keyboard, recovery | Sephora, Cult Beauty |
| EC-01/03/05/08 | Cart page, refill, cross-sell, back-in-stock | Glossier, Sephora, Cult Beauty |
| MOB-01/03 | Swipe gallery, bottom-sheet filters | Retail mobile standard |
| BRAND-02 | Consistent product photography | Aesop, Grown Alchemist, Le Labo |
| TRUST-01 ★ | Claims/evidence ledger (interactive) | Dermalogica/Paula's Choice methodology |
| TRUST-02/03/08 | Methodology, verified reviews, mixed-results honesty | Paula's Choice, Dermalogica, Sephora |
| SIG-01 ★ | The Formula Ledger | Unique |
| SIG-02 ★ | The Sequence — routine prescription + receipt | Curology/Proven + unique receipt |
| SIG-03 | Inside the Formulation scroll narrative | Dermalogica, Aesop |
| SIG-04 ★ | Ingredient Index atlas | Paula's Choice dictionary, upgraded |
| EXP-06 ★ | Compatibility matrix | The Ordinary conflicts, made interactive |
| EXP-12 ★ | Dose dial | Unique |
| EXP-13 ★ | Reverse-label INCI annotator | INCI Decoder, brand-side |
| EXP-14 ★ | Routine receipt | Unique |
| BRAND-07 ★ | Interactive wax seal | Unique |
| EXP-20 ★ | Apothecary scale micro-interaction | Unique |
| EC-02 / SIG-05 / QUIZ-06 / EXP-02 / EXP-17 | Subscription, skin-over-time, email routine, reminders | Vintner's Daughter, Naked & Thriving, Glo — **UI prototype only** |

**Rejected:** AR/camera scan, ritual sound, generative constellation, before/after hero without labelled imagery, demo ribbon on marketing surfaces, any invented certification/endorsement/claim.

---

## Skill Map

| Phase | Mandatory builder skills |
|---|---|
| Pre-flight | `test-driven-development`, `testing-webapps`, `code-quality` |
| Phase 1 | `systematic-debugging`, `test-driven-development`, `verifying-before-completion`, `reviewing-security` |
| Phase 2 | `designing-user-experience`, `navigation-design`, `ui-patterns`, `responsive-design`, `building-accessible-interfaces`, `usability`, `testing-webapps` |
| Phase 3 | `designing-frontend-interfaces`, `component-patterns`, `applying-themes`, `images-media`, `building-accessible-interfaces` |
| Phase 4 | `frontend-design`/`anthropic-frontend-design`, `web-typography`, `visual-direction`, `design-trends`, `landing-pages`, `ai-slop` |
| Phase 5 | `design-patterns`, `designing-frontend-interfaces`, `component-patterns`, `applying-themes`, `building-accessible-interfaces`, `investigating-performance` |
| Phase 6 | `reviewing-interface-quality`, `ai-slop`, `investigating-performance`, `code-quality`, `building-accessible-interfaces` |
| Throughout | `verifying-before-completion`, `requesting-code-review`, `receiving-code-review`, `executing-plans` |
| Agents | `code-reviewer`, `interface-reviewer`, `security-reviewer`, `spec-reviewer`, `code-quality-reviewer` |

---

## Guardrails (binding)

1. No runtime dependencies. Vanilla only. Dev tooling (Node runner, Playwright, Pillow) must not ship.
2. Preserve the system: one radius (0), no gradients, no glass, no shadows except the drawer, tokens from `main.css`.
3. Accessibility parity: focus rings, keyboard operation, `aria-*`, ≥44px touch targets, reduced-motion, JS-off content.
4. Truthfulness: all results/metrics/reviews are fictional. Every new numeric module renders "Sample data — concept build". Never invent certifications or endorsements.
5. Performance: LCP < 2.5s, CLS < 0.1, no `transition: all`, animate transform/opacity only.
6. Files that change together live together; don't grow `app.js` past ~700 lines.

---

## File Structure

```
assets/js/  data.js (edit) evidence.js ledger.js search.js compare.js ingredients.js cart-page.js
assets/css/ main.css components.css features.css (new) print.css (new)
tests/      nura.test.mjs
tools/      optimize-images.py  tests/test_site.py
+ concern pages, compare.html, cart-page.html, ingredients.html, sitemap.xml, robots.txt, 404.html
docs/plans/ 2026-10-07-nura-skin-implementation.md
```

---

## Pre-flight — Test harness

**Builder skills:** `test-driven-development`, `testing-webapps`.

- [ ] Create `tests/nura.test.mjs` with a `vm` loader that evaluates `assets/js/data.js` in a `{ window: {} }` context and exposes `ctx.window.NURA`.
- [ ] Add a smoke test: `N.PRODUCTS.length === 8`, `N.byId('dewdrop-serum')`.
- [ ] Run `node --test` → PASS.
- [ ] Create `tools/tests/test_site.py` (Playwright): serve the dir, screenshot 1440 + 390, collect console errors.
- [ ] Commit `test: add node + playwright test harness`.

## Phase 1 — Foundation

**Builder skills:** `systematic-debugging`, `test-driven-development`, `verifying-before-completion`, `reviewing-security`.

- [ ] **1.1** Normalise `step` (0–5) + add `stage` name; fix `product.js` "Step X of 5"; remove duplicate cleanse in `buildRoutine`; test each product step in range and one-cleanser rule.
- [ ] **1.2** Add `Oil`/`Toner` to shop `TYPES`; add pure `filterProducts(products, state)` in `data.js` with skin type / price / availability; wire chips; test Golden Hour filterable.
- [ ] **1.3** Fix `product.js:94` stray `</li>`, `Glucoasmine` typo, `Caprylic/Caprylic` typo.
- [ ] **1.4** Canonical + absolute OG; JSON-LD (`Organization`, `Product`+`Offer`+`AggregateRating`, `BreadcrumbList`, `FAQPage`); `sitemap.xml`, `robots.txt`, `404.html`; test JSON parses.
- [ ] **1.5** `tools/optimize-images.py` (Pillow) → AVIF/WebP + `srcset`, `<picture>` in HTML; ensure dimensions; test no CLS.

## Phase 2 — UX & Discovery

**Builder skills:** `designing-user-experience`, `navigation-design`, `ui-patterns`, `responsive-design`, `building-accessible-interfaces`, `usability`, `testing-webapps`.

- [ ] **2.1** Extract `mountSearch` → `assets/js/search.js`; index products (name/sub/type/concerns/skinTypes/actives/blurb) + glossary + journal; debounce, grouping, arrow-key nav, `aria-live` count, zero-result recovery.
- [ ] **2.2** Filter groups (skin type, step, ingredient, price, availability) with URL state; concern hub pages; mobile bottom-sheet filters.
- [ ] **2.3** Compare tray (max 3, localStorage) + `compare.html` ledger; inline "Right for you? / Not for you if"; "Which exfoliant?" chooser.
- [ ] **2.4** `cart-page.html` + `cart-page.js` (line edit, gift note, delivery estimate, cross-sell); refill purchase; back-in-stock notify; desktop sticky buy.

## Phase 3 — Product & Ingredient

**Builder skills:** `designing-frontend-interfaces`, `component-patterns`, `applying-themes`, `images-media`, `building-accessible-interfaces`.

- [ ] **3.1** `evidence.js` sample `RESULTS` (wk 1/4/8/12) + PDP timeline & data card with "Sample data — concept build" label; "expect by week 4".
- [ ] **3.2** Expand `GLOSSARY` (`slug`, `products`, `type`, `source`, `citations`, `compatible`, `avoid`); `ingredients.html` + `ingredients.js` atlas; two-way links; annotated INCI.
- [ ] **3.3** PDP depth: active→glossary, texture module, placement diagram, compatibility warnings, cost-per-use, pairs-with reasoning.

## Phase 4 — Brand & Content

**Builder skills:** `frontend-design`/`anthropic-frontend-design`, `web-typography`, `visual-direction`, `design-trends`, `landing-pages`, `ai-slop`.

- [ ] **4.1** Consistent product photography direction; replace stock; `ai-slop` + `reviewing-interface-quality` review.
- [ ] **4.2** Methodology page, verified-review treatment, mixed-results honesty, exclusion-list page.
- [ ] **4.3** Journal hub (real article URLs), concern guides, glossary cross-links.
- [ ] **4.4** Product-as-hero still-life + inline three-question chips (prefill builder).

## Phase 5 — Signature

**Builder skills:** `design-patterns`, `designing-frontend-interfaces`, `component-patterns`, `applying-themes`, `building-accessible-interfaces`, `investigating-performance`.

- [ ] **5.1** ★ Formula Ledger: `CLAIMS` data + `ledger.js` margin panel; wire every figure as `data-claim`; deep links.
- [ ] **5.2** ★ The Sequence: rule-engine `buildRoutine` (ordered steps, AM/PM, compatibility, safety, swap); layering diagram; printable routine receipt.
- [ ] **5.3** ★ Compatibility matrix (drag + keyboard) + Dose dial.
- [ ] **5.4** Quiz expansion + reverse-label INCI annotator.
- [ ] **5.5** Disabled UI prototypes: subscription, skin-over-time, email/share routine, reminders, time capsule.

## Phase 6 — Polish

**Builder skills:** `reviewing-interface-quality`, `ai-slop`, `investigating-performance`, `code-quality`, `building-accessible-interfaces`.

- [ ] Full axe + keyboard walk; `interface-reviewer` + `code-reviewer` + `security-reviewer` passes; motion audit; responsive 390/768/1024/1440 + 200% zoom; slop risk < 15/100.

---

## Verification Matrix (definition of done)

| Check | Tool |
|---|---|
| Pure logic | `node --test` green |
| DOM behaviour/states/keyboard | `tools/tests/test_site.py` |
| Responsive | screenshots 390/768/1024/1440 |
| Accessibility | axe + keyboard walk |
| Performance | LCP < 2.5s, CLS < 0.1, no console errors |
| Truthfulness | sample numeric modules labelled |
| System integrity | one radius, no gradients/glass, tokens only |
| Slop risk | `ai-slop` < 15/100 |
| Review | interface/code/spec reviewer sign-off |
