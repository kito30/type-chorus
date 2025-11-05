export default function ScoreHud({
  score,
  combo,
  correctChars,
  wrongChars,
  startedAtMs,
}: {
  score: number
  combo: number
  correctChars: number
  wrongChars: number
  startedAtMs: number | null
}) {
  const accuracyPct = (() => {
    const total = correctChars + wrongChars
    return total === 0 ? 100 : Math.round((correctChars / total) * 100)
  })()

  const wpm = (() => {
    if (!startedAtMs) return 0
    const minutes = Math.max(0.001, (Date.now() - startedAtMs) / 60000)
    return Math.round((correctChars / 5) / minutes)
  })()

  return (
    <div className="fixed right-6 top-16 z-20 flex flex-col items-end gap-3">
      <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-(--color-card-bg, #101114) border border-gray-700 shadow-lg">
        <span className="uppercase tracking-wide text-xs opacity-70">Score</span>
        <span className="text-2xl font-extrabold">{score}</span>
      </div>
      <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-(--color-card-bg, #101114) border border-gray-700 shadow">
        <span className="uppercase tracking-wide text-xs opacity-70">Combo</span>
        <span className="text-lg font-bold">{combo}</span>
      </div>
      <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-(--color-card-bg, #101114) border border-gray-700 shadow">
        <span className="uppercase tracking-wide text-xs opacity-70">Accuracy</span>
        <span className="text-lg font-bold">{accuracyPct}%</span>
      </div>
      <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-(--color-card-bg, #101114) border border-gray-700 shadow">
        <span className="uppercase tracking-wide text-xs opacity-70">WPM</span>
        <span className="text-lg font-bold">{wpm}</span>
      </div>
    </div>
  )
}


