# Verath Auto (Phase 1 + 2)

Your AI-powered automotive platform. Node 22 + Express + SQLite (built-in `node:sqlite`), server-rendered, no build step.

## Run
    npm install
    npm run seed      # dev data (wipes DB). Password for all seed users: Password123!
    npm start         # http://localhost:3000
    npm test          # 13 end-to-end tests against a throwaway DB

Seed logins: admin@verathauto.test, dealer1..6@verathauto.test, consumer@verathauto.test

## Layout
- `src/db/schema.js` users, sessions, dealers, vehicles, vehicle_features, vehicle_images, listings, favorites, inquiries, events
- `src/repositories/*` all SQL lives here
- `src/modules/{auth,marketplace,dealer,admin}` routes
- `src/services/registry.js` + `ai/` declared-but-unbuilt Phase 2+ services (advisor, deal analyzer, inspection, mechanic, dealer assistant, market intelligence); `crm/` and `analytics/` are live boundaries
- `src/views/*` HTML templates (auto-escaped)

Vehicle = the physical car/spec. Listing = the commercial offer (price, city, seller, status).
Seed photos are generated illustrations; dealers upload real photos (JPEG/PNG/WebP, 5 MB).

## Phase 2: AI + Showroom
- AI services (`src/services/ai/*Service.js`) are called through the registry and exposed by `src/modules/ai/routes.js` (`/api/ai/*`).
- Every AI feature computes facts from real marketplace data first. The model (if configured) only writes within those facts, and its output is validated.
- Configure ONE provider in `.env` (copy `.env.example`): `GROQ_API_KEY` (free tier, key starts `gsk_`) `OPENROUTER_API_KEY` or `ANTHROPIC_API_KEY`. Without a key the data-based features still work; Mechanic and Photo Inspection stay off.
- Groq retires/renames models now and then. If you get a model error, set `VERATH_AI_MODEL` and `VERATH_AI_VISION_MODEL` in `.env` (see console.groq.com/docs/models).
- Verath Auto Showroom: `/showroom`, requests at `/showroom/request`, admin console at `/admin/showroom`.
- `npm test` runs 50 end-to-end tests, including a mock AI provider that misbehaves on purpose.

## Owner dashboard
- Log in as an admin: `/admin` is your dashboard, with **Showroom orders** first. Sellers submit at `/showroom/request`; the link to share is on the dashboard.
- Make your own account an admin: sign up on the site, then run `npm run make-admin -- you@example.com`.

## Speed
- Advisor, Deal Analyzer and Compare show an instant data-based answer, then upgrade it in place when the AI finishes.
- Identical AI questions are cached for 15 minutes (photos are never cached). Slow AI calls are abandoned after 25 s (`AI_FAST_TIMEOUT_MS`) and the data-based answer is kept.

## Deploying
See DEPLOY.md (needs a host with a persistent disk; Vercel/Cloudflare do not fit this version).
