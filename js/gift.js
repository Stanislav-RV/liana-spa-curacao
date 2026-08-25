/* ==========================================================================
   Liana Spa — gift card page
   ========================================================================== */

(function () {
  'use strict';

  const state = { service: null };
  const ICON = k => window.ICONS[k] || '';

  const FIELDS = ['g-recipient', 'g-name', 'g-phone', 'g-email'];

  /* ---------------------------------------------------------------- summary */

  function summaryRows() {
    const svc = state.service;
    const recipient = document.getElementById('g-recipient').value.trim();
    const from      = document.getElementById('g-name').value.trim();

    const rows = [
      ['lotus', 'book.sum.treatment', svc ? window.t(window.serviceById(svc.id).key + '.name') : '—'],
      ['clock', 'book.sum.duration',  svc ? svc.minutes + ' ' + window.t('svc.min') : '—'],
      ['tag',   'book.sum.price',     svc ? window.money(svc.price) : '—']
    ];
    if (recipient) rows.push(['gift', 'gc.recipient', recipient]);
    if (from)      rows.push(['user', 'gc.yourname',  from]);

    return rows.map(([icon, key, value]) =>
      '<div class="summary__row">' + ICON(icon) +
      '<dt>' + window.t(key) + '</dt><dd>' + value + '</dd></div>'
    ).join('');
  }

  function renderSummary() {
    document.getElementById('summary').innerHTML = summaryRows();
  }

  /* ---------------------------------------------------------------- stepper */

  function sync() {
    const hasService = !!state.service;
    const hasDetails = FIELDS.every(id => document.getElementById(id).value.trim() !== '');
    const done = [hasService, hasDetails, hasService && hasDetails];
    const active = done.findIndex(v => !v);

    document.querySelectorAll('.step').forEach((el, i) => {
      el.classList.toggle('is-done', done[i]);
      el.classList.toggle('is-active', i === active);
      el.querySelector('.step__dot').innerHTML = done[i] ? ICON('check') : String(i + 1);
    });

    renderSummary();
  }

  /* ------------------------------------------------------------------- form */

  const form   = document.getElementById('gift-form');
  const errBox = document.getElementById('form-error');
  const message = document.getElementById('g-message');
  const counter = document.getElementById('g-count');

  FIELDS.forEach(id => document.getElementById(id).addEventListener('input', sync));

  message.addEventListener('input', () => {
    counter.textContent = message.value.length + ' / 150';
  });

  function showError(key) {
    errBox.textContent = window.t(key);
    errBox.hidden = false;
    errBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    errBox.hidden = true;
    document.querySelectorAll('.field').forEach(f => f.classList.remove('has-error'));

    if (!state.service) return showError('gc.err.service');

    const missing = FIELDS.filter(id => {
      const input = document.getElementById(id);
      const empty = input.value.trim() === '';
      if (empty) input.closest('.field').classList.add('has-error');
      return empty;
    });
    if (missing.length) return showError('gc.err.details');

    /* Placeholder submit — no backend is wired up yet. */
    console.info('[Liana Spa] gift card request (demo, not sent):', {
      service:   state.service.id,
      minutes:   state.service.minutes,
      price:     state.service.price,
      recipient: document.getElementById('g-recipient').value.trim(),
      name:      document.getElementById('g-name').value.trim(),
      phone:     document.getElementById('g-phone').value.trim(),
      email:     document.getElementById('g-email').value.trim(),
      message:   message.value.trim(),
      lang:      window.getLang()
    });

    form.hidden = true;
    document.getElementById('stepper').hidden = true;
    document.getElementById('done-summary').innerHTML = summaryRows();
    document.getElementById('done').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------- boot */

  document.addEventListener('app:ready', function () {
    window.createServicePicker(document.getElementById('service-picker'), svc => {
      state.service = svc;
      sync();
    });
    sync();
  });

  document.addEventListener('langchange', function () {
    sync();
    const done = document.getElementById('done');
    if (done && !done.hidden) {
      document.getElementById('done-summary').innerHTML = summaryRows();
    }
  });
})();
