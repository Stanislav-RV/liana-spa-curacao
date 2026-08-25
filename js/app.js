/* ==========================================================================
   Liana Spa — shared runtime
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------- config */

  const SITE = window.SITE = {
    email:   'Infolianaspa@massagecuracao.com',
    phone:   '+5999 9692 0525',
    phoneRaw:'59996920525',
    address: 'Tinwegstraat, Willemstad, Curaçao',
    maps:    'https://www.google.com/maps/search/?api=1&query=Tinwegstraat%2C+Willemstad%2C+Cura%C3%A7ao',
    currency:'ANG',
    /* Opening hours by weekday index (0 = Monday … 6 = Sunday). */
    hours: {
      0: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','19:00','20:00','21:00'],
      1: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','19:00','20:00','21:00'],
      2: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','19:00','20:00','21:00'],
      3: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','19:00','20:00','21:00'],
      4: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','19:00','20:00','21:00'],
      5: ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'],
      6: []
    }
  };

  /* Services — single source of truth for the landing, booking and gift pages. */
  const SERVICES = window.SERVICES = [
    { id: 'relaxation', icon: 'lotus',  key: 'svc.relaxation', options: [[60,100],[90,140]] },
    { id: 'deep',       icon: 'spine',  key: 'svc.deep',       options: [[60,100],[90,140]] },
    { id: 'gun',        icon: 'gun',    key: 'svc.gun',        options: [[60,105],[90,145]] },
    { id: 'sports',     icon: 'runner', key: 'svc.sports',     options: [[45, 80],[60,110]] },
    { id: 'stone',      icon: 'stones', key: 'svc.stone',      options: [[60,110],[90,150]] },
    { id: 'luxury',     icon: 'luxury', key: 'svc.luxury',     options: [[60,110],[90,150]] }
  ];

  const GALLERY = window.GALLERY = [
    'relaxation', 'studio-session', 'hot-stone',
    'deep-tissue', 'sports', 'percussion',
    'reflexology', 'foot-massage', 'liana-portrait'
  ];

  /* ----------------------------------------------------------------- icons */

  const S = (body, vb) =>
    '<svg viewBox="' + (vb || '0 0 48 48') + '" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';

  const LOTUS_BODY =
    '<path d="M24 38c-5.4-3.2-8.5-8.4-8.5-14.1 0-3.4 1.1-6.7 3-9.5 3.1 2.4 5.1 5.6 5.5 9.2"/>' +
    '<path d="M24 38c5.4-3.2 8.5-8.4 8.5-14.1 0-3.4-1.1-6.7-3-9.5-3.1 2.4-5.1 5.6-5.5 9.2"/>' +
    '<path d="M24 38c-8 0-15-4-18-10 4-2.2 8.7-2.3 12.7-.3"/>' +
    '<path d="M24 38c8 0 15-4 18-10-4-2.2-8.7-2.3-12.7-.3"/>';

  const ICONS = window.ICONS = {
    lotus:  S(LOTUS_BODY),
    luxury: S(LOTUS_BODY +
      '<path d="M11 13.5v4M9 15.5h4M36.5 10v3.4M34.8 11.7h3.4M39 19.5v2.8M37.6 20.9h2.8"/>'),
    spine:  S(
      '<circle cx="24" cy="10.5" r="4.6"/>' +
      '<path d="M13.8 39.5V27c0-5 3.7-9 8.2-9h4c4.5 0 8.2 4 8.2 9v12.5"/>' +
      '<path d="M24 19.5v18"/>' +
      '<path d="M20.4 24.5h7.2M20.4 29.5h7.2M20.4 34.5h7.2"/>'),
    gun:    S(
      '<path d="M28.5 10h6a4 4 0 0 1 4 4v5.4a4 4 0 0 1-4 4h-6z"/>' +
      '<path d="M28.5 10v13.4"/>' +
      '<path d="M28.5 16.7h-6.3"/>' +
      '<circle cx="17" cy="16.7" r="5.2"/>' +
      '<path d="M32.4 23.4v6.2a5.6 5.6 0 0 1-5.6 5.6h-3.6"/>'),
    runner: S(
      '<circle cx="30.5" cy="11.5" r="3.6"/>' +
      '<path d="M31.5 17.6 24.4 21.4l2.2 6.2-4.2 9.3"/>' +
      '<path d="M26.6 27.6l7.3 2 1.6 8.1"/>' +
      '<path d="M24.4 21.4 16 23.6"/>' +
      '<path d="M31.5 17.6 37.6 22"/>'),
    stones: S(
      '<ellipse cx="24" cy="34.5" rx="13" ry="4.2"/>' +
      '<ellipse cx="24" cy="26.6" rx="10" ry="3.5"/>' +
      '<ellipse cx="24" cy="19.6" rx="7.1" ry="2.9"/>' +
      '<path d="M17.6 13.6c1.6-1.9 1.6-3.4 0-5.3M24 12.6c1.6-1.9 1.6-3.4 0-5.3M30.4 13.6c1.6-1.9 1.6-3.4 0-5.3"/>'),

    pin:    S('<path d="M12 21.5s7.5-6.2 7.5-11.6A7.5 7.5 0 0 0 4.5 9.9C4.5 15.3 12 21.5 12 21.5z"/><circle cx="12" cy="9.8" r="2.8"/>', '0 0 24 24'),
    phone:  S('<path d="M20.5 16.4v2.6a1.8 1.8 0 0 1-2 1.8 17.6 17.6 0 0 1-7.7-2.7 17.4 17.4 0 0 1-5.3-5.3A17.6 17.6 0 0 1 2.8 5a1.8 1.8 0 0 1 1.8-2h2.6a1.8 1.8 0 0 1 1.8 1.5c.1.9.3 1.7.6 2.5a1.8 1.8 0 0 1-.4 1.9l-1.1 1.1a14 14 0 0 0 5.3 5.3l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.5.6a1.8 1.8 0 0 1 1.6 1.5z"/>', '0 0 24 24'),
    mail:   S('<rect x="2.8" y="4.8" width="18.4" height="14.4" rx="2.4"/><path d="m3.4 6.8 7.6 5.4a1.8 1.8 0 0 0 2 0l7.6-5.4"/>', '0 0 24 24'),
    arrow:  S('<path d="M4 12h15.5M13.5 6l6 6-6 6"/>', '0 0 24 24'),
    arrowL: S('<path d="M20 12H4.5M10.5 6l-6 6 6 6"/>', '0 0 24 24'),
    heart:  S('<path d="M12 20.2s-7.6-4.6-7.6-10A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.6 2.6c0 5.4-7.6 10-7.6 10z"/>', '0 0 24 24'),
    gift:   S('<rect x="3.5" y="9" width="17" height="11.5" rx="2"/><path d="M2.4 5.5h19.2v3.5H2.4zM12 5.5v15"/><path d="M12 5.5S10.6 2 8.4 2a2 2 0 0 0 0 3.5zM12 5.5S13.4 2 15.6 2a2 2 0 0 1 0 3.5z"/>', '0 0 24 24'),
    handHeart: S('<path d="M4 21v-8.5h3l3.6 1.7h4.3a1.9 1.9 0 0 1 0 3.8h-3.4"/><path d="M7 16.2h4.5"/><path d="m20 12.5-3.5 3.3"/><path d="M15.6 8.4S12 6.4 12 3.9A2.2 2.2 0 0 1 15.6 2a2.2 2.2 0 0 1 3.6 1.9c0 2.5-3.6 4.5-3.6 4.5z"/>', '0 0 24 24'),
    check:  S('<path d="m5 12.5 4.5 4.5L19 7.5"/>', '0 0 24 24'),
    cash:   S('<rect x="2.5" y="6" width="19" height="12" rx="2.2"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9.5v5M18 9.5v5"/>', '0 0 24 24'),
    clock:  S('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.4 2"/>', '0 0 24 24'),
    tag:    S('<path d="M3.5 11V4.5a1 1 0 0 1 1-1H11l9 9-7.5 7.5z"/><circle cx="8" cy="8" r="1.4"/>', '0 0 24 24'),
    cal:    S('<rect x="3.5" y="5" width="17" height="15.5" rx="2.2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', '0 0 24 24'),
    user:   S('<circle cx="12" cy="8.2" r="3.8"/><path d="M4.6 20.2a7.4 7.4 0 0 1 14.8 0"/>', '0 0 24 24'),
    pencil: S('<path d="M15.6 4.4 19.6 8.4 8.4 19.6 3.5 20.5l.9-4.9z"/>', '0 0 24 24'),
    close:  S('<path d="m6 6 12 12M18 6 6 18"/>', '0 0 24 24')
  };

  /* ------------------------------------------------------------------ i18n */

  const LANGS = window.LANGS;
  const I18N  = window.I18N;
  const STORE = 'liana.lang';

  function detectLang() {
    const url = new URLSearchParams(location.search).get('lang');
    if (url && I18N[url]) return url;
    let saved = null;
    try { saved = localStorage.getItem(STORE); } catch (e) { /* private mode */ }
    if (saved && I18N[saved]) return saved;
    const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return I18N[nav] ? nav : 'en';
  }

  let current = detectLang();

  const t = window.t = function (key, fallback) {
    const dict = I18N[current] || I18N.en;
    const val = dict[key] !== undefined ? dict[key] : I18N.en[key];
    return val !== undefined ? val : (fallback !== undefined ? fallback : key);
  };

  window.getLang = () => current;

  function applyTranslations(root) {
    const scope = root || document;

    scope.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    scope.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    scope.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s && s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    if (!root) {
      document.documentElement.lang = (LANGS.find(l => l.code === current) || {}).html || current;
      const title = document.querySelector('title[data-i18n]');
      if (title) document.title = t(title.dataset.i18n);
      const desc = document.querySelector('meta[name="description"]');
      if (desc && desc.dataset.i18n) desc.setAttribute('content', t(desc.dataset.i18n));
    }
  }
  window.applyTranslations = applyTranslations;

  function setLang(code) {
    if (!I18N[code] || code === current) return;
    current = code;
    try { localStorage.setItem(STORE, code); } catch (e) { /* ignore */ }
    document.querySelectorAll('.lang__btn').forEach(b => {
      b.setAttribute('aria-current', String(b.dataset.lang === code));
    });
    applyTranslations();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: code } }));
  }
  window.setLang = setLang;

  function buildLangSwitchers() {
    document.querySelectorAll('[data-lang-switcher]').forEach(host => {
      host.className = 'lang';
      host.setAttribute('role', 'group');
      host.setAttribute('aria-label', 'Language');
      host.innerHTML = LANGS.map((l, i) =>
        (i ? '<span class="lang__sep" aria-hidden="true">|</span>' : '') +
        '<button type="button" class="lang__btn" data-lang="' + l.code + '" lang="' + l.html + '" ' +
        'aria-current="' + (l.code === current) + '">' + l.label + '</button>'
      ).join('');
    });
    document.addEventListener('click', e => {
      const btn = e.target.closest('.lang__btn');
      if (btn) setLang(btn.dataset.lang);
    });
  }

  /* --------------------------------------------------------------- helpers */

  const money = window.money = n => SITE.currency + ' ' + n;

  window.durationLabel = (min) => min + ' ' + t('svc.min');

  window.serviceById = id => SERVICES.find(s => s.id === id);

  window.el = function (tag, attrs, html) {
    const node = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'dataset') Object.assign(node.dataset, attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, attrs[k]);
    }
    if (html !== undefined) node.innerHTML = html;
    return node;
  };

  /* ---------------------------------------------------------------- header */

  function initHeader() {
    const header = document.querySelector('.header');
    const burger = document.querySelector('.burger');
    const drawer = document.querySelector('.drawer');

    if (header && !header.classList.contains('header--solid')) {
      const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (burger && drawer) {
      const toggle = (open) => {
        burger.setAttribute('aria-expanded', String(open));
        drawer.classList.toggle('is-open', open);
        document.body.classList.toggle('is-locked', open);
        if (header) header.classList.toggle('is-solid', open || window.scrollY > 40);
      };
      burger.addEventListener('click', () => toggle(burger.getAttribute('aria-expanded') !== 'true'));
      drawer.addEventListener('click', e => { if (e.target.closest('a')) toggle(false); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
    }
  }

  /* ---------------------------------------------------------------- reveal */

  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(i => i.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(i => io.observe(i));
  }

  /* -------------------------------------------------------------- lightbox */

  function initLightbox() {
    /* The gallery strip is rendered after boot, so bind by delegation and
       build the overlay on first use. */
    let box = null, img = null, count = null, index = 0, lastFocus = null;

    function build() {
      box = el('div', { class: 'lightbox', role: 'dialog', 'aria-modal': 'true', 'aria-hidden': 'true' });
      box.innerHTML =
        '<img class="lightbox__img" alt="">' +
        '<button type="button" class="lightbox__btn lightbox__btn--close" data-lb="close">' + ICONS.close + '</button>' +
        '<button type="button" class="lightbox__btn lightbox__btn--prev" data-lb="prev">' + ICONS.arrowL + '</button>' +
        '<button type="button" class="lightbox__btn lightbox__btn--next" data-lb="next">' + ICONS.arrow + '</button>' +
        '<span class="lightbox__count"></span>';
      document.body.appendChild(box);

      img   = box.querySelector('.lightbox__img');
      count = box.querySelector('.lightbox__count');

      box.querySelector('[data-lb="close"]').setAttribute('aria-label', t('gallery.close'));
      box.querySelector('[data-lb="prev"]').setAttribute('aria-label', t('gallery.prev'));
      box.querySelector('[data-lb="next"]').setAttribute('aria-label', t('gallery.next'));

      box.addEventListener('click', e => {
        const btn = e.target.closest('[data-lb]');
        if (!btn) { if (e.target === box) close(); return; }
        if (btn.dataset.lb === 'close') close();
        if (btn.dataset.lb === 'prev')  show(index - 1);
        if (btn.dataset.lb === 'next')  show(index + 1);
      });

      /* Force a reflow so the first open still animates. */
      void box.offsetWidth;
    }

    const show = i => {
      index = (i + GALLERY.length) % GALLERY.length;
      img.src = 'assets/img/' + GALLERY[index] + '.webp';
      img.alt = t('gallery.title') + ' — ' + (index + 1);
      count.textContent = (index + 1) + ' / ' + GALLERY.length;
    };

    const open = i => {
      if (!box) build();
      lastFocus = document.activeElement;
      show(i);
      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      box.querySelector('[data-lb="close"]').focus();
    };

    const close = () => {
      if (!box) return;
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    };

    document.addEventListener('click', e => {
      const trigger = e.target.closest('[data-lightbox]');
      if (trigger) open(Number(trigger.dataset.lightbox) || 0);
    });

    document.addEventListener('keydown', e => {
      if (!box || !box.classList.contains('is-open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });

    document.addEventListener('langchange', () => {
      if (!box) return;
      box.querySelector('[data-lb="close"]').setAttribute('aria-label', t('gallery.close'));
      box.querySelector('[data-lb="prev"]').setAttribute('aria-label', t('gallery.prev'));
      box.querySelector('[data-lb="next"]').setAttribute('aria-label', t('gallery.next'));
    });
  }

  /* ------------------------------------------------------------ hero video */

  function initHeroVideo() {
    const video = document.querySelector('.hero__media video');
    if (!video) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { video.removeAttribute('autoplay'); video.pause(); return; }
    const play = video.play();
    if (play && play.catch) play.catch(() => { /* autoplay blocked — poster stays */ });
  }

  /* -------------------------------------------------------------- boot */

  function boot() {
    buildLangSwitchers();
    document.querySelectorAll('[data-icon]').forEach(node => {
      node.innerHTML = ICONS[node.dataset.icon] || '';
    });
    document.querySelectorAll('[data-year]').forEach(n => {
      n.textContent = String(new Date().getFullYear());
    });
    document.querySelectorAll('[data-site]').forEach(n => {
      const v = SITE[n.dataset.site];
      if (v !== undefined) n.textContent = v;
    });
    document.querySelectorAll('a[data-href-site]').forEach(a => {
      const kind = a.dataset.hrefSite;
      if (kind === 'mail')  a.href = 'mailto:' + SITE.email;
      if (kind === 'phone') a.href = 'tel:+' + SITE.phoneRaw;
      if (kind === 'wa')    a.href = 'https://wa.me/' + SITE.phoneRaw;
      if (kind === 'maps')  a.href = SITE.maps;
    });

    applyTranslations();
    initHeader();
    initReveal();
    initLightbox();
    initHeroVideo();

    document.dispatchEvent(new CustomEvent('app:ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
