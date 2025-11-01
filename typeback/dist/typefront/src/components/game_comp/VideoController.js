"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VideoController;
const react_1 = require("react");
const videofunction_1 = require("./videofunction");
function VideoController({ iframe }) {
    const [volume, setVolume] = (0, react_1.useState)(50);
    const play = () => controller.play();
    const pause = () => controller.pause();
    const mute = () => controller.mute();
    const unmute = () => controller.unmute();
    const onVolumeChange = (v) => {
        setVolume(v);
        controller.setVolume(v);
    };
    const controller = (0, react_1.useMemo)(() => (0, videofunction_1.createYouTubeController)(iframe), [iframe]);
    return (<div className="mt-2 flex items-center gap-2">
            <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={play}>Play</button>
            <button className="px-3 py-1 rounded bg-gray-600 text-white" onClick={pause}>Pause</button>
            <button className="px-3 py-1 rounded bg-yellow-600 text-white" onClick={mute}>Mute</button>
            <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={unmute}>Unmute</button>
            <div className="flex items-center gap-2 ml-3">
                <span className="text-sm text-white/80">Vol</span>
                <input type="range" min={0} max={100} value={volume} onChange={(e) => onVolumeChange(Number(e.target.value))}/>
            </div>
        </div>);
}
//# sourceMappingURL=VideoController.js.map