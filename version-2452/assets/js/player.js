(function () {
  function setupVideo(video) {
    var url = video.getAttribute('data-m3u8');
    if (!url) return;
    var overlay = video.parentElement ? video.parentElement.querySelector('[data-play-overlay]') : null;

    if (window.Hls && window.Hls.isSupported()) {
      while (video.firstChild) {
        video.removeChild(video.firstChild);
      }
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      video._hls = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.load();
    } else {
      var source = video.querySelector('source') || document.createElement('source');
      source.src = url;
      source.type = 'application/vnd.apple.mpegurl';
      if (!source.parentElement) video.appendChild(source);
      video.load();
    }

    function hideOverlay() {
      if (overlay) overlay.classList.add('is-hidden');
    }

    if (overlay) {
      overlay.addEventListener('click', function () {
        hideOverlay();
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      });
    }

    video.addEventListener('play', hideOverlay);
    video.addEventListener('loadeddata', function () {
      video.classList.add('is-ready');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('.hls-player')).forEach(setupVideo);
  });
})();
