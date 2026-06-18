(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var header = document.querySelector('[data-header]');
    var homePage = document.body.classList.contains('home-page');

    function updateHeader() {
      if (!header) {
        return;
      }
      if (!homePage || window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        mobileNav.classList.toggle('open');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, idx) {
          slide.classList.toggle('active', idx === current);
        });
        dots.forEach(function (dot, idx) {
          dot.classList.toggle('active', idx === current);
        });
      }

      function next() {
        show(current + 1);
      }

      function resetTimer() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(next, 5200);
      }

      var prevButton = hero.querySelector('[data-hero-prev]');
      var nextButton = hero.querySelector('[data-hero-next]');
      if (prevButton) {
        prevButton.addEventListener('click', function () {
          show(current - 1);
          resetTimer();
        });
      }
      if (nextButton) {
        nextButton.addEventListener('click', function () {
          show(current + 1);
          resetTimer();
        });
      }
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
          resetTimer();
        });
      });
      resetTimer();
    }

    document.querySelectorAll('[data-rail]').forEach(function (rail) {
      var track = rail.querySelector('.rail-track');
      var left = rail.querySelector('[data-rail-left]');
      var right = rail.querySelector('[data-rail-right]');
      if (!track) {
        return;
      }
      function move(direction) {
        track.scrollBy({ left: direction * Math.max(280, track.clientWidth * 0.75), behavior: 'smooth' });
      }
      if (left) {
        left.addEventListener('click', function () { move(-1); });
      }
      if (right) {
        right.addEventListener('click', function () { move(1); });
      }
    });

    var searchInput = document.querySelector('[data-search-input]');
    var searchFilter = document.querySelector('[data-search-filter]');
    var searchList = document.querySelector('[data-search-list]');
    if (searchInput && searchList) {
      var cards = Array.prototype.slice.call(searchList.querySelectorAll('.movie-card'));
      var urlParams = new URLSearchParams(window.location.search);
      var initialQuery = urlParams.get('q') || '';
      if (initialQuery) {
        searchInput.value = initialQuery;
      }

      function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
      }

      function filterCards() {
        var query = normalize(searchInput.value);
        var year = searchFilter ? normalize(searchFilter.value) : '';
        cards.forEach(function (card) {
          var text = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-region'),
            card.getAttribute('data-year'),
            card.getAttribute('data-tags')
          ].join(' '));
          var matchQuery = !query || text.indexOf(query) !== -1;
          var matchYear = !year || normalize(card.getAttribute('data-year')) === year;
          card.classList.toggle('is-hidden', !(matchQuery && matchYear));
        });
      }

      searchInput.addEventListener('input', filterCards);
      if (searchFilter) {
        searchFilter.addEventListener('change', filterCards);
      }
      filterCards();
    }
  });
})();
