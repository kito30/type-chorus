import { useEffect, useMemo, useRef, useState } from 'react'
import { getLyricsById } from '../../services/lrc'
import type { LyricsRecord } from '../../types/music'

type Phase = 'idle' | 'countdown' | 'playing' | 'finished'

export default function Game({ id }: { id: number }) {
  const [record, setRecord] = useState<LyricsRecord | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [lines, setLines] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const visibleCount = 3
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    getLyricsById(Number(id))
      .then((rec) => {
        setRecord(rec)
        const parsed = parseLyrics(rec)
        setLines(parsed)
      })
      .catch(() => setError('Failed to load lyrics'))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => {
    if (phase === 'playing') {
      inputRef.current?.focus()
    }
  }, [phase])

  const visibleLines = useMemo(() => {
    return lines.slice(currentIndex, currentIndex + visibleCount)
  }, [lines, currentIndex])

  const activeLine = visibleLines[0] ?? ''

  function handleStart() {
    if (lines.length === 0) return
    setPhase('playing')
    setInput('')
  }

  function handleInputChange(next: string) {
    if (phase !== 'playing') return
    setInput(next)
    if (next === activeLine) {
      setCurrentIndex((i) => i + 1)
      setInput('')
      if (currentIndex + 1 >= lines.length) setPhase('finished')
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-6">
        {isLoading && <div className="text-center">Loading…</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!isLoading && !error && record && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold truncate">{record.trackName}</h1>
              {phase !== 'playing' && phase !== 'finished' && (
                <button
                  className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleStart}
                >
                  Start
                </button>
              )}
            </div>

            <div className="rounded-xl bg-(--color-card-bg, #101114) text-(--color-text) border border-gray-800 p-6 min-h-56">
              <ul className="space-y-2">
                {visibleLines.map((line, idx) => (
                  <li key={idx} className={`text-xl tracking-wide ${idx === 0 ? 'opacity-100' : 'opacity-60'}`}>{line || ' '}</li>
                ))}
              </ul>
            </div>

            {phase === 'playing' && (
              <input
                ref={inputRef}
                className="w-full rounded-lg bg-transparent border border-gray-700 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="Type here"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                autoFocus
              />
            )}

            {phase === 'finished' && (
              <div className="flex items-center gap-3">
                <div className="text-green-400">Completed</div>
                <button className="px-3 py-2 rounded bg-gray-800" onClick={() => { setPhase('idle'); setCurrentIndex(0); setInput('') }}>Restart</button>
              </div>
            )}
          </div>
        )}
    </div>
  )
}

function parseLyrics(rec: LyricsRecord): string[] {
  const lrc = rec.syncedLyrics
  if (lrc && lrc.includes(']')) {
    const rows = lrc.split(/\r?\n/)
    const pairs: Array<{ t: number; text: string }> = []
    for (const row of rows) {
      const match = row.match(/^\[(\d{2}):(\d{2})\.(\d{2})\]\s*(.*)$/)
      if (!match) continue
      const m = Number(match[1])
      const s = Number(match[2])
      const cs = Number(match[3])
      const text = match[4] ?? ''
      const t = m * 60000 + s * 1000 + cs * 10
      pairs.push({ t, text })
    }
    pairs.sort((a, b) => a.t - b.t)
    return pairs.map((p) => p.text).filter((t) => t.trim().length > 0)
  }
  const plain = rec.plainLyrics ?? ''
  return plain.split(/\r?\n/).map((s) => s.trim()).filter((s) => s.length > 0)
}


