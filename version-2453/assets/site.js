(function () {
    function each(nodes, handler) {
        Array.prototype.forEach.call(nodes, handler);
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function initMenu() {
        var button = document.querySelector(".menu-toggle");
        var nav = document.querySelector(".mobile-nav");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            button.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function initHero() {
        var slider = document.querySelector(".hero-slider");
        if (!slider) {
            return;
        }
        var slides = slider.querySelectorAll(".hero-slide");
        var dots = slider.querySelectorAll(".hero-dot");
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        function show(index) {
            current = (index + slides.length) % slides.length;
            each(slides, function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            each(dots, function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        }
        each(dots, function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
            });
        });
        window.setInterval(function () {
            show(current + 1);
        }, 5600);
    }

    function initRails() {
        each(document.querySelectorAll("[data-scroll-left], [data-scroll-right]"), function (button) {
            button.addEventListener("click", function () {
                var section = button.closest(".rail-section");
                var rail = section ? section.querySelector(".horizontal-rail") : null;
                if (!rail) {
                    return;
                }
                var distance = button.hasAttribute("data-scroll-left") ? -520 : 520;
                rail.scrollBy({ left: distance, behavior: "smooth" });
            });
        });
    }

    function initFilters() {
        var inputs = document.querySelectorAll(".js-search-input, .js-filter-select");
        if (!inputs.length) {
            return;
        }
        function apply() {
            var termInput = document.querySelector(".js-search-input");
            var term = normalize(termInput ? termInput.value : "");
            var filters = {};
            each(document.querySelectorAll(".js-filter-select"), function (select) {
                filters[select.getAttribute("data-filter")] = normalize(select.value);
            });
            each(document.querySelectorAll(".movie-card"), function (card) {
                var text = normalize(card.getAttribute("data-search"));
                var matchesText = !term || text.indexOf(term) !== -1;
                var matchesCategory = !filters.category || normalize(card.getAttribute("data-category")) === filters.category;
                var matchesYear = !filters.year || normalize(card.getAttribute("data-year")) === filters.year;
                var type = normalize(card.getAttribute("data-type"));
                var matchesType = !filters.type || type.indexOf(filters.type) !== -1;
                card.hidden = !(matchesText && matchesCategory && matchesYear && matchesType);
            });
        }
        each(inputs, function (input) {
            input.addEventListener("input", apply);
            input.addEventListener("change", apply);
        });
    }

    window.initMoviePlayer = function (videoId, maskId, url) {
        var video = document.getElementById(videoId);
        var mask = document.getElementById(maskId);
        var mounted = false;
        var player = null;
        if (!video) {
            return;
        }
        function mount() {
            if (mounted) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                player = new window.Hls();
                player.loadSource(url);
                player.attachMedia(video);
            } else {
                video.src = url;
            }
            mounted = true;
        }
        function start() {
            mount();
            if (mask) {
                mask.classList.add("is-hidden");
            }
            var playResult = video.play();
            if (playResult && playResult.catch) {
                playResult.catch(function () {});
            }
        }
        if (mask) {
            mask.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (!mounted) {
                start();
            }
        });
        window.addEventListener("pagehide", function () {
            if (player) {
                player.destroy();
                player = null;
            }
        });
    };

    document.addEventListener("DOMContentLoaded", function () {
        initMenu();
        initHero();
        initRails();
        initFilters();
    });
})();
