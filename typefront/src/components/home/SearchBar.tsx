import { useEffect, useRef, useState } from 'react'
import { searchSongs } from '../../services/lrc'
import type { SongSearchResult } from '../../types/music'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SongSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([])
      setError(null)
      return
    }

    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setIsLoading(true)
    setError(null)

    searchSongs({ q: debouncedQuery })
      .then(setResults)
      .catch((e) => {
        if (e instanceof Error && e.name === 'AbortError') return
        setError('Search failed. Please try again.')
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [debouncedQuery])

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-3 rounded-full bg-white text-gray-900 border border-gray-200 shadow-sm px-5 py-3 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          className="w-full bg-transparent outline-none placeholder:text-gray-400 text-base"
          placeholder="Search songs or artists"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-2 py-2 rounded-full" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </div>

      <div className="mt-3 rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm overflow-hidden">
        {isLoading && (
          <div className="px-4 py-3 text-sm">Searching…</div>
        )}
        {error && (
          <div className="px-4 py-3 text-sm text-red-600">{error}</div>
        )}
        {!isLoading && !error && results.length > 0 && (
          <ul>
            {results.map((r) => (
              <li
                key={r.id}
                className="px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                onClick={() => console.log('select', r)}
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{r.trackName}</div>
                  <div className="text-xs text-gray-500 truncate">{r.artistName}{r.albumName ? ` • ${r.albumName}` : ''}</div>
                </div>
                <div className="ml-3 text-xs text-gray-500 whitespace-nowrap">
                  {r.hasSyncedLyrics ? 'Synced' : r.hasPlainLyrics ? 'Lyrics' : 'No lyrics'}
                </div>
              </li>
            ))}
          </ul>
        )}
        {!isLoading && !error && debouncedQuery && results.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-600">No results</div>
        )}
      </div>
    </div>
  )
}

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])
  return debounced
}
