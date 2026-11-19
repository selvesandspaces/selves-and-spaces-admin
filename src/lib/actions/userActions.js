'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { setUserActive, updateProfile } from '@/lib/services/userService';
import { isAdminRequest } from '@/lib/session';

const EXPIRED = { ok: false, error: 'Your session has expired. Please sign in again.' };

export async function setUserActiveAction(id, active) {
  if (!(await isAdminRequest())) return EXPIRED;
  try {
    const user = await setUserActive(id, active);
    revalidatePath('/admin/settings/users');
    return { ok: true, data: user };
  } catch (err) {
    return { ok: false, error: err.message || 'Could not update the account.' };
  }
}

// `changes` holds only the fields to set: { name?, phone?, address? }.
export async function updateProfileAction(changes) {
  if (!(await isAdminRequest())) return EXPIRED;
  if (!changes || Object.keys(changes).length === 0) return { ok: false, error: 'Nothing to save.' };

  try {
    await updateProfile(changes);
  } catch (err) {
    return { ok: false, error: err.message || 'Could not save your profile.' };
  }

  // The name is read from the token's metadata, so re-issue it for the top bar to pick it up.
  const supabase = await createClient();
  await supabase.auth.refreshSession();
  revalidatePath('/admin', 'layout');
  return { ok: true };
}
