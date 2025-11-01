import { useNavigate } from 'react-router-dom'

interface GameHeaderProps {
  artistName?: string
}

export default function GameHeader({ artistName }: GameHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between w-full px-6 py-4">
      <button className="text-(--color-text) hover:opacity-80" onClick={() => navigate('/')}>
        ← Back
      </button>
      <div className="text-sm opacity-80">{artistName || ''}</div>
    </header>
  )
}

