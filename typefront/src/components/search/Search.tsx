import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { searchSongs } from '../../services/lrc';
import type { SongSearchResult } from '../../types/music';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

export default function SearchBar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SongSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    searchSongs({ q: debouncedQuery })
      .then(setResults)
      .catch((e) => {
        if (e instanceof Error && e.name === 'AbortError') return;
        setError('Search failed. Please try again.');
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div className="w-full max-w-2xl">
      <SearchInput value={query} onChange={setQuery} />
      <SearchResults
        isLoading={isLoading}
        error={error}
        results={results}
        debouncedQuery={debouncedQuery}
        onSelect={async (r) => {
              navigate(`/song/${r.id}`);
        }}
      />
    </div>
  );
}

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}



