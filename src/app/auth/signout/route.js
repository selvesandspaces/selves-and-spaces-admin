import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Layouts can't clear cookies, so a signed-in user without admin access is sent here to be signed
// out before landing on /login. Without this, /login would bounce them straight back to /admin.
export async function GET(request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const reason = request.nextUrl.searchParams.get('reason');
  const url = new URL('/login', request.url);
  if (reason === 'forbidden' || reason === 'expired') url.searchParams.set('error', reason);
  return NextResponse.redirect(url);
}
