
(function () {
    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function setupNavigation() {
        var toggle = document.querySelector('[data-nav-toggle]');
        var nav = document.querySelector('[data-main-nav]');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }

    function setupHeroSlider() {
        var slider = document.querySelector('[data-hero-slider]');
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot') || 0));
                start();
            });
        });

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupSearchAndFilters() {
        var input = document.querySelector('[data-site-search]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var emptyState = document.querySelector('[data-empty-state]');
        var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
        var activeFilter = '';

        if (!cards.length) {
            return;
        }

        function applyFilter() {
            var keyword = normalize(input ? input.value : '');
            var matchedCount = 0;

            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute('data-search'));
                var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchesFilter = !activeFilter || haystack.indexOf(normalize(activeFilter)) !== -1;
                var visible = matchesKeyword && matchesFilter;
                card.hidden = !visible;
                if (visible) {
                    matchedCount += 1;
                }
            });

            if (emptyState) {
                emptyState.hidden = matchedCount !== 0;
            }
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                filterButtons.forEach(function (item) {
                    item.classList.remove('active');
                });
                button.classList.add('active');
                activeFilter = button.getAttribute('data-filter-value') || '';
                applyFilter();
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupNavigation();
        setupHeroSlider();
        setupSearchAndFilters();
    });
})();
