import { apiPatch, apiPost } from '@/lib/api/client';

// PATCH /users/me. For the super admin an email change applies immediately (no confirmation mail).
export async function updateEmail(email) {
  return apiPatch('/users/me', { email });
}

// POST /users/me/password → 204. The API checks the current password and requires the new one to differ.
export async function changePassword(currentPassword, newPassword) {
  return apiPost('/users/me/password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
}
