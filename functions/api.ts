// functions/api.ts – Cloudflare Pages Function
import { createClient } from '@supabase/supabase-js';

// Helper: SHA-256 hash පාවිච්චි කරන්න Web Crypto API
async function sha256(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequest(context: { request: Request; env: any }) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');

  // Supabase client (service role only in backend)
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // Route: GET /api/articles
  if (path === '/articles' && request.method === 'GET') {
    const { data, error } = await supabase.from('articles').select('data');
    return Response.json(error ? [] : data.map(row => row.data));
  }

  // Route: POST /api/auth/login
  if (path === '/auth/login' && request.method === 'POST') {
    const { username, password } = await request.json();
    const passwordHash = await sha256(password);
    const { data, error } = await supabase
      .from('app_users')
      .select('id, username, role, name')
      .eq('username', username)
      .eq('password_hash', passwordHash);
    if (error || !data?.length) return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    return Response.json({ user: data[0] });
  }

  // Route: GET /api/articles/:id
  if (path.startsWith('/articles/') && request.method === 'GET') {
    const id = path.split('/')[2];
    const { data, error } = await supabase
      .from('articles')
      .select('data')
      .eq('id', id)
      .single();
    if (error || !data) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(data.data);
  }

  // Route: GET /api/issues
  if (path === '/issues' && request.method === 'GET') {
    const { data, error } = await supabase.from('issues').select('data');
    return Response.json(error ? [] : data.map(row => row.data));
  }

  // Route: GET /api/glossary
  if (path === '/glossary' && request.method === 'GET') {
    const { data, error } = await supabase.from('glossary_terms').select('data');
    return Response.json(error ? [] : data.map(row => row.data));
  }

  // Route: GET /api/profiles
  if (path === '/profiles' && request.method === 'GET') {
    const { data, error } = await supabase.from('profiles').select('data');
    return Response.json(error ? [] : data.map(row => row.data));
  }

  // Route: POST /api/upload/image (Cloudinary)
  if (path === '/upload/image' && request.method === 'POST') {
    // Forward to dedicated upload function
    const uploadHandler = await import('./api/upload/image');
    return uploadHandler.onRequest(context);
  }

  // Fallback
  return Response.json({ error: 'Not found' }, { status: 404 });
}