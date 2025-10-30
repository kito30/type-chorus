import type { SongSearchResult } from '../../types/music';

export default function MusicSearchCard({ result, onSelect }: { result: SongSearchResult; onSelect: (r: SongSearchResult) => void }) {
  return (
    <div
      className="px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
      onClick={() => onSelect(result)}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{result.trackName}</div>
        <div className="text-xs text-gray-500 truncate">
          {result.artistName}{result.albumName ? `  ${result.albumName}` : ''}
        </div>
      </div>
      <div className="ml-3 text-xs text-gray-500 whitespace-nowrap">
        {result.hasSyncedLyrics ? 'Synced' : result.hasPlainLyrics ? 'Lyrics' : 'No lyrics'}
      </div>
    </div>
  );
}
