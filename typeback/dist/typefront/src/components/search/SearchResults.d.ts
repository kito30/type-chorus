import type { SongSearchResult } from '../../types/music';
export default function SearchResults({ isLoading, error, results, debouncedQuery, onSelect, }: {
    isLoading: boolean;
    error: string | null;
    results: SongSearchResult[];
    debouncedQuery: string;
    onSelect: (r: SongSearchResult) => void;
}): import("react").JSX.Element;
