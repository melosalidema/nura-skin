/* about / science page — glossary accordion */
(function () {
  'use strict';
  const N = window.NURA, UI = window.UI;

  const host = document.getElementById('glossary-list');
  host.innerHTML = N.GLOSSARY.map((g, i) =>
    '<div class="gl" data-gl="' + i + '">' +
      '<button class="gl__head" type="button" aria-expanded="false" style="display:contents">' +
        '<span class="gl__t"><b>' + g.n + '</b><i>' + g.aka + '</i></span>' +
        '<span class="gl__n">' + g.pct + '</span>' +
      '</button>' +
      '<div class="gl__body"><div><p>' + g.body + '</p></div></div>' +
    '</div>').join('');

  host.addEventListener('click', (e) => {
    const b = e.target.closest('.gl__head');
    if (!b) return;
    const item = b.closest('.gl');
    const open = item.classList.toggle('is-open');
    b.setAttribute('aria-expanded', String(open));
  });

  /* deep link: #hyaluronic-acid */
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (location.hash) {
    const key = location.hash.slice(1);
    const item = Array.from(host.querySelectorAll('.gl')).find((el) =>
      slug(N.GLOSSARY[+el.getAttribute('data-gl')].n) === key);
    if (item) {
      item.classList.add('is-open');
      item.querySelector('.gl__head').setAttribute('aria-expanded', 'true');
      setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
    }
  }

  UI.mountReveals();
})();
