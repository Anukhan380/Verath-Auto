# Deploying Verath Auto

## Why not Vercel or Cloudflare?
This app keeps its database and uploaded photos on a disk. Vercel and Cloudflare are "serverless": they have no permanent disk, so every upload and every signup would be lost. They become an option after the Phase 3 move to Postgres + file storage. Until then, use a host that gives the app a small permanent disk.

## Recommended: Render (paid plan with a disk)
A free Render plan will NOT work: it has no permanent disk and it goes to sleep. Check render.com/pricing for the current price of the Starter plan and disk (about $7/month plus a few cents per GB when this was written).

1. Put the project on GitHub: install GitHub Desktop, File > New repository, choose the `verath-auto` folder, then Publish repository (keep it Private).
2. On render.com, sign up, then New + > Blueprint, connect GitHub, choose the repo. Render reads `render.yaml`.
3. When asked for values, fill in:
   - `ADMIN_EMAIL`: your email. `ADMIN_PASSWORD`: a long password (10+ characters). This creates your owner account on first start.
   - `OPENROUTER_API_KEY` (or `GROQ_API_KEY`): your AI key. Leave the other empty.
   - `VERATH_SHOWROOM_PHONE` / `VERATH_SHOWROOM_WHATSAPP`: the numbers buyers should call.
4. Deploy. When it is live, open the address Render gives you, log in with your admin email, then change your password on the Profile page. Afterwards delete `ADMIN_PASSWORD` from Render's Environment tab.
5. Check the Owner dashboard: "AI connection" should say Connected.

The live site starts EMPTY (no demo cars, no demo users). Dealers sign up and add cars; sellers use /showroom/request.

## Other hosts that work
Any host that can run the Dockerfile and mount a persistent disk at `/data` with `DATA_DIR=/data` and `NODE_ENV=production` set (for example Railway with a Volume, or Fly.io). Do not use plans without a permanent disk.

## Before real customers
- Backups: use "Download backup" on the Owner dashboard regularly (it saves the database, not the photos), and check your host's disk snapshot options.
- Add a privacy policy and terms page: the Showroom collects phone numbers, names and photos. Not built yet.
- One instance only: login throttling and AI limits are kept in memory, and SQLite does not support several servers.
- No notifications yet: you must open the Owner dashboard to see new Showroom orders.
