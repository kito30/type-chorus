import type { LyricsRecord, SongSearchResult } from '../types/music';
export declare function searchSongs(params: {
    q?: string;
    track_name?: string;
    artist_name?: string;
    album_name?: string;
    duration?: number;
}): Promise<SongSearchResult[]>;
export declare function getLyricsById(id: number): Promise<LyricsRecord>;
export declare function getLyricsBySignature(params: {
    track_name: string;
    artist_name: string;
    album_name: string;
    duration: number;
}): Promise<LyricsRecord>;
export declare function getLyricsBySignatureCached(params: {
    track_name: string;
    artist_name: string;
    album_name: string;
    duration: number;
}): Promise<LyricsRecord>;
