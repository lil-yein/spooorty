/**
 * delete-account — Edge Function for permanent user deletion.
 *
 * Flow:
 *   1. Client (signed in) calls `supabase.functions.invoke('delete-account')`.
 *   2. We verify the caller's JWT and pull their user id.
 *   3. We use a service-role admin client to call auth.admin.deleteUser(),
 *      which removes the auth.users row. ON DELETE CASCADE on
 *      public.users.id then wipes the profile and all related rows.
 *
 * Diagnostic logs are intentionally verbose — every invocation should
 * leave a trail so deletion failures are debuggable from the dashboard.
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  console.log(`[delete-account] ${req.method} ${req.url}`);

  // Handle preflight (some setups need this even though Supabase normally adds it)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.warn('[delete-account] missing Authorization header');
    return jsonResponse({ error: 'Missing auth header' }, 401);
  }

  // Per-user client used only to identify the caller
  const userClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) {
    console.warn('[delete-account] getUser failed:', userErr?.message);
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }
  console.log(`[delete-account] caller uid=${user.id}`);

  // Admin client to actually remove the auth row (cascade handles the rest)
  const adminClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const { error: delErr } = await adminClient.auth.admin.deleteUser(user.id);
  if (delErr) {
    console.error('[delete-account] deleteUser failed:', delErr.message);
    return jsonResponse({ error: delErr.message }, 500);
  }

  console.log(`[delete-account] OK — deleted uid=${user.id}`);
  return jsonResponse({ ok: true });
});
