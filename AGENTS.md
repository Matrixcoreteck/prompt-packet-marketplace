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

## Accounts (demo auth, no backend yet)
- Accounts live in the browser via `window.storage` (see `src/auth/authService.js`): `account:<id>` records store a salted SHA-256 password hash — never plaintext, and the hash is stripped by `sanitize()` before any component sees a user object. The session is a plain `authSession` userId marker. The service mirrors a real auth provider API (signUp/logIn/logOut/session/profile) so it can be swapped for a real backend later without touching components.
- Per-user data keys: `purchase:<userId>:<packId>`, `favorite:<userId>:<packId>`, `recentlyViewed:<userId>`, `draft:product:<userId>`. Legacy pre-account global keys (`purchase:<id>`, `favorite:<id>`, `recentlyViewed`, `draft:product`) are claimed into the first account that signs in on that browser (`claimLegacyData`) — a one-time safe migration.
- Creator identity: `account.creatorName` is set once on the user's first published product, then locked in the builder (no retyping). Products carry `creatorUserId`; the dashboard shows only `creatorUserId === user.id` or `sellerName === user.creatorName` (legacy fallback).
- Protected views (Library, Profile, Dashboard, Sell) render `AuthPrompt` when logged out; purchases and favorites require login. Marketplace, product pages, and public creator storefronts stay open to everyone.
- Password reset is NOT custom-built (per spec): the FORGOT PASSWORD? link shows an honest note that it awaits the platform auth system.
