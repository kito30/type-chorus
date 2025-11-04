import { useState, useEffect, useRef } from 'react';

declare global {
    interface Window {
        YT: {
            Player: new (element: HTMLElement | string, config: { videoId?: string }) => {
                getCurrentTime: () => number;
                getDuration: () => number;
                getPlayerState: () => number;
            };
        };
        onYouTubeIframeAPIReady: () => void;
    }
}

interface YouTubePlayer {
    getCurrentTime: () => number;
    getDuration: () => number;
    getPlayerState: () => number;
}

export function useYoutubeTime( iframeRef: React.RefObject<HTMLIFrameElement | null>, videoId: string) {
    const [timeSeconds, setTimeSeconds] = useState<number>(0);
    const [ready, setReady] = useState<boolean>(false);
    const playerRef = useRef<YouTubePlayer | null>(null); ///ref to youtube player object
    
    useEffect(() => {
        if(window.YT?.Player) return;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
    }, []);
    useEffect(() => {
        const init  = () => {
            const el = iframeRef.current
            if(el && !playerRef.current) {
                // Minimal config to satisfy our local types
                // We attach onReady via a setTimeout to avoid typing issues
                playerRef.current = new window.YT.Player(el, { videoId });
                // Poll until player exposes getCurrentTime (ready enough)
                const waitId = setInterval(() => {
                    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                        clearInterval(waitId);
                        setReady(true);
                    }
                }, 100);
            }
        }

        if (window.YT?.Player) {
            init()
        } else {
            // Ensure the callback is set so when the script loads, we initialize
            window.onYouTubeIframeAPIReady = init;
        }
    }, [iframeRef, videoId]);
    
    //get the time
    useEffect(() => {
        if(!ready || !playerRef.current) return;
        const id = setInterval(() => {
            try {
                const p = playerRef.current;
                if (!p) return;
                const t = p.getCurrentTime();
                const d = p.getDuration();
                if (typeof t === 'number' && typeof d === 'number') {
                    setTimeSeconds(t);
                }
            } catch {
                // swallow
            }
        }, 100);
        return () => clearInterval(id);
    }, [ready, videoId])
    return timeSeconds;
}