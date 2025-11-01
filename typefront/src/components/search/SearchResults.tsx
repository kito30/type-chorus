import type { SongSearchResult } from '../../types/music';
import LoadingOverlay from './LoadingOverlay';
import SearchResultsContainer from './SearchResultsContainer';

export default function SearchResults({
  isLoading, isLoadingVideo, error, results, debouncedQuery, onSelect,
}: {
  isLoading: boolean;
  isLoadingVideo?: boolean;
  error: string | null;
  results: SongSearchResult[];
  debouncedQuery: string;
  onSelect: (r: SongSearchResult) => void;
}) {
  return (
    <>
      <LoadingOverlay isLoading={isLoadingVideo ?? false} />
      <SearchResultsContainer
        isLoading={isLoading}
        error={error}
        results={results}
        debouncedQuery={debouncedQuery}
        onSelect={onSelect}
      />
    </>
  );
}
