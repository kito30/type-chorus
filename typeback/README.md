# TypeChorus Backend (Express)

This is the Express.js backend for TypeChorus. It provides:

- User registration and login with JWT
- Protected `/api/me` endpoint
- YouTube search helper at `/api/youtube/search`
- MongoDB storage via Mongoose

## Quick start (Windows PowerShell)

1. Copy environment file

```powershell
cd "$(Resolve-Path .)\typeback"
Copy-Item .env.example .env -Force
```

2. Install dependencies

```powershell
npm install
```

3. Run the API

```powershell
npm start
# or hot reload during dev (if nodemon installed globally):
# npx nodemon server.js
```

The server starts on http://localhost:3000 by default.

## Config

Set these in `typeback/.env` (default values shown):

```
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
JWT_SECRET=replace_me_in_prod
JWT_TTL=7d
MONGODB_URI=mongodb://127.0.0.1:27017/typechorus
```

## API

- `GET /api/health` → `{ status: "ok" }`
- `POST /api/auth/register` → `{ token, user }` with body `{ email, username, password }`
- `POST /api/auth/login` → `{ token, user }` with body `{ email, password }`
- `GET /api/me` (Authorization: Bearer <token>) → `{ user }`
- `GET /api/youtube/search?title=...&artist=...` → `{ videoId, title, channel, duration, queryUsed }`

## Notes

- Storage uses MongoDB through Mongoose. You can point `MONGODB_URI` to Atlas or a local server.
- CORS is restricted to the Vite dev server origin by default (`http://localhost:5173`).

## Troubleshooting

- If port 3000 is busy, set `PORT` in `.env` and restart.
- If you change `FRONTEND_ORIGIN`, restart the API to apply new CORS settings.
