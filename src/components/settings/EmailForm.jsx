'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Field from '@/components/ui/Field';
import { updateEmailAction } from '@/lib/actions/accountActions';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function EmailForm({ currentEmail }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [saved, setSaved] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setSaved(null);
    const next = {};
    const value = email.trim();
    if (!EMAIL_RE.test(value)) next.email = 'Enter a valid email address.';
    else if (value.toLowerCase() === (currentEmail ?? '').toLowerCase()) next.email = 'That is already your email.';
    if (confirmEmail.trim().toLowerCase() !== value.toLowerCase()) next.confirmEmail = 'The two addresses do not match.';
    setErrors(next);
    // A typo here would lock the admin out (no confirmation mail is sent), so ask once more.
    if (Object.keys(next).length === 0) setConfirming(true);
  }

  async function save() {
    setSaving(true);
    setServerError(null);
    const res = await updateEmailAction(email.trim());
    setSaving(false);
    if (!res.ok) {
      setServerError(res.error);
      return;
    }
    setConfirming(false);
    if (res.reauth) {
      router.push('/auth/signout?reason=reauth');
      return;
    }
    setSaved(email.trim());
    setEmail('');
    setConfirmEmail('');
    router.refresh(); // the top bar reads the email from the session
  }

  return (
    <section className="bg-white rounded-xl border border-tan/30 p-6">
      <h3 className="text-base font-serif font-semibold text-ink">Email</h3>
      <p className="text-sm text-brown/60 mt-0.5">
        Signed in as <span className="font-medium text-ink">{currentEmail}</span>. This is the address you sign in with.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <Field
          label="New email" id="new-email" type="email" autoComplete="email" value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
          error={errors.email} placeholder="you@example.com"
        />
        <Field
          label="Confirm new email" id="confirm-email" type="email" autoComplete="off" value={confirmEmail}
          onChange={(e) => { setConfirmEmail(e.target.value); setErrors((p) => ({ ...p, confirmEmail: undefined })); }}
          error={errors.confirmEmail}
        />

        {saved && (
          <p role="status" className="text-sm text-moss bg-moss/10 border border-moss/30 rounded-lg px-3 py-2">
            Email updated. Use <span className="font-medium">{saved}</span> the next time you sign in.
          </p>
        )}

        <Button type="submit" variant="primary" disabled={saving}>Update email</Button>
      </form>

      <ConfirmDialog
        open={confirming}
        title="Change your sign-in email?"
        confirmLabel="Change email"
        busy={saving}
        error={serverError}
        onConfirm={save}
        onCancel={() => { setConfirming(false); setServerError(null); }}
      >
        You will sign in with <span className="font-medium text-ink">{email.trim()}</span> from now on. No confirmation
        email is sent, so check the address is correct.
      </ConfirmDialog>
    </section>
  );
}
