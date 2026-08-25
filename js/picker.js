/* ==========================================================================
   Liana Spa — shared service picker (booking + gift card)
   ========================================================================== */

(function () {
  'use strict';

  /**
   * Renders the six services as radio rows with duration/price chips.
   * Calls onChange({ id, minutes, price }) whenever the selection changes.
   */
  window.createServicePicker = function (host, onChange) {
    if (!host) return { get: () => null, refresh: () => {} };

    const state = { id: null, minutes: null, price: null };

    host.innerHTML = window.SERVICES.map(svc =>
      '<div class="opt" role="radio" tabindex="0" aria-checked="false" data-service="' + svc.id + '">' +
        '<span class="opt__radio" aria-hidden="true"></span>' +
        '<span class="opt__icon" data-icon="' + svc.icon + '" aria-hidden="true"></span>' +
        '<span class="opt__body">' +
          '<span class="opt__name" data-i18n="' + svc.key + '.name"></span>' +
          '<span class="opt__chips">' +
            svc.options.map(([min, price]) =>
              '<button type="button" class="chip" data-min="' + min + '" data-price="' + price + '">' +
                '<span>' + min + ' <span data-i18n="svc.min">min</span></span>' +
                '<b>' + window.money(price) + '</b>' +
              '</button>'
            ).join('') +
          '</span>' +
        '</span>' +
      '</div>'
    ).join('');

    host.setAttribute('role', 'radiogroup');
    host.querySelectorAll('[data-icon]').forEach(n => {
      n.innerHTML = window.ICONS[n.dataset.icon] || '';
    });
    window.applyTranslations(host);

    function select(row, min, price) {
      host.querySelectorAll('.opt').forEach(o => {
        o.classList.remove('is-selected');
        o.setAttribute('aria-checked', 'false');
        o.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
      });
      row.classList.add('is-selected');
      row.setAttribute('aria-checked', 'true');

      const chip = row.querySelector('.chip[data-min="' + min + '"]');
      if (chip) chip.classList.add('is-active');

      state.id = row.dataset.service;
      state.minutes = Number(min);
      state.price = Number(price);
      if (onChange) onChange(Object.assign({}, state));
    }

    host.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      const row  = e.target.closest('.opt');
      if (!row) return;
      if (chip) select(row, chip.dataset.min, chip.dataset.price);
      else {
        const first = row.querySelector('.chip');
        select(row, first.dataset.min, first.dataset.price);
      }
    });

    host.addEventListener('keydown', e => {
      const row = e.target.closest('.opt');
      if (!row || (e.key !== ' ' && e.key !== 'Enter')) return;
      e.preventDefault();
      const first = row.querySelector('.chip');
      select(row, first.dataset.min, first.dataset.price);
    });

    document.addEventListener('langchange', () => window.applyTranslations(host));

    return {
      get: () => (state.id ? Object.assign({}, state) : null),
      name: () => (state.id ? window.t(window.serviceById(state.id).key + '.name') : '')
    };
  };
})();
