# Deploy Vidya Chinthana on Netlify

This site uses **hash routing** (`/#/home`, `/#/read/...`). Static hosting works without SPA rewrite rules.

## Prerequisites

1. [Netlify](https://www.netlify.com/) account
2. [Supabase](https://supabase.com/) project (recommended for production)
3. Git repository connected to Netlify

## 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com/dashboard).
2. Open **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`.
3. Copy **Project URL**, **anon key**, and **service_role key** (Settings → API).
4. Seed data from your local JSON:

   ```bash
   # In .env (local only):
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...

   npm run seed:supabase
   ```

## 2. Connect repo to Netlify

1. **Add new site** → Import from Git.
2. Build settings (also in `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
3. **Environment variables** (Site settings → Environment variables):

   | Variable | Context | Notes |
   |----------|---------|--------|
   | `SUPABASE_URL` | All | Same as dashboard URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | All | **Secret** — API only |
   | `GEMINI_API_KEY` | All | Optional CMS AI |
   | `VITE_SUPABASE_URL` | Build | Same URL (preconnect) |
   | `VITE_SUPABASE_ANON_KEY` | Build | Public anon key |

   Do **not** put `SUPABASE_SERVICE_ROLE_KEY` in any `VITE_` variable.

4. Deploy. API routes `/api/*` proxy to `netlify/functions/api` via `netlify.toml`.

## 3. Verify

- Open `https://YOUR_SITE.netlify.app/#/home`
- `https://YOUR_SITE.netlify.app/api/health` → `{ "status": "alive", "supabaseEnabled": true, ... }`
- Login with your seeded owner account (change passwords after go-live).

## 4. Custom domain

1. Netlify → **Domain management** → Add domain.
2. Update DNS per Netlify instructions.
3. In **Vidya Studio** / site config, set canonical URL to `https://yourdomain.com`.

## Hash routes vs history API

The app uses `window.location.hash` for navigation. Netlify serves `index.html` once; all routes are `/#/...`. No `/*` → `/index.html` redirect is required for routing (only for optional clean URLs if you migrate later).

## Limitations on Netlify

| Feature | Local (`npm run dev`) | Netlify |
|---------|----------------------|---------|
| Database | `data_db/*.json` if no Supabase env | Supabase when env set |
| Image uploads to `/uploads` | Yes | Disabled by default (ephemeral disk). Use external URLs or enable `NETLIFY_ENABLE_UPLOADS=true` (not durable) or Supabase Storage (future). |
| Long-running server | Express + Vite | Serverless functions (~10s timeout on free tier) |

## Local production test

```bash
npm run build
NODE_ENV=production npm run build:server && node dist/server.cjs
```

Or use [Netlify CLI](https://docs.netlify.com/cli/get-started/):

```bash
npx netlify dev
```
