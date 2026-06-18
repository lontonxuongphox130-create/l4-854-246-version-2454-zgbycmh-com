(function () {
    function initPlayer(videoId, buttonId, streamUrl) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var hlsInstance = null;
        var prepared = false;

        if (!video || !streamUrl) {
            return;
        }

        function prepare() {
            if (prepared) {
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else {
                video.src = streamUrl;
            }

            prepared = true;
        }

        function play() {
            prepare();

            if (button) {
                button.classList.add('is-hidden');
            }

            var promise = video.play();

            if (promise && promise.catch) {
                promise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', play);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('is-hidden');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.initPlayer = initPlayer;
})();
