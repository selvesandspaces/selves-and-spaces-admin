'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import { updateProfileAction } from '@/lib/actions/userActions';

// Same pattern the API enforces on UserUpdate.phone.
const PHONE_RE = /^\+?[0-9][0-9 \-]{5,18}[0-9]$/;
const EMPTY_ADDRESS = { line1: '', line2: '', city: '', state: '', postalCode: '', country: '' };
const ADDRESS_REQUIRED = [
  ['line1', 'Address line 1'],
  ['city', 'City'],
  ['postalCode', 'Postal code'],
  ['country', 'Country'],
];

const toForm = (p) => ({ name: p.name, phone: p.phone, ...(p.address ?? EMPTY_ADDRESS) });
const hasAddress = (f) => Object.keys(EMPTY_ADDRESS).some((k) => f[k].trim());

export default function ProfileForm({ profile }) {
  const router = useRouter();
  const [base, setBase] = useState(() => toForm(profile)); // what the server has, to send only changes
  const [form, setForm] = useState(() => toForm(profile));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [saved, setSaved] = useState(false);

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
    setSaved(false);
  };

  function validate() {
    const e = {};
    const name = form.name.trim();
    const phone = form.phone.trim();

    // The API ignores empty values, so a saved value can be changed but not removed.
    if (!name) { if (base.name) e.name = 'Your name can be changed but not removed.'; }
    else if (name.length > 200) e.name = 'Use 200 characters or fewer.';

    if (!phone) { if (base.phone) e.phone = 'Your phone number can be changed but not removed.'; }
    else if (!PHONE_RE.test(phone)) e.phone = 'Enter a valid phone number, e.g. +91 98765 43210.';

    if (hasAddress(form)) {
      for (const [key, label] of ADDRESS_REQUIRED) if (!form[key].trim()) e[key] = `${label} is required.`;
      if (form.state.trim().length > 100) e.state = 'Use 100 characters or fewer.';
      if (form.line2.trim().length > 200) e.line2 = 'Use 200 characters or fewer.';
    } else if (Object.keys(EMPTY_ADDRESS).some((k) => base[k])) {
      e.line1 = 'Your address can be changed but not removed.';
    }
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError(null);
    setSaved(false);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const changes = {};
    if (form.name.trim() && form.name.trim() !== base.name) changes.name = form.name.trim();
    if (form.phone.trim() && form.phone.trim() !== base.phone) changes.phone = form.phone.trim();
    if (hasAddress(form) && Object.keys(EMPTY_ADDRESS).some((k) => form[k].trim() !== base[k])) {
      changes.address = {
        line1: form.line1.trim(),
        line2: form.line2.trim() || null,
        city: form.city.trim(),
        state: form.state.trim() || null,
        postal_code: form.postalCode.trim(),
        country: form.country.trim(),
      };
    }
    if (Object.keys(changes).length === 0) {
      setServerError('Nothing has changed.');
      return;
    }

    setSaving(true);
    const res = await updateProfileAction(changes);
    setSaving(false);
    if (!res.ok) {
      setServerError(res.error);
      return;
    }
    setBase(form);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <section className="bg-white rounded-xl border border-tan/30 p-6 space-y-4">
        <h3 className="text-base font-serif font-semibold text-ink">Personal details</h3>
        <Field label="Name" id="name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
        <Field label="Phone" id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')}
          error={errors.phone} placeholder="+91 98765 43210" />
      </section>

      <section className="bg-white rounded-xl border border-tan/30 p-6 space-y-4">
        <div>
          <h3 className="text-base font-serif font-semibold text-ink">Address</h3>
          <p className="text-xs text-brown/50 mt-0.5">Leave blank to skip. If you add one, line 1, city, postal code and country are required.</p>
        </div>
        <Field label="Address line 1" id="line1" autoComplete="address-line1" value={form.line1} onChange={set('line1')} error={errors.line1} />
        <Field label="Address line 2" id="line2" autoComplete="address-line2" value={form.line2} onChange={set('line2')} error={errors.line2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="City" id="city" autoComplete="address-level2" value={form.city} onChange={set('city')} error={errors.city} />
          <Field label="State" id="state" autoComplete="address-level1" value={form.state} onChange={set('state')} error={errors.state} />
          <Field label="Postal code" id="postalCode" autoComplete="postal-code" value={form.postalCode} onChange={set('postalCode')} error={errors.postalCode} />
          <Field label="Country" id="country" autoComplete="country-name" value={form.country} onChange={set('country')} error={errors.country} />
        </div>
      </section>

      {serverError && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{serverError}</p>
      )}
      {saved && (
        <p role="status" className="text-sm text-moss bg-moss/10 border border-moss/30 rounded-lg px-3 py-2">Profile saved.</p>
      )}

      <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</Button>
    </form>
  );
}
