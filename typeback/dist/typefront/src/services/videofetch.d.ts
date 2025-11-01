import type { SongSearchResult } from "../types/music";
type VideoSearchResult = {
    videoId: string;
    title: string;
    channel: string;
    duration: number;
    queryUsed: string;
};
export declare function fetchVideoInfo({ trackName, artistName }: SongSearchResult): Promise<VideoSearchResult | null>;
export {};
