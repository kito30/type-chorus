import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { searchSongs } from '../../services/lrc';
import type { SongSearchResult } from '../../types/music';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import { fetchVideoInfo } from '../../services/videofetch';

export default function SearchBar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SongSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
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
        isLoadingVideo={isLoadingVideo}
        error={error}
        results={results}
        debouncedQuery={debouncedQuery}
        onSelect={async (r) => {
          setIsLoadingVideo(true);
          try {
            const videoInfo = await fetchVideoInfo(r);
            if (videoInfo) {
              setIsLoadingVideo(false);
              navigate(`/song/${r.id}`, { state: { videoId: videoInfo.videoId } });
            }
          } catch (error) {
            console.error('Failed to fetch video:', error);
            setIsLoadingVideo(false);
          }
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



