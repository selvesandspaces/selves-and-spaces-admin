'use client';

import { useState } from 'react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { formatDate, formatDateTime, cn } from '@/lib/utils';
import { setUserActiveAction } from '@/lib/actions/userActions';

const ROLE_FILTERS = [
  { value: '', label: 'All' },
  { value: 'customer', label: 'Customers' },
  { value: 'super_admin', label: 'Admin' },
];

export default function UsersTable({ users, currentUserId, page, role, hasNext }) {
  const [target, setTarget] = useState(null); // user awaiting confirmation
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const href = (p, r = role) => {
    const params = new URLSearchParams();
    if (r) params.set('role', r);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return `/admin/settings/users${qs ? `?${qs}` : ''}`;
  };

  function close() {
    setTarget(null);
    setError(null);
  }

  async function confirm() {
    setBusy(true);
    setError(null);
    const res = await setUserActiveAction(target.id, target.deactivated); // flip the current state
    setBusy(false);
    if (res.ok) close(); // the action revalidates the page, so the row updates by itself
    else setError(res.error);
  }

  const activating = target?.deactivated;

  return (
    <>
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {ROLE_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={href(1, f.value)}
            aria-current={role === f.value ? 'page' : undefined}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              role === f.value ? 'bg-forest text-cream' : 'bg-tan/20 text-brown hover:bg-tan/40'
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-tan/30 overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-tan/20 bg-cream/40">
              {['User', 'Role', 'Status', 'Signed up', 'Last sign-in', ''].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-sm text-brown/40 py-10">No users found.</td></tr>
            ) : (
              users.map((u) => {
                const isAdmin = u.roles.includes('super_admin');
                const locked = isAdmin || u.id === currentUserId; // the API refuses to deactivate the super admin
                return (
                  <tr key={u.id} className="border-b border-tan/10 last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={u.name || u.email || '?'} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink truncate">{u.name || u.email}</p>
                          {u.name && <p className="text-xs text-brown/50 truncate">{u.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 flex-wrap">{u.roles.map((r) => <Badge key={r} status={r} />)}</div>
                    </td>
                    <td className="px-5 py-3"><Badge status={u.deactivated ? 'deactivated' : 'active'} /></td>
                    <td className="px-5 py-3 text-sm text-brown/60">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-3 text-sm text-brown/60">{u.lastSignInAt ? formatDateTime(u.lastSignInAt) : 'Never'}</td>
                    <td className="px-5 py-3 text-right">
                      {!locked && (
                        <Button size="sm" variant={u.deactivated ? 'outline' : 'ghost'} onClick={() => setTarget(u)}>
                          {u.deactivated ? 'Reactivate' : 'Deactivate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-brown/50">Page {page}</span>
        <div className="flex gap-2">
          {page > 1 && <Link href={href(page - 1)} className="px-3 py-1.5 rounded-lg border border-tan/40 text-brown hover:bg-cream transition-colors">Previous</Link>}
          {hasNext && <Link href={href(page + 1)} className="px-3 py-1.5 rounded-lg border border-tan/40 text-brown hover:bg-cream transition-colors">Next</Link>}
        </div>
      </div>

      <ConfirmDialog
        open={!!target}
        title={`${activating ? 'Reactivate' : 'Deactivate'} ${target?.name || target?.email || 'this user'}?`}
        confirmLabel={activating ? 'Reactivate' : 'Deactivate'}
        danger={!activating}
        busy={busy}
        error={error}
        onConfirm={confirm}
        onCancel={close}
      >
        {activating
          ? 'They will be able to sign in again.'
          : 'They will no longer be able to sign in. Their orders and details are kept, and you can reactivate them at any time.'}
      </ConfirmDialog>
    </>
  );
}
