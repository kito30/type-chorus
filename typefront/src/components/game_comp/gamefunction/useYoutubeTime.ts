import { useState, useEffect, useRef } from 'react';

declare global {
    interface Window {
        YT: any; 
        onYouTubeIframeAPIReady: () => void;
    }
}

export function useYoutubeTime( iframeRef: React.RefObject<HTMLIFrameElement>, videoId: string) {
    const [timeSeconds, setTimeSeconds] = useState<number>(0);
    const playerRef = useRef<any>(null); ///ref to youtube player object
    
    useEffect(() => {
        if(window.YT?.Player) return;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
    }, []);
    useEffect(() => {
        if(!iframeRef.current || !window.YT?.Player) return;
        
        const init  = () => {
            if(iframeRef.current && !playerRef.current) {
                playerRef.current = new window.YT.Player(iframeRef.current, {
                    videoId,
                });
            }
        }
        if(window.YT.Player) {
            init()
        }
        else {
            window.onYouTubeIframeAPIReady = init;
        }
    }, [iframeRef, videoId]);
    
    //get the time
    useEffect(() => {
    if(!playerRef.current) return;
    
    const id = setInterval(() => {
            try {
                const timeSeconds = playerRef.current.getCurrentTime();
                const duration = playerRef.current.getDuration();
                
                if (typeof timeSeconds === 'number' && typeof duration === 'number') {
                    setTimeSeconds(timeSeconds);
                    
                    // Stop if video ended
                    if (timeSeconds >= duration) {
                        clearInterval(id);
                    }
                }
            } catch (error) {
                console.error('Error getting current time:', error);
                clearInterval(id);
            }
        }, 100);
        return () => clearInterval(id);
        }, [])
    return timeSeconds;
}