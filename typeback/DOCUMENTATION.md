# TypeChorus — Backend (Express + Mongoose)

Express API for authentication, YouTube search proxy, and persistence.

## Quick Start

Windows PowerShell:

```powershell
cd "$(Resolve-Path .)\typeback"
Copy-Item .env.example .env -Force
npm install
npm start
```

Default server: `http://localhost:3000`

## Environment

Set in `typeback/.env` (copy from `env.example`):

```
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
JWT_SECRET=change-me-in-production
JWT_TTL=7d
MONGODB_URI=mongodb://127.0.0.1:27017/typechorus
```

## Scripts

```bash
npm start       # start server
npm run dev     # if configured with nodemon
```

## Project Structure

```
typeback/
  app.js               # Shared Express app (routes + middleware)
  server.js            # Local startup entrypoint (connect DB + listen)
  api/
    [...route].js      # Vercel serverless handler for /api/*
  db.js                # Mongo connection
  routes/
    authRoutes.js      # register/login/me
    youtubeRoutes.js   # YouTube search proxy
  models/
    User.js            # Mongoose user schema
  utils/
    auth.js            # JWT helpers & middleware
  youtubeSearch.js     # YouTube search implementation
```

## API Reference

Auth
- POST `/api/auth/register` → `{ token, user }`
  - body: `{ email, username, password }`
- POST `/api/auth/login` → `{ token, user }`
  - body: `{ username, password }`
- GET `/api/me` (Bearer token) → `{ user }`

YouTube
- GET `/api/youtube/search?title=...&artist=...` → ranked candidates `{ videoId, title, channel, duration }`

Health
- GET `/api/health` → `{ status: "ok" }` (add route if not present)

## CORS

Allowed origin is controlled by `FRONTEND_ORIGIN`. Update and restart to apply.

## Deploy Backend On Vercel

1. Open a terminal in `typeback`.
2. Deploy as a separate Vercel project:

```bash
npx vercel --prod
```

3. Add environment variables in the backend Vercel project:

```env
FRONTEND_ORIGIN=https://<your-frontend-domain>
JWT_SECRET=<strong-random-secret>
JWT_TTL=7d
MONGODB_URI=<your-mongodb-uri>
```

4. Test health endpoint:

```text
https://<your-backend-domain>/api/health
```

5. In the frontend Vercel project, set:

```env
VITE_BACKEND_BASE=https://<your-backend-domain>
```

## Troubleshooting

- Mongo connection errors → verify `MONGODB_URI` and network access.
- 401 responses → ensure `Authorization: Bearer <token>` is sent and `JWT_SECRET` matches.
- CORS errors → check `FRONTEND_ORIGIN` matches your deployed frontend URL.


