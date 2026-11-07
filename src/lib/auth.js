'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { fetchMe } from '@/lib/session';

export async function login(prevState, formData) {
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();
  if (!email || !password) return { error: 'Enter your email and password.' };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    return { error: 'Invalid email or password.' };
  }

  const result = await fetchMe(data.session.access_token);
  if (result.status !== 'ok') {
    await supabase.auth.signOut();
    return {
      error:
        result.status === 'unreachable'
          ? 'Could not reach the server. Make sure the API is running.'
          : 'Your session could not be verified. Please try again.',
    };
  }
  if (!result.me.roles?.includes('super_admin')) {
    await supabase.auth.signOut();
    return { error: 'This account does not have admin access.' };
  }

  redirect('/admin');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
