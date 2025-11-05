import type { SongInfo } from "../types/music";
const API_BASE = import.meta.env.API_BASE

type VideoSearchResult = {
  videoId: string;
  title: string;
  channel: string;
  duration: number;
  queryUsed: string;
}

export async function fetchVideoInfo({trackName, artistName}: SongInfo): Promise<VideoSearchResult | null> {
    const url = new URL('/api/youtube/search', API_BASE);
    url.searchParams.set('title', trackName);
    url.searchParams.set('artist', artistName);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`YouTube search failed: ${res.status}`);
    const data = (await res.json()) as VideoSearchResult;
    return data;
}