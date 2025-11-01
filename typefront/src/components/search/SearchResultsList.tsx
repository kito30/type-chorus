import type { SongSearchResult } from '../../types/music';
import MusicSearchCard from './MusicSearchCard';

export default function SearchResultsList({ 
  results, 
  onSelect 
}: { 
  results: SongSearchResult[]; 
  onSelect: (r: SongSearchResult) => void; 
}) {
  if (results.length === 0) return null;
  
  return (
    <ul>
      {results.map((r) => (
        <li key={r.id}>
          <MusicSearchCard result={r} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}

