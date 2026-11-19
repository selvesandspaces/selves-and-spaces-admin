import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Asks the backend who the token belongs to; the roles come from the API, not the client.
// status: 'ok' | 'unauthorized' (token rejected) | 'unreachable' (network error, timeout or 5xx)
export async function fetchMe(accessToken) {
  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return { status: 'ok', me: await res.json() };
    if (res.status === 401 || res.status === 403) return { status: 'unauthorized' };
    return { status: 'unreachable' };
  } catch {
    return { status: 'unreachable' };
  }
}

// state: 'anon' (no valid session) | 'forbidden' (signed in, not a super admin)
//      | 'unreachable' (API down, so the role can't be checked) | 'ok' (with `user`)
export const getSessionState = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { state: 'anon' };
  const profileName = data.claims.user_metadata?.name;

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) return { state: 'anon' };

  const result = await fetchMe(token);
  if (result.status === 'unreachable') return { state: 'unreachable' };
  if (result.status === 'unauthorized') return { state: 'anon' };

  const { me } = result;
  if (!me.roles?.includes('super_admin')) return { state: 'forbidden' };

  return {
    state: 'ok',
    user: {
      id: me.id,
      email: me.email,
      name: profileName || me.email?.split('@')[0] || 'Admin',
      role: 'admin',
    },
  };
});

// Cheap check for Server Actions: a verified token that carries the super_admin role. The backend
// still enforces roles on every call; this just stops unauthenticated callers early.
export async function isAdminRequest() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return !!data?.claims?.app_metadata?.roles?.includes('super_admin');
}

// The verified super admin, or null.
export async function getSession() {
  const s = await getSessionState();
  return s.state === 'ok' ? s.user : null;
}
