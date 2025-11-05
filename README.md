# TypeChorus - A Lyrical Typing Game

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/0dZcTr0x)

## Project Overview

### Application Outline
**TypeChorus** is an interactive web-based typing game that combines music, lyrics, and typing practice. Players search for songs, watch synchronized YouTube videos, and type lyrics in real-time as they appear on screen.

**Target Users:**
- Music enthusiasts who want to improve typing speed
- Students learning to type while enjoying their favorite songs
- Casual gamers looking for an engaging typing challenge

**Data Sources:**
- **LRCLIB API** (https://lrclib.net) - Provides synchronized and plain lyrics for songs
- **YouTube Search** - Fetches video IDs, titles, channels, and durations via `ytmusic-api` library
- **MongoDB Atlas** - Stores user accounts and saved songs (persistent storage)

**Core Features:**
- Song search with artist/title filters
- Synchronized lyrics display with real-time highlighting
- YouTube video playback integration
- User authentication (JWT-based)
- Personal saved songs library

---

## Table of Contents

- [Project Overview](#project-overview)
- [MVP Implementation Status](#mvp-implementation-status)
- [Source Code Guide](#source-code-guide)
- [Next Steps](#next-steps)
- [Summary of main roles](#summary-of-main-roles)
- [Communication & collaboration](#communication--collaboration)
- [Test Credentials](#test-credentials)

## MVP Implementation Status

#### Milestone 1: Project Setup & Core Architecture
- [x] React + TypeScript + Vite frontend (`typefront/`)
- [x] Express.js backend with ESM modules (`typeback/`)
- [x] MongoDB connection via Mongoose
- [x] Development environment configuration
- [x] CORS and proxy setup for frontend-backend communication

#### Milestone 2: External API Integration
- [x] LRCLIB lyrics service integration
  - Search songs by title/artist
  - Fetch synchronized and plain lyrics
  - Dev proxy configuration with proper User-Agent headers
- [x] YouTube video search functionality
  - Custom ranking algorithm prioritizing artist/title matches
  - Video metadata extraction (duration, channel, videoId)

#### Milestone 3: User Authentication System
- [x] JWT-based authentication backend
  - User registration with password hashing (bcryptjs)
  - Login endpoint with credential verification
  - Protected routes using auth middleware
  - Token expiration and renewal (7-day default)
- [x] MongoDB User model with secure password storage
- [x] `/api/me` endpoint for current user info

#### Milestone 4: Game Features
- [x] Lyrics parser for synchronized display (`lyricsParser.ts`)
- [x] Real-time lyric highlighting
- [x] YouTube video controller integration
- [x] Game input component for typing
- [x] Saved Songs API (CRUD operations)
  - POST `/api/saved` - Save favorite songs
  - GET `/api/saved` - List user's saved songs
  - DELETE `/api/saved/:id` - Remove saved songs

#### Milestone 5: UI/UX Components
- [x] Search interface with filters
- [x] Video card and playback controls
- [x] Lyrics display with synchronized highlighting
- [x] Game controls and input handling
- [x] Profile page structure
- [x] Responsive design with Tailwind CSS
## Source Code Guide

### Frontend (`typefront/`)

Project layout (simplified):

```text
typefront/
  src/
    components/
      game_comp/
        Game.tsx                # Game shell: orchestrates video, lyrics, scoring
        GameControls.tsx        # Start/pause/next; integrates with hooks
        VideoCard.tsx           # YouTube iframe container and state bridge
        LyricsDisplay.tsx       # Renders lines and active word highlight
        ScoreHud.tsx            # Displays accuracy/score/timing
        gamefunction/           # Game logic hooks (pure, testable)
          useVideoControl.ts    # Start/stop video, seek, permission handling
          useLyricSync.ts       # Sync lyrics to playbackTime
          useScoring.ts         # Keystroke evaluation & scoring
          useGamePhase.ts       # Lobby → Playing → Finished transitions
          useLineAdvancement.ts # Advance through words/lines
          useInputValidation.ts # Compares user input vs target word
          useGameData.ts        # Loads song + lyrics bundle
          useYoutubeTime.ts     # Polls and normalizes player time
          loadVideoId.ts        # Picks best video by heuristics
          videofunction.ts      # YouTube player helpers
      search/
        Search.tsx              # Search page shell
        SearchInput.tsx         # Controlled input + debounce
        SearchResults*.tsx      # Cards, list, container
      login_profile/
        logincard.tsx           # Login form
      user_profile/
        *.tsx                   # Profile UI & modals
    contexts/
      AuthContext.tsx           # Auth provider (user, token, actions)
    services/
      lrc.ts                    # LRCLIB calls (search, lyrics)
      auth.ts                   # Auth API (login/register/me)
      videofetch.ts             # YouTube search proxy calls
    pages/
      Home.tsx, GamePage.tsx, Profile.tsx
    App.tsx                     # Routes
```

Key data flows:
- Search → `services/lrc.ts` and backend `/api/youtube/search` to get candidates.
- Game start → `useGameData` loads lyrics + videoId → `useVideoControl` initializes player → `useLyricSync` drives highlighting → `useScoring` consumes keystrokes from `GameInput`.
- Auth → `AuthContext` stores token and user → `services/auth.ts` talks to backend (`VITE_API_BASE`).

Environment variables (copy from `typefront/env.example` to `.env`):
- `VITE_API_BASE` backend base URL
- `VITE_APP_NAME`, `VITE_APP_VERSION`

Testing:
- See `src/__tests__/` for UI tests around search and game controls.

### Backend (`typeback/`)

Project layout (simplified):

```text
typeback/
  server.js           # Express app setup, CORS, route mounting
  routes/
    authRoutes.js     # /api/auth: register, login, me
    youtubeRoutes.js  # /api/youtube: search proxy
  models/
    User.js           # Mongoose User schema
  utils/
    auth.js           # JWT helpers, middleware
  db.js               # Mongo connection bootstrap
  youtubeSearch.js    # YouTube search implementation
```

Notable endpoints:
- `POST /api/auth/register` → create user (bcrypt hashed)
- `POST /api/auth/login` → returns JWT
- `GET /api/me` → current user from JWT
- `GET /api/youtube/search?q=<query>&artist=<artist>` → ranked YouTube candidates

Security/auth:
- JWT middleware in `utils/auth.js`; `JWT_TTL` and `JWT_SECRET` configured via env.

Environment variables (copy from `typeback/env.example` to `.env`):
- `PORT`, `FRONTEND_ORIGIN`
- `JWT_SECRET`, `JWT_TTL`
- `MONGODB_URI`

Startup sequence:
1) `server.js` loads env, connects Mongo via `db.js`.
2) Applies CORS for `FRONTEND_ORIGIN` and JSON middleware.
3) Mounts `authRoutes` and `youtubeRoutes` under `/api`.

YouTube search:
- Implemented in `youtubeSearch.js` with ranking favoring title/artist match; exposed through `routes/youtubeRoutes.js`.

Where to start reading:
- Frontend: `src/pages/Home.tsx` → `Search.tsx` → `services/lrc.ts`; game flow starts at `GamePage.tsx` → `components/game_comp/Game.tsx`.
- Backend: `server.js` → `routes/*` → `utils/auth.js` and `youtubeSearch.js`.

## Next Steps

- Configure envs: copy `typefront/env.example` → `typefront/.env`; `typeback/env.example` → `typeback/.env`, fill `JWT_SECRET` and `MONGODB_URI`.
- Install dependencies: run `npm i` in both `typeback/` and `typefront/`.
- Start backend: from `typeback/`, run `npm run dev` (or `npm start`); confirm it binds on `PORT` and CORS allows `FRONTEND_ORIGIN`.
- Start frontend: from `typefront/`, run `npm run dev`; ensure `VITE_API_BASE` points to backend.
- Smoke test flows:
  - Search a song; verify YouTube card renders and lyrics load.
  - Start a game; check highlighting, input, scoring, and end-state.
  - Auth: register, login, hit `/api/me`, and protected UI.
- Resolve any CORS/auth issues; verify JWT expiry behavior.
- Add tests for risky cases (media permissions, empty lyrics); run tests in `typefront/src/__tests__/`.
- Update docs: add getting started and troubleshooting to `typefront/README.md` and `typeback/README.md`.
- Plan deployment: choose hosting (frontend: Vercel/Netlify; backend: Render/Fly/Railway), create production `.env`, and rotate real secrets.

Quickstart commands:

```bash
# Backend
cd typeback
npm i
npm run dev

# New terminal → Frontend
cd ../typefront
npm i
npm run dev
```

---

## Summary of main roles

| Member | Primary role | Key contributions | Representative code |
| --- | --- | --- | --- |
| Anh Duy Pham | Fullstack Development and monitoring | Develop Game UI, Game Logic Implementation, Lyrics Parsing, Youtube Search system | `Game.tsx, lyricsParser.ts, VideoCard.tsx, VideoController.tsx, youtubeRoutes.js, youtubeSearch.js,...` |
| Muhammad Waleed Hassan | Frontend (Search & UI) | Implemented search flow and results UI, improved loading/error UX, and polished responsive styling. | `typefront/src/components/search/*`, `typefront/src/services/lrc.ts`, `typefront/src/components/search/LoadingOverlay.tsx`, `typefront/src/components/ui-kit/highlightbutton.tsx` |
| Sujal Gurung | Backend (Auth & Mongo) | Implemented JWT authentication flow, MongoDB/Mongoose setup, environment configuration, and secured route middleware. | `typeback/models/User.js`, `typeback/utils/auth.js`, `typeback/db.js`, `typeback/routes/authRoutes.js` |
| Andy Luu | Auth & Profile UI, QA/Tooling | Built login/profile UI and auth context; added tests and onboarding docs; improved DX. | `typefront/src/contexts/AuthContext.tsx`, `src/components/login_profile/logincard.tsx`, `src/components/user_profile/*`, `src/__tests__/*`, `README.md` |

### Communication & collaboration
- Standups: 10–15 min daily to surface blockers and assign priorities.
- Issue tracking: GitHub Issues + labels (feature/bug/docs).
- Code reviews: Small PRs (<300 LOC) with checklist (tests, types, accessibility). Turnaround target <24h.
- Branching: Feature branches → PR → squash merge; protected `main` with CI checks.

---

## Website login Credentials

Use the following credentials for manual testing:

| Field | Value |
| --- | --- |
| Username | `Test1` |
| Password | `123456` |

> Note: These are for development/testing only. Do not use in production.

## Test running info
- # Typefront (frontend)

  - # Install once:
    - cd typefront
    - npm i -D vitest @testing-library/react @testing-library/user-event jsdom

  - # Run all tests (watch):
    - npx vitest --environment jsdom

- # Typeback (backend)

  - # Install once:
    - cd typeback
    - npm i -D vitest

  - # Run all tests (watch):
    - npx vitest
