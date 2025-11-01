interface LyricsDisplayProps {
  lines: string[]
  visibleLines: string[]
}

export default function LyricsDisplay({ visibleLines }: LyricsDisplayProps) {
  return (
    <div className="rounded-xl bg-(--color-card-bg, #101114) text-(--color-text) border border-gray-800 p-6 min-h-56">
      <ul className="space-y-2">
        {visibleLines.map((line, idx) => (
          <li key={idx} className={`text-xl tracking-wide ${idx === 0 ? 'opacity-100' : 'opacity-60'}`}>
            {line || ' '}
          </li>
        ))}
      </ul>
    </div>
  )
}

