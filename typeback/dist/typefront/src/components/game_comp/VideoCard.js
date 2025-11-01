"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VideoCard;
const react_1 = require("react");
const VideoController_1 = require("./VideoController");
function VideoCard({ videoId }) {
    const iframeRef = (0, react_1.useRef)(null);
    const [iframeEl, setIframeEl] = (0, react_1.useState)(null);
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
    (0, react_1.useEffect)(() => {
        if (!iframeRef.current)
            return;
        setIframeEl(iframeRef.current);
    }, []);
    return (<div className="aspect-video w-full max-w-2xl rounded-md border-3 border-amber-100">
            <iframe ref={iframeRef} className="w-full h-full" src={src} title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen={false}/>
            {iframeEl && <VideoController_1.default iframe={iframeEl}/>}
        </div>);
}
//# sourceMappingURL=VideoCard.js.map