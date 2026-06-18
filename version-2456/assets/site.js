(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var slider = document.querySelector('[data-hero-slider]');

    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var prev = slider.querySelector('[data-hero-prev]');
        var next = slider.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function play() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        function reset() {
            if (timer) {
                window.clearInterval(timer);
            }

            play();
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                reset();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                reset();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                reset();
            });
        });

        show(0);
        play();
    }

    var filterScopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));

    filterScopes.forEach(function (scope) {
        var section = scope.closest('section') || document;
        var input = section.querySelector('.movie-filter-input');
        var selects = Array.prototype.slice.call(section.querySelectorAll('.movie-filter-select'));
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
        var count = section.querySelector('[data-filter-count]');
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (input && query) {
            input.value = query;
        }

        function cardText(card) {
            return [
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-category')
            ].join(' ').toLowerCase();
        }

        function applyFilter() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var shown = 0;

            cards.forEach(function (card) {
                var matched = true;

                if (keyword && cardText(card).indexOf(keyword) === -1) {
                    matched = false;
                }

                selects.forEach(function (select) {
                    var value = select.value;
                    var key = select.getAttribute('data-filter');
                    var cardValue = card.getAttribute('data-' + key) || '';

                    if (value && cardValue.indexOf(value) === -1) {
                        matched = false;
                    }
                });

                card.hidden = !matched;

                if (matched) {
                    shown += 1;
                }
            });

            if (count) {
                count.textContent = shown ? '匹配 ' + shown + ' 项' : '暂无匹配';
            }
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        selects.forEach(function (select) {
            select.addEventListener('change', applyFilter);
        });

        applyFilter();
    });
})();
