document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('.js-menu-button');
  var mobileNav = document.querySelector('.js-mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobileNav.hidden = expanded;
    });
  }

  var hero = document.querySelector('.js-hero-carousel');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var previous = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide')) || 0);
        startTimer();
      });
    });

    if (previous) {
      previous.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
    showSlide(0);
    startTimer();
  }

  var panel = document.querySelector('.js-filter-panel');
  var list = document.querySelector('.js-filter-list');

  if (panel && list) {
    var search = panel.querySelector('.js-filter-search');
    var year = panel.querySelector('.js-filter-year');
    var genre = panel.querySelector('.js-filter-genre');
    var category = panel.querySelector('.js-filter-category');
    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
    var emptyState = document.querySelector('.js-empty-state');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (search && initialQuery) {
      search.value = initialQuery;
    }

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function filterCards() {
      var queryValue = normalize(search && search.value);
      var yearValue = normalize(year && year.value);
      var genreValue = normalize(genre && genre.value);
      var categoryValue = normalize(category && category.value);
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardGenre = normalize(card.getAttribute('data-genre'));
        var cardCategory = normalize(card.getAttribute('data-category'));
        var matched = true;

        if (queryValue && text.indexOf(queryValue) === -1) {
          matched = false;
        }

        if (yearValue && cardYear !== yearValue) {
          matched = false;
        }

        if (genreValue && cardGenre.indexOf(genreValue) === -1) {
          matched = false;
        }

        if (categoryValue && cardCategory !== categoryValue) {
          matched = false;
        }

        card.hidden = !matched;

        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }
    }

    [search, year, genre, category].forEach(function (control) {
      if (control) {
        control.addEventListener('input', filterCards);
        control.addEventListener('change', filterCards);
      }
    });

    filterCards();
  }
});
