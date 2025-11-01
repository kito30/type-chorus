"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createYouTubeController = createYouTubeController;
exports.createYouTubeControllerById = createYouTubeControllerById;
function postCommand(iframe, func, args = []) {
    const win = iframe.contentWindow;
    if (!win)
        return;
    try {
        win.postMessage(JSON.stringify({ event: 'command', func, args }), iframe.src);
    }
    catch {
    }
}
function createYouTubeController(iframe) {
    return {
        play: () => postCommand(iframe, 'playVideo'),
        pause: () => postCommand(iframe, 'pauseVideo'),
        mute: () => postCommand(iframe, 'mute'),
        unmute: () => postCommand(iframe, 'unMute'),
        setVolume: (v) => {
            const clamped = Math.max(0, Math.min(100, Math.floor(v)));
            postCommand(iframe, 'setVolume', [clamped]);
        },
        seekTo: (seconds, allowSeekAhead = true) => {
            const t = Math.max(0, seconds || 0);
            postCommand(iframe, 'seekTo', [t, allowSeekAhead]);
        },
    };
}
function createYouTubeControllerById(iframeElementId) {
    const el = document.getElementById(iframeElementId);
    if (!el)
        return null;
    return createYouTubeController(el);
}
//# sourceMappingURL=videofunction.js.map