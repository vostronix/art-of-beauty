(function () {
  'use strict';

  var root = document.documentElement;
  var header = document.querySelector('.site-header');
  var fab = document.querySelector('.fab-call');

  // ---------- Theme ----------
  var themeBtn = document.querySelector('.theme-toggle');
  function applyTheme(t) {
    root.dataset.theme = t;
    var meta = document.querySelectorAll('meta[name="theme-color"]');
    meta.forEach(function (m) { m.setAttribute('content', t === 'dark' ? '#231f1a' : '#e7dbcd'); });
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }
  // Systemwechsel folgen, solange der Nutzer nichts gewählt hat
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light');
  });

  // ---------- Mobile menu ----------
  var menuBtn = document.querySelector('.menu-toggle');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    }
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // ---------- Header / FAB on scroll ----------
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 20);
    if (fab) fab.classList.toggle('visible', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Reveal on scroll ----------
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // leichte Staffelung innerhalb gleicher Eltern
    reveals.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.classList.contains('reveal');
      });
      var i = siblings.indexOf(el);
      if (i > 0) el.style.transitionDelay = Math.min(i * 90, 450) + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- Active nav link ----------
  var links = document.querySelectorAll('.nav ul a');
  var sections = Array.prototype.map.call(links, function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  if ('IntersectionObserver' in window && sections.length) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) navIo.observe(s); });
  }

  // ---------- Year ----------
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
