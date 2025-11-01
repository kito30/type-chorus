"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSongs = searchSongs;
exports.getLyricsById = getLyricsById;
exports.getLyricsBySignature = getLyricsBySignature;
exports.getLyricsBySignatureCached = getLyricsBySignatureCached;
async function searchSongs(params) {
    const url = new URL('/api/lrc/search', window.location.origin);
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && String(value).length > 0) {
            url.searchParams.set(key, String(value));
        }
    }
    const res = await fetch(url.toString(), { headers: buildHeaders() });
    if (!res.ok) {
        throw new Error(`Search failed (${res.status})`);
    }
    const data = (await res.json());
    return data.map((item) => ({
        id: item.id,
        trackName: item.trackName,
        artistName: item.artistName,
        albumName: item.albumName,
        duration: item.duration,
        hasSyncedLyrics: Boolean(item.syncedLyrics && item.syncedLyrics.length > 0),
        hasPlainLyrics: Boolean(item.plainLyrics && item.plainLyrics.length > 0),
    }));
}
async function getLyricsById(id) {
    const url = new URL(`/api/lrc/get/${id}`, window.location.origin);
    const res = await fetch(url.toString(), { headers: buildHeaders() });
    if (!res.ok)
        throw new Error(`Get by id failed (${res.status})`);
    return (await res.json());
}
async function getLyricsBySignature(params) {
    const url = new URL('/api/lrc/get', window.location.origin);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
    }
    const res = await fetch(url.toString(), { headers: buildHeaders() });
    if (!res.ok)
        throw new Error(`Get failed (${res.status})`);
    return (await res.json());
}
async function getLyricsBySignatureCached(params) {
    const url = new URL('/api/lrc/get-cached', window.location.origin);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
    }
    const res = await fetch(url.toString(), { headers: buildHeaders() });
    if (!res.ok)
        throw new Error(`Get-cached failed (${res.status})`);
    return (await res.json());
}
function buildHeaders() {
    const appName = import.meta.env.VITE_APP_NAME || 'TypeChorus';
    const appVersion = import.meta.env.VITE_APP_VERSION || 'dev';
    return {
        'X-Client-Info': `${appName} v${appVersion}`,
    };
}
//# sourceMappingURL=lrc.js.map