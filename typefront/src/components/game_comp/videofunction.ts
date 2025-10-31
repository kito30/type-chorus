export type YouTubeController = {
  play: () => void;
  pause: () => void;
  mute: () => void;
  unmute: () => void;
  setVolume: (volume0to100: number) => void; // 0..100
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
};

function postCommand(iframe: HTMLIFrameElement, func: string, args: unknown[] = []) {
  const win = iframe.contentWindow;
  if (!win) return;
  try {
    win.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      iframe.src
    );
  } catch {
    // no-op
  }
}

export function createYouTubeController(iframe: HTMLIFrameElement): YouTubeController {
  return {
    play: () => postCommand(iframe, 'playVideo'),
    pause: () => postCommand(iframe, 'pauseVideo'),
    mute: () => postCommand(iframe, 'mute'),
    unmute: () => postCommand(iframe, 'unMute'),
    setVolume: (v: number) => {
      const clamped = Math.max(0, Math.min(100, Math.floor(v)));
      postCommand(iframe, 'setVolume', [clamped]);
    },
    seekTo: (seconds: number, allowSeekAhead: boolean = true) => {
      const t = Math.max(0, seconds || 0);
      postCommand(iframe, 'seekTo', [t, allowSeekAhead]);
    },
  };
}

// Convenience: create controller by element id
export function createYouTubeControllerById(iframeElementId: string): YouTubeController | null {
  const el = document.getElementById(iframeElementId) as HTMLIFrameElement | null;
  if (!el) return null;
  return createYouTubeController(el);
}
