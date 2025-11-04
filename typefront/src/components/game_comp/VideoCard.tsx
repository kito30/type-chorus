import { useState, useRef, useEffect} from 'react';
import VideoController from './VideoController';

export default function VideoCard({ videoId }: { videoId: string }) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null); // current ref for the iframe
    const [iframeEl, setIframeEl] = useState<HTMLIFrameElement | null>(null); // ref for controller
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const baseUrl = `https://www.youtube.com/embed/${videoId}`;
    const params = new URLSearchParams({
        rel: '0',                 // limit related videos to same channel
        controls: '0',            // HIDE YouTube controls (we provide our own)
        modestbranding: '1',      // reduce YouTube branding
        disablekb: '1',           // disable keyboard controls
        fs: '0',                  // hide fullscreen button
        playsinline: '1',         // inline playback on mobile
        iv_load_policy: '3',      // hide annotations
        autoplay: '0',            // do not autoplay
        mute: '0',                // not muted (so volume slider works)
        enablejsapi: '1',         // allow JS control via postMessage API
        origin: window.location.origin,
    }).toString();
    const src = `${baseUrl}?${params}`;
    useEffect(() => {
        if (!iframeRef.current) return;
        setIframeEl(iframeRef.current);
    }, []);
    return (
        <div className="flex flex-col items-center w-full max-w-2xl">
            <div className="aspect-video w-full max-w-2xl rounded-md border-3 border-amber-100">
                <iframe
                    ref={iframeRef}
                    className="w-full h-full"
                    src={src}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen={false}
                    onLoad={() => setIframeLoaded(true)}
                />
                {iframeEl && <VideoController iframe={iframeEl} isLoaded={iframeLoaded} />}
            </div>
        </div>
   )
}