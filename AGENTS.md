# Base44 Dev Environment

## Project
Vite + React frontend (AI Prompt Packs Marketplace). No backend, no database, no external services. Data is stored in the browser via `src/storageShim.js` (a localStorage-based `window.storage` shim).

## Run
`docker compose -f docker-compose.base44.yml up -d` — binds source into a `node:22` container, runs `npm install` then `vite` dev server (port 5173, mapped to host 3000). Live reload via Vite HMR (polling enabled for bind mounts).

## Verify
- `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/` returns the app HTML.
- Preview loads the catalog grid of prompt packs.

## Notes
- `vite.config.js` sets `server.host: true` and `allowedHosts: true` so the preview's external hostname is accepted.
- No secrets required.
