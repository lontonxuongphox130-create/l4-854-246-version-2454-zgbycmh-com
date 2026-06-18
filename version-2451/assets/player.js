(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    document.querySelectorAll('[data-player]').forEach(function (box) {
      var video = box.querySelector('video');
      var button = box.querySelector('[data-play-button]');
      if (!video || !button) {
        return;
      }
      var stream = video.getAttribute('data-stream');
      var loaded = false;
      var hls = null;

      function hideButton() {
        button.hidden = true;
      }

      function start() {
        if (!stream) {
          return;
        }
        hideButton();
        if (loaded) {
          video.play().catch(function () {});
          return;
        }
        loaded = true;
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal && hls) {
              hls.destroy();
              hls = null;
              video.src = stream;
              video.play().catch(function () {});
            }
          });
        } else {
          video.src = stream;
          video.play().catch(function () {});
        }
      }

      button.addEventListener('click', function (event) {
        event.preventDefault();
        start();
      });
      box.addEventListener('click', function (event) {
        if (!loaded && event.target !== button && !button.contains(event.target)) {
          start();
        }
      });
      video.addEventListener('play', hideButton);
    });
  });
})();
