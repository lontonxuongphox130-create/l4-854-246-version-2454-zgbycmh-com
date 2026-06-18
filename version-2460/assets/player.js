
import { H as Hls } from './hls-vendor-dru42stk.js';

function setupPlayer(player) {
    const video = player.querySelector('video');
    const button = player.querySelector('[data-play-button]');
    const message = player.querySelector('[data-player-message]');
    const source = player.getAttribute('data-src') || (video ? video.getAttribute('data-src') : '');
    let initialized = false;
    let hlsInstance = null;

    if (!video || !source) {
        if (message) {
            message.textContent = '当前页面未找到可用播放源。';
        }
        return;
    }

    function setMessage(text) {
        if (message) {
            message.textContent = text;
        }
    }

    function initSource() {
        if (initialized) {
            return Promise.resolve();
        }
        initialized = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            setMessage('已使用浏览器原生 HLS 能力加载播放源。');
            return Promise.resolve();
        }

        if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: false
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            setMessage('已初始化 HLS 播放器，正在加载 m3u8 播放源。');
            return new Promise(function (resolve) {
                hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                    setMessage('播放源加载完成，可以开始观看。');
                    resolve();
                });
                hlsInstance.on(Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setMessage('播放源加载遇到问题，请刷新或稍后重试。');
                    }
                });
            });
        }

        video.src = source;
        setMessage('当前浏览器不支持 HLS.js，已尝试直接加载播放源。');
        return Promise.resolve();
    }

    function play() {
        initSource().then(function () {
            const promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    setMessage('浏览器阻止了自动播放，请再次点击播放器开始。');
                });
            }
        });
        if (button) {
            button.classList.add('is-hidden');
        }
    }

    if (button) {
        button.addEventListener('click', play);
    }

    video.addEventListener('play', function () {
        if (button) {
            button.classList.add('is-hidden');
        }
    });

    video.addEventListener('pause', function () {
        if (button && video.currentTime === 0) {
            button.classList.remove('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-player]').forEach(setupPlayer);
});
