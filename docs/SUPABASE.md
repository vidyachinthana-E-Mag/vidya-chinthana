# Supabase integration

## Architecture (hybrid — Option B)

- **Local dev without env:** JSON files in `data_db/` (same as before).
- **With `SUPABASE_URL` + service key:** Express / Netlify API reads and writes Postgres via `@supabase/supabase-js`.
- **Browser:** Still uses `/api/*` by default. Optional `VITE_SUPABASE_*` enables `src/lib/supabase.ts` for direct public reads under RLS.

This ships fastest while staying production-viable; you can later move more reads to the anon client or adopt Supabase Auth.

## Tables

| Table | Mirrors |
|-------|---------|
| `app_users` | `data_db/users.json` |
| `articles` | `data_db/articles.json` (full document in `data` JSONB) |
| `issues` | `data_db/issues.json` |
| `profiles` | `data_db/profiles.json` |
| `glossary_terms` | `data_db/glossary.json` |
| `site_config` | `data_db/site.json` (singleton `id = default`) |

## Row Level Security

- **anon / authenticated:** SELECT published articles, all issues, profiles, glossary, site config.
- **Writes:** Only via API using **service_role** (bypasses RLS). Never expose service role in the frontend.

## Migration from JSON

1. Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor.
2. Set env vars in `.env`.
3. `npm run seed:supabase`
4. Restart dev server or redeploy Netlify with the same env vars.

## Auth note

The app keeps **username + password** in `app_users` (SHA-256, same as JSON era) for compatibility. Migrating to Supabase Auth is a follow-up: map roles to JWT claims and tighten RLS for CMS writes.
