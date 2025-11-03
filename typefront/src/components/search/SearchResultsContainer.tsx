import type { SongSearchResult } from '../../types/music';
import SearchResultsList from './SearchResultsList';

export default function SearchResultsContainer({
  isLoading,
  error,
  results,
  debouncedQuery,
  onSelect,
}: {
  isLoading: boolean;
  error: string | null;
  results: SongSearchResult[];
  debouncedQuery: string;
  onSelect: (s: SongSearchResult) => void;
}) {
  const shouldShowContainer = isLoading || error || (debouncedQuery && debouncedQuery.trim().length >= 2);
  
  if (!shouldShowContainer) return null;

  return (
    <div className="mt-3 rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm max-h-96 overflow-auto">
      {isLoading && (
        <div className="px-4 py-3 text-sm">Searching…</div>
      )}
      {error && (
        <div className="px-4 py-3 text-sm text-red-600">{error}</div>
      )}
      {!isLoading && !error && results.length > 0 && (
        <SearchResultsList results={results} onSelect={onSelect} />
      )}
      {!isLoading && !error && debouncedQuery && debouncedQuery.trim().length >= 2 && results.length === 0 && (
        <div className="px-4 py-3 text-sm text-gray-600">No results</div>
      )}
    </div>
  );
}

