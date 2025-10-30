import React from 'react';
import type { SongSearchResult } from '../../types/music';

export default function SearchResults({
  isLoading, error, results, debouncedQuery, onSelect,
}: {
  isLoading: boolean;
  error: string | null;
  results: SongSearchResult[];
  debouncedQuery: string;
  onSelect: (r: SongSearchResult) => void;
}) {
  return (
    <div className="mt-3 rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm overflow-hidden">
      {isLoading && (
        <div className="px-4 py-3 text-sm">Searching</div>
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
              onClick={() => onSelect(r)}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{r.trackName}</div>
                <div className="text-xs text-gray-500 truncate">
                  {r.artistName}{r.albumName ? `  ${r.albumName}` : ''}
                </div>
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
  );
}
