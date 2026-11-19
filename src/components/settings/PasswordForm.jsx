'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import { changePasswordAction } from '@/lib/actions/accountActions';

const MIN_PASSWORD = 8; // matches the API

export default function PasswordForm() {
  const router = useRouter();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [done, setDone] = useState(false);

  const type = show ? 'text' : 'password';
  const clear = (field) => setErrors((p) => ({ ...p, [field]: undefined }));

  async function handleSubmit(e) {
    e.preventDefault();
    setDone(false);
    setServerError(null);

    const found = {};
    if (!current) found.current = 'Enter your current password.';
    if (next.length < MIN_PASSWORD) found.next = `Use at least ${MIN_PASSWORD} characters.`;
    else if (next === current) found.next = 'The new password must differ from the current one.';
    if (confirm !== next) found.confirm = 'The passwords do not match.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    const res = await changePasswordAction(current, next);
    setSaving(false);

    if (!res.ok) {
      if (res.field) setErrors({ [res.field]: res.error });
      else setServerError(res.error);
      return;
    }
    setCurrent('');
    setNext('');
    setConfirm('');
    if (res.reauth) {
      router.push('/auth/signout?reason=reauth');
      return;
    }
    setDone(true);
  }

  return (
    <section className="bg-white rounded-xl border border-tan/30 p-6">
      <h3 className="text-base font-serif font-semibold text-ink">Password</h3>
      <p className="text-sm text-brown/60 mt-0.5">Use at least {MIN_PASSWORD} characters.</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <Field label="Current password" id="current-password" type={type} autoComplete="current-password"
          value={current} onChange={(e) => { setCurrent(e.target.value); clear('current'); }} error={errors.current} />
        <Field label="New password" id="new-password" type={type} autoComplete="new-password"
          value={next} onChange={(e) => { setNext(e.target.value); clear('next'); }} error={errors.next} />
        <Field label="Confirm new password" id="confirm-password" type={type} autoComplete="new-password"
          value={confirm} onChange={(e) => { setConfirm(e.target.value); clear('confirm'); }} error={errors.confirm} />

        <label className="flex items-center gap-2 text-sm text-brown/70 cursor-pointer w-fit">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="accent-forest" />
          Show passwords
        </label>

        {serverError && (
          <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{serverError}</p>
        )}
        {done && (
          <p role="status" className="text-sm text-moss bg-moss/10 border border-moss/30 rounded-lg px-3 py-2">
            Password changed. Use the new one the next time you sign in.
          </p>
        )}

        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </section>
  );
}
