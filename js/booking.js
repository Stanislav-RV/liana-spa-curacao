/* ==========================================================================
   Liana Spa — booking page
   ========================================================================== */

(function () {
  'use strict';

  const state = { service: null, date: null, time: null };

  const pad = n => String(n).padStart(2, '0');
  const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  /* Monday = 0 … Sunday = 6, matching SITE.hours. */
  const weekIndex = d => (d.getDay() + 6) % 7;

  const today = startOfDay(new Date());
  let view = new Date(today.getFullYear(), today.getMonth(), 1);

  /* ------------------------------------------------------------ availability */

  function slotsFor(date) {
    const all = window.SITE.hours[weekIndex(date)] || [];
    if (date.getTime() !== today.getTime()) return all.slice();
    /* Same-day bookings need at least two hours' notice. */
    const now = new Date();
    const cutoff = now.getHours() * 60 + now.getMinutes() + 120;
    return all.filter(s => {
      const [h, m] = s.split(':').map(Number);
      return h * 60 + m >= cutoff;
    });
  }

  const isBookable = date => date >= today && slotsFor(date).length > 0;

  /* ------------------------------------------------------------------ dates */

  function formatDate(date) {
    const L = window.I18N[window.getLang()] || window.I18N.en;
    return L.dayNames[weekIndex(date)] + ', ' + date.getDate() + ' ' + L.months[date.getMonth()] + ' ' + date.getFullYear();
  }

  /* --------------------------------------------------------------- calendar */

  const grid    = document.getElementById('cal-grid');
  const monthEl = document.getElementById('cal-month');
  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');

  function renderCalendar() {
    const L = window.I18N[window.getLang()] || window.I18N.en;
    monthEl.textContent = L.months[view.getMonth()] + ' ' + view.getFullYear();

    const first  = new Date(view.getFullYear(), view.getMonth(), 1);
    const lead   = weekIndex(first);
    const days   = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

    let html = L.weekdays.map(d => '<span class="cal__dow">' + d + '</span>').join('');
    for (let i = 0; i < lead; i++) html += '<span class="cal__day is-out"></span>';

    for (let d = 1; d <= days; d++) {
      const date = new Date(view.getFullYear(), view.getMonth(), d);
      const free = isBookable(date);
      const sel  = state.date && ymd(state.date) === ymd(date);
      html += '<button type="button" class="cal__day' +
        (free ? ' is-free' : '') + (sel ? ' is-selected' : '') + '"' +
        (free ? '' : ' disabled') +
        ' data-date="' + ymd(date) + '">' + d + '</button>';
    }
    grid.innerHTML = html;

    prevBtn.disabled = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();
  }

  function shiftMonth(delta) {
    view = new Date(view.getFullYear(), view.getMonth() + delta, 1);
    renderCalendar();
  }

  prevBtn.addEventListener('click', () => shiftMonth(-1));
  nextBtn.addEventListener('click', () => shiftMonth(1));

  grid.addEventListener('click', e => {
    const cell = e.target.closest('.cal__day[data-date]');
    if (!cell) return;
    const [y, m, d] = cell.dataset.date.split('-').map(Number);
    state.date = new Date(y, m - 1, d);
    state.time = null;
    renderCalendar();
    renderSlots();
    sync();
  });

  /* ------------------------------------------------------------------ slots */

  const slotsGrid  = document.getElementById('slots-grid');
  const slotsTitle = document.getElementById('slots-title');

  function renderSlots() {
    if (!state.date) {
      slotsTitle.textContent = window.t('book.slots.pick');
      slotsGrid.innerHTML = '';
      return;
    }
    const list = slotsFor(state.date);
    slotsTitle.innerHTML = window.t('book.slots') + '<br><b>' + formatDate(state.date) + '</b>';
    slotsGrid.innerHTML = list.length
      ? list.map(s => '<button type="button" class="slot' +
          (s === state.time ? ' is-active' : '') + '" data-time="' + s + '">' + s + '</button>').join('')
      : '<p class="slots__empty">' + window.t('book.closed') + '</p>';
  }

  slotsGrid.addEventListener('click', e => {
    const btn = e.target.closest('.slot[data-time]');
    if (!btn) return;
    state.time = btn.dataset.time;
    renderSlots();
    sync();
  });

  /* ---------------------------------------------------------------- summary */

  const ICON = k => window.ICONS[k] || '';

  function summaryRows() {
    const svc = state.service;
    const name = document.getElementById('f-name').value.trim();
    const rows = [];

    rows.push(['lotus', 'book.sum.treatment', svc ? window.t(window.serviceById(svc.id).key + '.name') : '—']);
    rows.push(['clock', 'book.sum.duration',  svc ? svc.minutes + ' ' + window.t('svc.min') : '—']);
    rows.push(['tag',   'book.sum.price',     svc ? window.money(svc.price) : '—']);
    rows.push(['cal',   'book.sum.date',      state.date ? formatDate(state.date) : '—']);
    rows.push(['clock', 'book.sum.time',      state.time || '—']);
    if (name) rows.push(['user', 'book.sum.name', name]);
    rows.push(['pin',   'book.sum.address',   window.SITE.address]);

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
    const hasSlot    = !!(state.date && state.time);
    const hasDetails = ['f-name', 'f-email', 'f-phone']
      .every(id => document.getElementById(id).value.trim() !== '');

    const done = [hasService, hasSlot, hasDetails, hasService && hasSlot && hasDetails];
    const active = done.findIndex(v => !v);

    document.querySelectorAll('.step').forEach((el, i) => {
      el.classList.toggle('is-done', done[i]);
      el.classList.toggle('is-active', i === active);
      el.querySelector('.step__dot').innerHTML = done[i] ? ICON('check') : String(i + 1);
    });

    renderSummary();
  }

  /* ------------------------------------------------------------------- form */

  const form   = document.getElementById('booking-form');
  const errBox = document.getElementById('form-error');

  ['f-name', 'f-email', 'f-phone'].forEach(id => {
    document.getElementById(id).addEventListener('input', sync);
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

    if (!state.service)          return showError('book.err.service');
    if (!state.date || !state.time) return showError('book.err.slot');

    const missing = ['name', 'email', 'phone'].filter(k => {
      const input = document.getElementById('f-' + k);
      const empty = input.value.trim() === '';
      if (empty) input.closest('.field').classList.add('has-error');
      return empty;
    });
    if (missing.length) return showError('book.err.details');

    /* Placeholder submit — no backend is wired up yet. */
    const payload = {
      service:  state.service.id,
      minutes:  state.service.minutes,
      price:    state.service.price,
      date:     ymd(state.date),
      time:     state.time,
      name:     document.getElementById('f-name').value.trim(),
      email:    document.getElementById('f-email').value.trim(),
      phone:    document.getElementById('f-phone').value.trim(),
      notes:    document.getElementById('f-notes').value.trim(),
      lang:     window.getLang()
    };
    console.info('[Liana Spa] booking request (demo, not sent):', payload);

    form.hidden = true;
    document.getElementById('stepper').hidden = true;
    document.getElementById('done-summary').innerHTML = summaryRows();
    const done = document.getElementById('done');
    done.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------- boot */

  document.addEventListener('app:ready', function () {
    window.createServicePicker(document.getElementById('service-picker'), svc => {
      state.service = svc;
      sync();
    });
    renderCalendar();
    renderSlots();
    sync();
  });

  document.addEventListener('langchange', function () {
    renderCalendar();
    renderSlots();
    sync();
    const done = document.getElementById('done');
    if (done && !done.hidden) {
      document.getElementById('done-summary').innerHTML = summaryRows();
    }
  });
})();
