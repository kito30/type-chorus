import { useState, useEffect } from 'react';
import VideoController from './VideoController';

export default function VideoCard({ 
  videoId,
  iframeRef 
}: { 
  videoId: string;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}) {
    const [iframeEl, setIframeEl] = useState<HTMLIFrameElement | null>(null); // ref for controller
    const [iframeLoaded, setIframeLoaded] = useState(false);
    
    const baseUrl = `https://www.youtube.com/embed/${videoId}`;
    const params = new URLSearchParams({
        rel: '0',
        controls: '0',
        modestbranding: '1',
        disablekb: '1',
        fs: '0',
        playsinline: '1',
        iv_load_policy: '3',
        autoplay: '0',
        mute: '0',
        enablejsapi: '1',
        origin: window.location.origin,
    }).toString();
    const src = `${baseUrl}?${params}`;

    useEffect(() => {
        if (!iframeRef.current) return;
        setIframeEl(iframeRef.current);
    }, [iframeRef]);

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