export type YouTubeController = {
    play: () => void;
    pause: () => void;
    mute: () => void;
    unmute: () => void;
    setVolume: (volume0to100: number) => void;
    seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
};
export declare function createYouTubeController(iframe: HTMLIFrameElement): YouTubeController;
export declare function createYouTubeControllerById(iframeElementId: string): YouTubeController | null;
