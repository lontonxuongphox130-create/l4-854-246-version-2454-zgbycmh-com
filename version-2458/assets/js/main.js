(() => {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }

  document.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => {
      image.classList.add('image-missing');
    }, { once: true });
  });

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let activeSlide = 0;

  const showSlide = (index) => {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
    });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(() => {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  const initPlayer = (shell) => {
    const video = shell.querySelector('video');
    const overlay = shell.querySelector('.player-overlay');
    const source = shell.dataset.videoSrc;
    let ready = false;
    let hlsInstance = null;

    if (!video || !source) {
      return;
    }

    const loadSource = () => {
      if (ready) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }

      ready = true;
    };

    const playVideo = () => {
      loadSource();
      shell.classList.add('is-playing');
      const promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {
          shell.classList.remove('is-playing');
        });
      }
    };

    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('play', () => {
      shell.classList.add('is-playing');
    });

    video.addEventListener('pause', () => {
      if (!video.ended) {
        shell.classList.remove('is-playing');
      }
    });

    window.addEventListener('pagehide', () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };

  document.querySelectorAll('.player-shell').forEach(initPlayer);

  const resultContainer = document.querySelector('[data-search-results]');
  const searchInput = document.querySelector('[data-search-input]');
  const searchForm = document.querySelector('[data-search-form]');

  const renderResults = (query) => {
    if (!resultContainer || !window.siteMovies) {
      return;
    }

    const keyword = (query || '').trim().toLowerCase();
    const movies = window.siteMovies.filter((movie) => {
      if (!keyword) {
        return true;
      }

      return [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.oneLine]
        .join(' ')
        .toLowerCase()
        .includes(keyword);
    }).slice(0, 96);

    if (!movies.length) {
      resultContainer.innerHTML = '<div class="empty-state">没有找到相关剧集</div>';
      return;
    }

    resultContainer.innerHTML = movies.map((movie) => `
      <article class="movie-card">
        <a href="${movie.url}">
          <div class="poster-frame">
            <img src="${movie.image}" alt="${escapeHtml(movie.title)}" loading="lazy">
            <div class="poster-shade"></div>
            <span class="play-badge">▶</span>
          </div>
          <div class="card-body">
            <div class="card-badges">
              <span class="badge badge-blue">${escapeHtml(movie.region)}</span>
              <span class="badge badge-green">${escapeHtml(movie.type)}</span>
            </div>
            <h3>${escapeHtml(movie.title)}</h3>
            <p>${escapeHtml(movie.oneLine)}</p>
            <div class="card-meta">
              <span>${escapeHtml(movie.year)}</span>
              <span>${escapeHtml(movie.genre)}</span>
            </div>
          </div>
        </a>
      </article>
    `).join('');

    resultContainer.querySelectorAll('img').forEach((image) => {
      image.addEventListener('error', () => {
        image.classList.add('image-missing');
      }, { once: true });
    });
  };

  const escapeHtml = (value) => String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  if (resultContainer) {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';

    if (searchInput) {
      searchInput.value = initialQuery;
    }

    renderResults(initialQuery);

    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nextQuery = searchInput.value.trim();
        const url = new URL(window.location.href);

        if (nextQuery) {
          url.searchParams.set('q', nextQuery);
        } else {
          url.searchParams.delete('q');
        }

        window.history.replaceState({}, '', url.toString());
        renderResults(nextQuery);
      });
    }
  }
})();
