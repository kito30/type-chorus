import type { SongSearchResult } from '../../types/music';
export default function MusicSearchCard({ result, onSelect }: {
    result: SongSearchResult;
    onSelect: (r: SongSearchResult) => void;
}): import("react").JSX.Element;
