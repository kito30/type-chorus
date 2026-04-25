# TypeChorus — Frontend (React + TypeScript + Vite)

This is the web client for TypeChorus, the lyrical typing game.

## Quick Start

1. Copy env and install

```bash
cp env.example .env
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open the app

```
http://localhost:5173
```

## Environment

Create `.env` (or copy `env.example`):

```
VITE_API_BASE=http://127.0.0.1:3000
VITE_BACKEND_BASE=
VITE_APP_NAME=TypeChorus
VITE_APP_VERSION=dev
```

## Scripts

```bash
npm run dev       # start Vite dev server
npm run build     # production build
npm run preview   # preview built app
```

## Project Structure

```
src/
  components/
    game_comp/
      Game.tsx
      GameControls.tsx
      VideoCard.tsx
      LyricsDisplay.tsx
      ScoreHud.tsx
      gamefunction/
        useVideoControl.ts
        useLyricSync.ts
        useScoring.ts
        useGamePhase.ts
        useLineAdvancement.ts
        useInputValidation.ts
        useGameData.ts
        useYoutubeTime.ts
        loadVideoId.ts
        videofunction.ts
    search/
      Search.tsx, SearchInput.tsx, SearchResults*.tsx
    login_profile/
      logincard.tsx
    user_profile/
      *.tsx
  contexts/
    AuthContext.tsx
  services/
    lrc.ts, auth.ts, videofetch.ts
  pages/
    Home.tsx, GamePage.tsx, Profile.tsx
  App.tsx
```

## Data Flow (High Level)

- Search: UI → `services/lrc.ts` and backend `/api/youtube/search` → results UI.
- Game: `GamePage` → `Game` → `useGameData` → `useVideoControl` + `useLyricSync` + `useScoring`.
- Auth: `AuthContext` stores token; `services/auth.ts` communicates with backend.

## Testing

UI tests live in `src/__tests__/`. Run with your workspace test runner (e.g., Vitest/Jest if configured).

## Troubleshooting

- Ensure `VITE_API_BASE` matches the backend `PORT`.
- On Vercel, do not use `localhost` values; use `VITE_BACKEND_BASE=https://<your-backend-domain>`.
- CORS errors: confirm backend `FRONTEND_ORIGIN` includes `http://localhost:5173`.
- YouTube playback: browser autoplay policies may require a user gesture; `useVideoControl` starts muted then unmutes.

## LRCLIB

- Dev proxy forwards `/api/lrc/*` to `https://lrclib.net/api/*` with headers as needed.
- Service functions in `src/services/lrc.ts`:
  - `searchSongs({ q | track_name | artist_name | album_name | duration })`
  - `getLyricsById(id)`
  - `getLyricsBySignature({ track_name, artist_name, album_name, duration })`
  - `getLyricsBySignatureCached({ track_name, artist_name, album_name, duration })`
  - Docs: `https://lrclib.net/`
