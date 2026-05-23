# Deploy — Vidya Chinthana

## Netlify

1. Connect repo; build settings are in `netlify.toml`:
   - Build: `npm run build`
   - Publish: `dist`
   - Functions: `netlify/functions`
2. Set environment variables in Netlify UI (see `.env.example`):
   - `GEMINI_API_KEY` (optional, CMS AI)
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (optional DB)
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (optional client reads)
3. Deploy. Hash routes (`/#/home`) work without SPA fallback.

## Supabase (optional)

Omit Supabase keys to use local JSON fallback (`data_db/`). With keys, wire articles/issues through existing API layer.

## Local

```bash
npm install
npm run dev
```

Verify: `npm run lint` and `npm run build`.
