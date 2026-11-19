'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { updateEmail, changePassword } from '@/lib/services/accountService';
import { isAdminRequest } from '@/lib/session';

const EXPIRED = { ok: false, error: 'Your session has expired. Please sign in again.' };
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MIN_PASSWORD = 8; // matches PasswordChange.new_password in the API

// The access token still carries the old email/credentials after a change. Re-issue it so the app
// (and /me) see the new state. If that fails, the caller sends the admin to sign in again.
async function refreshSession() {
  const supabase = await createClient();
  const { error } = await supabase.auth.refreshSession();
  return !error;
}

// Errors are returned, not thrown (Server Action errors are masked in production), and passwords
// are never logged or echoed back.
export async function updateEmailAction(email) {
  if (!(await isAdminRequest())) return EXPIRED;

  const value = String(email ?? '').trim();
  if (!EMAIL_RE.test(value)) return { ok: false, error: 'Enter a valid email address.' };

  try {
    await updateEmail(value);
  } catch (err) {
    return { ok: false, error: err.message || 'Could not update the email.' };
  }

  const refreshed = await refreshSession();
  revalidatePath('/admin', 'layout');
  return { ok: true, reauth: !refreshed };
}

export async function changePasswordAction(currentPassword, newPassword) {
  if (!(await isAdminRequest())) return EXPIRED;

  if (!currentPassword) return { ok: false, field: 'current', error: 'Enter your current password.' };
  if (!newPassword || newPassword.length < MIN_PASSWORD)
    return { ok: false, field: 'next', error: `Use at least ${MIN_PASSWORD} characters.` };
  if (newPassword === currentPassword)
    return { ok: false, field: 'next', error: 'The new password must differ from the current one.' };

  try {
    await changePassword(currentPassword, newPassword);
  } catch (err) {
    const message = err.message || 'Could not change the password.';
    return { ok: false, field: /current password/i.test(message) ? 'current' : undefined, error: message };
  }

  const refreshed = await refreshSession();
  return { ok: true, reauth: !refreshed };
}
