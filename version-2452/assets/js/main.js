(function () {
  function qs(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function qsa(selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var button = qs('[data-menu-toggle]');
    var menu = qs('[data-mobile-menu]');
    if (!button || !menu) return;
    button.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  function setupHero() {
    var root = qs('[data-hero-carousel]');
    if (!root) return;
    var slides = qsa('[data-hero-slide]', root);
    var dots = qsa('[data-hero-dot]', root);
    var prev = qs('[data-hero-prev]', root);
    var next = qs('[data-hero-next]', root);
    if (!slides.length) return;
    var index = 0;
    var timer;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupRail() {
    var rail = qs('[data-movie-rail]');
    if (!rail) return;
    var prev = qs('[data-rail-prev]');
    var next = qs('[data-rail-next]');
    function move(direction) {
      rail.scrollBy({
        left: direction * Math.max(300, rail.clientWidth * 0.75),
        behavior: 'smooth'
      });
    }
    if (prev) prev.addEventListener('click', function () { move(-1); });
    if (next) next.addEventListener('click', function () { move(1); });
  }

  function setupFilters() {
    qsa('[data-filter-scope]').forEach(function (scope) {
      var input = qs('[data-filter-input]', scope);
      var region = qs('[data-region-filter]', scope);
      var year = qs('[data-year-filter]', scope);
      var category = qs('[data-category-filter]', scope);
      var results = qs('.filter-results', scope.parentElement) || qs('.filter-results');
      if (!results) return;
      var cards = qsa('.movie-card', results);

      if (input && input.getAttribute('data-query-param')) {
        var params = new URLSearchParams(window.location.search);
        var value = params.get(input.getAttribute('data-query-param')) || '';
        input.value = value;
      }

      function includes(haystack, needle) {
        return String(haystack || '').toLowerCase().indexOf(String(needle || '').toLowerCase()) !== -1;
      }

      function apply() {
        var keyword = input ? input.value.trim() : '';
        var regionValue = region ? region.value : '';
        var yearValue = year ? year.value : '';
        var categoryValue = category ? category.value : '';
        cards.forEach(function (card) {
          var text = [card.dataset.title, card.dataset.tags, card.dataset.region, card.dataset.category, card.dataset.year].join(' ');
          var okKeyword = !keyword || includes(text, keyword);
          var okRegion = !regionValue || includes(card.dataset.region, regionValue);
          var okYear = !yearValue || String(card.dataset.year) === yearValue;
          var okCategory = !categoryValue || card.dataset.category === categoryValue;
          card.hidden = !(okKeyword && okRegion && okYear && okCategory);
        });
      }

      [input, region, year, category].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
      apply();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupRail();
    setupFilters();
  });
})();
