# Type Chorus — Frontend

React + TypeScript + Vite app for the lyrical typing game.

## Getting started

1. Install deps

```bash
npm install
```

2. Create a `.env` in this folder:

```
VITE_APP_NAME=TypeChorus
VITE_APP_VERSION=0.1.0
```

3. Run dev server

```bash
npm run dev
```

## LRCLIB integration

- Dev proxy forwards `/api/lrc/*` → `https://lrclib.net/api/*` and sets a `User-Agent` header.
- In production, the frontend calls LRCLIB directly; browsers cannot set `User-Agent`, so we include `X-Client-Info` instead.

Available service functions in `src/services/lrc.ts`:

- `searchSongs({ q | track_name | artist_name | album_name | duration })`
- `getLyricsById(id)`
- `getLyricsBySignature({ track_name, artist_name, album_name, duration })`
- `getLyricsBySignatureCached({ track_name, artist_name, album_name, duration })`

API docs: `https://lrclib.net/`
