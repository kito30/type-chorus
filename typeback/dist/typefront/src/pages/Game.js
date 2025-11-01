"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Game;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const lrc_1 = require("../services/lrc");
function Game() {
    const { id } = (0, react_router_dom_1.useParams)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [record, setRecord] = (0, react_1.useState)(null);
    const [phase, setPhase] = (0, react_1.useState)('idle');
    const [lines, setLines] = (0, react_1.useState)([]);
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(0);
    const [input, setInput] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const visibleCount = 3;
    const inputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!id)
            return;
        setIsLoading(true);
        setError(null);
        (0, lrc_1.getLyricsById)(Number(id))
            .then((rec) => {
            setRecord(rec);
            const parsed = parseLyrics(rec);
            setLines(parsed);
        })
            .catch(() => setError('Failed to load lyrics'))
            .finally(() => setIsLoading(false));
    }, [id]);
    (0, react_1.useEffect)(() => {
        if (phase === 'playing') {
            inputRef.current?.focus();
        }
    }, [phase]);
    const visibleLines = (0, react_1.useMemo)(() => {
        return lines.slice(currentIndex, currentIndex + visibleCount);
    }, [lines, currentIndex]);
    const activeLine = visibleLines[0] ?? '';
    function handleStart() {
        if (lines.length === 0)
            return;
        setPhase('playing');
        setInput('');
    }
    function handleInputChange(next) {
        if (phase !== 'playing')
            return;
        setInput(next);
        if (next === activeLine) {
            setCurrentIndex((i) => i + 1);
            setInput('');
            if (currentIndex + 1 >= lines.length)
                setPhase('finished');
        }
    }
    return (<div className="min-h-screen flex flex-col bg-(--color-home-bg) text-(--color-text)">
      <header className="flex items-center justify-between w-full px-6 py-4">
        <button className="text-(--color-text) hover:opacity-80" onClick={() => navigate('/')}>← Back</button>
        <div className="text-sm opacity-80">{record ? record.artistName : ''}</div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-6">
        {isLoading && <div className="text-center">Loading…</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!isLoading && !error && record && (<div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold truncate">{record.trackName}</h1>
              {phase !== 'playing' && phase !== 'finished' && (<button className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600" onClick={handleStart}>
                  Start
                </button>)}
            </div>

            <div className="rounded-xl bg-(--color-card-bg, #101114) text-(--color-text) border border-gray-800 p-6 min-h-56">
              <ul className="space-y-2">
                {visibleLines.map((line, idx) => (<li key={idx} className={`text-xl tracking-wide ${idx === 0 ? 'opacity-100' : 'opacity-60'}`}>{line || ' '}</li>))}
              </ul>
            </div>

            {phase === 'playing' && (<input ref={inputRef} className="w-full rounded-lg bg-transparent border border-gray-700 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-lg" placeholder="Type here" value={input} onChange={(e) => handleInputChange(e.target.value)} autoFocus/>)}

            {phase === 'finished' && (<div className="flex items-center gap-3">
                <div className="text-green-400">Completed</div>
                <button className="px-3 py-2 rounded bg-gray-800" onClick={() => { setPhase('idle'); setCurrentIndex(0); setInput(''); }}>Restart</button>
              </div>)}
          </div>)}
      </main>
    </div>);
}
function parseLyrics(rec) {
    const lrc = rec.syncedLyrics;
    if (lrc && lrc.includes(']')) {
        const rows = lrc.split(/\r?\n/);
        const pairs = [];
        for (const row of rows) {
            const match = row.match(/^\[(\d{2}):(\d{2})\.(\d{2})\]\s*(.*)$/);
            if (!match)
                continue;
            const m = Number(match[1]);
            const s = Number(match[2]);
            const cs = Number(match[3]);
            const text = match[4] ?? '';
            const t = m * 60000 + s * 1000 + cs * 10;
            pairs.push({ t, text });
        }
        pairs.sort((a, b) => a.t - b.t);
        return pairs.map((p) => p.text).filter((t) => t.trim().length > 0);
    }
    const plain = rec.plainLyrics ?? '';
    return plain.split(/\r?\n/).map((s) => s.trim()).filter((s) => s.length > 0);
}
//# sourceMappingURL=Game.js.map