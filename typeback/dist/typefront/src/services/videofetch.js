"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchVideoInfo = fetchVideoInfo;
async function fetchVideoInfo({ trackName, artistName }) {
    const url = new URL('/api/youtube/search', window.location.origin);
    url.searchParams.set('title', trackName);
    url.searchParams.set('artist', artistName);
    const res = await fetch(url.toString());
    if (!res.ok)
        throw new Error(`YouTube search failed: ${res.status}`);
    const data = (await res.json());
    console.log(data);
    return data;
}
//# sourceMappingURL=videofetch.js.map