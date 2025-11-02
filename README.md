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

##