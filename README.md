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
- **YouTube Search** - Fetches video IDs, titles, channels, and durations via `yt-search` library
- **MongoDB Atlas** - Stores user accounts and saved songs (persistent storage)

**Core Features:**
- Song search with artist/title filters
- Synchronized lyrics display with real-time highlighting
- YouTube video playback integration
- User authentication (JWT-based)
- Personal saved songs library

---

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
