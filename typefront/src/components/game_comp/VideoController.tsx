import { useEffect, useMemo, useState } from 'react';
import { createYouTubeController } from './gamefunction/videofunction';

export default function VideoController({ iframe, isLoaded }: { iframe: HTMLIFrameElement; isLoaded?: boolean }) {
    // Load saved volume from localStorage, default to 50
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem('video.volume');
        return saved ? Number(saved) : 50;
    });

    const controller = useMemo(() => createYouTubeController(iframe), [iframe]);

    // Set initial volume when iframe is loaded and ready
    useEffect(() => {
        if (controller && volume !== undefined && isLoaded) {
            const timer = setTimeout(() => {
                controller.setVolume(volume);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [controller, volume, isLoaded]); // Run when iframe is loaded

    const pause = () => controller.pause();
    const mute = () => controller.mute();
    const unmute = () => controller.unmute();
    const onVolumeChange = (v: number) => {
        setVolume(v);
        controller.setVolume(v);
        localStorage.setItem('video.volume', String(v));
    };

    return (
        <div className="mt-2 flex items-center gap-2">
            <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={pause}>Pause</button>
            <button className="px-3 py-1 rounded bg-yellow-600 text-white" onClick={mute}>Mute</button>
            <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={unmute}>Unmute</button>
            <div className="flex items-center gap-2 ml-3">
                <span className="text-sm text-white/80">Vol</span>
                <input className="w-20 sm:w-32 md:w-40"
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => onVolumeChange(Number(e.target.value))}
                />
            </div>
        </div>
    );
}