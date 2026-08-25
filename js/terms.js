/* ==========================================================================
   Liana Spa — Terms & Conditions rendering
   ========================================================================== */

(function () {
  'use strict';

  const esc = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function render() {
    const doc = window.TERMS[window.getLang()] || window.TERMS.en;

    document.getElementById('terms-meta').innerHTML = doc.meta
      .map(([label, value]) => '<div><b>' + esc(label) + ':</b> ' + esc(value) + '</div>')
      .join('');

    document.getElementById('terms-body').innerHTML = doc.articles.map(a =>
      '<section>' +
        '<h2>' + esc(a.t) + '</h2>' +
        (a.callout ? '<p class="callout">' + esc(a.callout) + '</p>' : '') +
        a.p.map(p => '<p>' + esc(p) + '</p>').join('') +
      '</section>'
    ).join('');

    document.getElementById('terms-foot').textContent = doc.foot;
  }

  document.addEventListener('app:ready', render);
  document.addEventListener('langchange', render);
})();
