/* ==========================================================================
   Liana Spa — landing page rendering
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------- gallery carousel */

  function initGallery() {
    const track = document.getElementById('gal-track');
    const dots  = document.getElementById('gal-dots');
    const prev  = document.getElementById('gal-prev');
    const next  = document.getElementById('gal-next');
    if (!track) return;

    track.innerHTML = window.GALLERY.map((name, i) =>
      '<button type="button" class="gal__slide" data-lightbox="' + i + '">' +
        '<img src="assets/img/' + name + '.webp" alt="" loading="' +
          (i < 3 ? 'eager' : 'lazy') + '" width="1140" height="1520">' +
      '</button>'
    ).join('');

    const slides = [...track.children];
    let perPage = 1, pages = slides.length, page = 0;

    /* One "step" is a full page of slides, including the gap after it. */
    const step = () => {
      /* Slides are scaled in carousel mode, so use the layout box, not the
         painted one. */
      const w = slides[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return (w + gap) * perPage;
    };

    function measure() {
      /* CSS owns the layout mode; --per-page tells us how it is behaving. */
      perPage = parseInt(getComputedStyle(track).getPropertyValue('--per-page'), 10) || 1;
      pages = Math.ceil(slides.length / perPage);
      buildDots();
      update();
    }

    function buildDots() {
      if (dots.children.length === pages) return;
      dots.innerHTML = Array.from({ length: pages }, (_, i) =>
        '<button type="button" class="gal__dot" role="tab" data-page="' + i + '"' +
        ' aria-label="' + (i + 1) + ' / ' + pages + '"></button>'
      ).join('');
    }

    /* paint() reflects `page`; update() derives `page` from the real scroll
       position. Arrow and dot clicks paint immediately so the control state
       never waits on a scroll event. */
    function paint() {
      [...dots.children].forEach((d, i) => {
        d.classList.toggle('is-active', i === page);
        d.setAttribute('aria-selected', String(i === page));
      });
      /* In carousel mode one photo is the hero; with several per page there
         is no single "front" slide to highlight. */
      slides.forEach((s, i) => {
        s.classList.toggle('is-current', perPage === 1 && i === page);
      });
      prev.disabled = page === 0;
      next.disabled = page >= pages - 1;
    }

    function update() {
      page = Math.min(pages - 1, Math.max(0, Math.round(track.scrollLeft / step())));
      paint();
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const goTo = i => {
      page = Math.max(0, Math.min(pages - 1, i));
      paint();
      track.scrollTo({ left: page * step(), behavior: reduced.matches ? 'auto' : 'smooth' });
    };

    prev.addEventListener('click', () => goTo(page - 1));
    next.addEventListener('click', () => goTo(page + 1));
    dots.addEventListener('click', e => {
      const dot = e.target.closest('.gal__dot');
      if (dot) goTo(Number(dot.dataset.page));
    });

    /* Throttled by clock rather than rAF: background tabs throttle rAF hard,
       and the dot state must stay correct regardless. */
    let lastTick = 0, trailing = null;
    track.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - lastTick > 80) { lastTick = now; update(); }
      clearTimeout(trailing);
      trailing = setTimeout(update, 130);
    }, { passive: true });

    /* Arrow keys when the track itself has focus. */
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(page - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(page + 1); }
    });

    /* A swipe must not also open the lightbox. */
    let startX = 0, dragged = false;
    track.addEventListener('pointerdown', e => { startX = e.clientX; dragged = false; });
    track.addEventListener('pointermove', e => {
      if (e.buttons && Math.abs(e.clientX - startX) > 8) dragged = true;
    });
    track.addEventListener('click', e => {
      if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; return; }

      /* In carousel mode a tap on a side photo brings it to the front rather
         than jumping straight to the full-screen view. */
      const slide = e.target.closest('.gal__slide');
      if (!slide || perPage !== 1) return;
      const i = slides.indexOf(slide);
      if (i !== -1 && i !== page) {
        e.preventDefault();
        e.stopPropagation();
        goTo(i);
      }
    }, true);

    window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    measure();
  }

  /* ---------------------------------------------------------------- services */

  function renderServices() {
    const host = document.getElementById('svc-list');
    if (!host) return;

    host.innerHTML = window.SERVICES.map(svc => {
      const prices = svc.options.map(([min, price]) =>
        '<span>' + min + ' <span data-i18n="svc.min">min</span> <b>' +
        window.money(price) + '</b></span>'
      ).join('<span class="sep" aria-hidden="true">|</span>');

      return '<article class="svc reveal">' +
        '<span class="svc__icon" data-icon="' + svc.icon + '" aria-hidden="true"></span>' +
        '<div>' +
          '<h3 class="svc__name" data-i18n="' + svc.key + '.name"></h3>' +
          '<p class="svc__price">' + prices + '</p>' +
          '<p class="svc__desc" data-i18n="' + svc.key + '.desc"></p>' +
        '</div>' +
      '</article>';
    }).join('');

    host.querySelectorAll('[data-icon]').forEach(n => {
      n.innerHTML = window.ICONS[n.dataset.icon] || '';
    });
  }

  /* -------------------------------------------------------------------- boot */

  document.addEventListener('app:ready', function () {
    initGallery();
    renderServices();
    window.applyTranslations(document.getElementById('svc-list'));

    /* Newly injected .reveal nodes need their own observer pass. */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('#svc-list .reveal').forEach(n => io.observe(n));
  });

  document.addEventListener('langchange', function () {
    const list = document.getElementById('svc-list');
    if (list) window.applyTranslations(list);
  });
})();
