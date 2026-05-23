/**
 * Import data_db/*.json into Supabase (requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).
 * Run: npx tsx scripts/seed-supabase.ts
 */
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
dotenv.config();

const DB_DIR = path.join(process.cwd(), "data_db");

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const users = readJson<
    Array<{
      id: string;
      username: string;
      passwordHash: string;
      role: string;
      name: string;
      createdAt: string;
    }>
  >(path.join(DB_DIR, "users.json"));

  const { error: usersErr } = await supabase.from("app_users").upsert(
    users.map((u) => ({
      id: u.id,
      username: u.username,
      password_hash: u.passwordHash,
      role: u.role,
      name: u.name,
      created_at: u.createdAt,
    }))
  );
  if (usersErr) throw usersErr;
  console.log(`✓ ${users.length} users`);

  const articles = readJson<Array<Record<string, unknown>>>(
    path.join(DB_DIR, "articles.json")
  );
  const { error: artErr } = await supabase.from("articles").upsert(
    articles.map((a) => ({
      id: a.id as string,
      data: a,
    }))
  );
  if (artErr) throw artErr;
  console.log(`✓ ${articles.length} articles`);

  const issues = readJson<Array<Record<string, unknown>>>(
    path.join(DB_DIR, "issues.json")
  );
  const { error: issErr } = await supabase.from("issues").upsert(
    issues.map((i) => ({ id: i.id as string, data: i }))
  );
  if (issErr) throw issErr;
  console.log(`✓ ${issues.length} issues`);

  const profiles = readJson<Array<Record<string, unknown>>>(
    path.join(DB_DIR, "profiles.json")
  );
  const { error: profErr } = await supabase.from("profiles").upsert(
    profiles.map((p) => ({ id: p.id as string, data: p }))
  );
  if (profErr) throw profErr;
  console.log(`✓ ${profiles.length} profiles`);

  const glossary = readJson<Array<{ term: string } & Record<string, unknown>>>(
    path.join(DB_DIR, "glossary.json")
  );
  const { error: glErr } = await supabase.from("glossary_terms").upsert(
    glossary.map((g) => ({ term: g.term, data: g }))
  );
  if (glErr) throw glErr;
  console.log(`✓ ${glossary.length} glossary terms`);

  const site = readJson<Record<string, unknown>>(path.join(DB_DIR, "site.json"));
  const { error: siteErr } = await supabase.from("site_config").upsert({
    id: "default",
    data: site,
  });
  if (siteErr) throw siteErr;
  console.log("✓ site_config");

  console.log("\nDone. Default passwords unchanged (hash in JSON).");
  console.log("Change owner password after first deploy.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
