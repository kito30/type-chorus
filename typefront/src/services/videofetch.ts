import type { SongSearchResult } from "../types/music";

type VideoSearchResult = {
  videoId: string;
  title: string;
  channel: string;
  duration: number;
  queryUsed: string;
}

export async function fetchVideoInfo({trackName, artistName}: SongSearchResult): Promise<VideoSearchResult | null> {
    const url = new URL('/api/youtube/search', window.location.origin);
    url.searchParams.set('title', trackName);
    url.searchParams.set('artist', artistName);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`YouTube search failed: ${res.status}`);
    const data = (await res.json()) as VideoSearchResult;
    return data;
}