import type { SongInfo } from "../types/music";
import { API_PATHS, requestJson, toApiUrl } from './apiClient';

type VideoSearchResult = {
  videoId: string;
  title: string;
  channel: string;
  duration: number;
  queryUsed: string;
}

export async function fetchVideoInfo({trackName, artistName}: SongInfo): Promise<VideoSearchResult | null> {
  const url = toApiUrl(API_PATHS.youtube.search);
    url.searchParams.set('title', trackName);
    url.searchParams.set('artist', artistName);
  return requestJson<VideoSearchResult>(url, undefined, 'YouTube search failed');
}