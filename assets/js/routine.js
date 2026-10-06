/* routine builder — 3 step quiz, sequenced bundle, 15% off */
(function () {
  'use strict';
  const N = window.NURA, UI = window.UI;
  const $ = (s) => document.querySelector(s);
  const money = N.money;

  const QUIZ = [
    {
      key: 'concern', q: 'What would you like to change?',
      h: 'Pick the one that bothers you most. You can add more later.',
      items: N.CONCERNS
    },
    {
      key: 'type', q: 'How does your skin behave by mid-afternoon?',
      h: 'Skin type decides texture and order more than it decides ingredients.',
      items: N.TYPES
    },
    {
      key: 'goal', q: 'How much routine can you realistically do?',
      h: 'Honesty here produces better results than ambition. Most routines fail at week three.',
      items: N.GOALS
    }
  ];

  const answers = {};
  let step = 0;

  /* ---------- progress ---------- */
  function renderSteps() {
    $('#steps').innerHTML = QUIZ.map((q, i) =>
      '<li class="step' + (i === step ? ' is-active' : answers[q.key] ? ' is-done' : '') + '">' +
        '<i>' + (answers[q.key] && i !== step ? '✓' : i + 1) + '</i>' + q.key.charAt(0).toUpperCase() + q.key.slice(1) +
      '</li>' + (i < QUIZ.length - 1 ? '<li class="step__sep" aria-hidden="true"></li>' : '')
    ).join('');
  }

  /* ---------- panels ---------- */
  function renderPanel() {
    const q = QUIZ[step];
    const html =
      '<section class="panel is-on" id="panel-' + step + '" aria-labelledby="q-' + step + '">' +
        '<p class="eyebrow">Step ' + (step + 1) + ' of ' + QUIZ.length + '</p>' +
        '<h2 class="display panel__q" id="q-' + step + '">' + q.q + '</h2>' +
        '<p class="panel__h">' + q.h + '</p>' +
        '<div class="opts" role="group" aria-labelledby="q-' + step + '">' +
          q.items.map((it) => {
            const chosen = answers[q.key] === it.id;
            const locked = step > 0 && !chosen;
            return '<button class="opt-card" type="button" data-pick="' + q.key + '" data-id="' + it.id + '" aria-pressed="' + chosen + '"' + (locked ? ' style="opacity:.4"' : '') + '>' +
              '<b>' + it.label + '</b><span>' + it.desc + '</span></button>';
          }).join('') +
        '</div>' +
        (step > 0 ? '<div class="panel__nav"><button class="btn btn-ghost btn-sm" type="button" data-back>← Back</button></div>' : '') +
      '</section>';
    $('#panels').innerHTML = html;

    $('#panels').querySelectorAll('[data-pick]').forEach((b) => b.addEventListener('click', () => {
      answers[b.getAttribute('data-pick')] = b.getAttribute('data-id');
      if (step < QUIZ.length - 1) {
        step++;
        renderAll();
      } else {
        renderAll();
        renderSummary(true);
        const s = document.querySelector('.summary');
        if (s) s.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }));
    const back = $('#panels [data-back]');
    if (back) back.addEventListener('click', () => { step--; renderAll(); });
  }

  /* ---------- summary ---------- */
  function build() {
    if (!(answers.concern && answers.type && answers.goal)) return null;
    return N.buildRoutine(answers);
  }

  function renderSummary(done) {
    const list = build();
    const host = $('#sum-list'), tot = $('#sum-tot'), act = $('#sum-actions'), tag = $('#save-tag');

    if (!list) {
      tag.textContent = '';
      host.innerHTML = '<p class="summary__empty">Your routine appears here as you answer — three questions is all it takes.</p>';
      tot.innerHTML = '';
      act.innerHTML = '<p class="summary__locked">Complete the questions to unlock</p>';
      return;
    }

    const t = N.routineTotals(list);
    tag.textContent = 'Bundle −' + Math.round(N.BUNDLE_OFF * 100) + '%';
    const row = (o) =>
      '<div class="summary__row">' +
        '<img src="' + N.IMG(o.id, 1) + '" alt="" loading="lazy">' +
        '<span><b>' + o.p.name + '</b><span>' + o.why + '</span></span>' +
        '<i>' + money(o.p.price) + '</i>' +
      '</div>';
    const am = t.list.filter((o) => o.p.timeOfUse !== 'pm');
    const pm = t.list.filter((o) => o.p.timeOfUse !== 'am');
    host.innerHTML =
      '<p class="summary__when">Morning</p>' + am.map(row).join('') +
      '<p class="summary__when">Evening</p>' + pm.map(row).join('');

    const incompatible = t.list.some((o) => o.id === 'clarity-toner') && t.list.some((o) => o.id === 'night-bloom-masque');
    const warn = incompatible
      ? '<p class="summary__warn">This routine contains both an exfoliating tonic and an enzyme masque. Use one or the other on any given night — never both.</p>'
      : '';

    tot.innerHTML = warn +
      '<div><span>Individual price</span><span><s>' + money(t.full) + '</s></span></div>' +
      '<div><span>Bundle saving</span><span style="color:var(--brass-ink)">−' + money(t.save) + '</span></div>' +
      '<div><span>Bundle total</span><span><b>' + money(t.bundle) + '</b></span></div>' +
      '<p class="summary__timeline">Most people notice a difference by week four, and a clear one by week eight. Skin is not a controlled variable — record how yours responds.</p>';

    act.innerHTML =
      '<button class="btn btn-block" type="button" data-add-routine>Add all ' + t.list.length + ' to bag · ' + money(t.bundle) + '</button>' +
      '<div style="display:flex;gap:8px;margin-top:8px">' +
        '<a class="btn btn-ghost btn-sm" style="flex:1" href="product.html?id=' + t.list[0].id + '">View first step</a>' +
        (done ? '<button class="btn btn-ghost btn-sm" style="flex:1" type="button" data-restart>Start over</button>' : '') +
      '</div>' +
      '<button class="btn btn-ghost btn-sm btn-block" style="margin-top:8px" type="button" data-print>Print my routine</button>';

    const printBtn = $('[data-print]', act);
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    $('[data-add-routine]', act).addEventListener('click', () => {
      t.list.forEach((o) => {
        const p = o.p;
        const v = p.variants.find((x) => x.stock > 0) || p.variants[0];
        window.Cart.add(o.id, v.id, 1);
      });
      window.openCart();
    });
    const rs = $('[data-restart]', act);
    if (rs) rs.addEventListener('click', () => { step = 0; Object.keys(answers).forEach((k) => delete answers[k]); renderAll(); });
  }

  function renderAll() { renderSteps(); renderPanel(); renderSummary(); }

  /* ---------- ready-made stacks ---------- */
  const STACKS = [
    { ids: ['cloudmilk-cleanser', 'dewdrop-serum', 'pure-shield-spf'], t: 'The Daily Three', d: 'Cleanse, hydrate, protect. The routine that prevents most problems.' },
    { ids: ['cloudmilk-cleanser', 'dewdrop-serum', 'radiance-ritual', 'pure-shield-spf'], t: 'The Overnight Repair', d: 'Adds a bakuchiol night cream to the daily three.' },
    { ids: ['cloudmilk-cleanser', 'dewdrop-serum', 'barrier-balm', 'pure-shield-spf'], t: 'The Reset', d: 'For reactive or over-exfoliated skin. Calms first, then works.' },
    { ids: ['clarity-toner', 'dewdrop-serum', 'golden-hour-oil', 'pure-shield-spf'], t: 'The Refinement', d: 'PHA, hydration and a sealing oil for texture and tone.' }
  ];
  function renderStacks() {
    const host = $('#stacks');
    host.innerHTML = STACKS.map((s, i) => {
      const t = N.routineTotals(s.ids.map((id) => ({ id })));
      const p = N.byId(s.ids[i % s.ids.length]);
      return '<article class="card">' +
        '<div class="card__frame"><a class="card__media" href="product.html?id=' + p.id + '">' +
          '<span class="card__badges"><span class="badge badge--gold">Save 15%</span></span>' +
          '<img class="main" src="' + N.IMG(p.id, 1) + '" alt="' + s.t + '" loading="lazy">' +
          '<img class="alt" src="' + N.IMG(p.id, 2) + '" alt="" aria-hidden="true" loading="lazy">' +
        '</a></div>' +
        '<div class="card__body">' +
          '<div class="card__meta"><h3 class="card__name">' + s.t + '</h3>' +
          '<span class="card__price"><s>' + money(t.full) + '</s>' + money(t.bundle) + '</span></div>' +
          '<p class="card__sub">' + s.d + '</p>' +
          '<div class="card__actions">' +
            '<button class="btn btn-ghost btn-sm btn-block" type="button" data-stack="' + s.ids.join(',') + '">Add ' + s.ids.length + ' to bag</button>' +
          '</div>' +
        '</div></article>';
    }).join('');
    host.querySelectorAll('[data-stack]').forEach((b) => b.addEventListener('click', () => {
      b.getAttribute('data-stack').split(',').forEach((id) => {
        const p = N.byId(id);
        const v = p.variants.find((x) => x.stock > 0) || p.variants[0];
        window.Cart.add(id, v.id, 1);
      });
      window.openCart();
    }));
    UI.mountStagger(host);
  }

  renderAll();
  renderStacks();
  UI.mountReveals();
})();
