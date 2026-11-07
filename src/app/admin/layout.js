import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { getSessionState } from '@/lib/session';
import AdminShell from '@/components/layout/AdminShell';

export default async function AdminLayout({ children }) {
  const session = await getSessionState();

  if (session.state === 'anon') redirect('/auth/signout?reason=expired');
  if (session.state === 'forbidden') redirect('/auth/signout?reason=forbidden');

  // The API can't confirm the role right now. Redirecting to /login would loop (the proxy sends a
  // signed-in admin straight back), so show a retry screen instead.
  if (session.state === 'unreachable') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-lg font-serif font-semibold text-ink mb-2">Can&apos;t reach the server</h1>
          <p className="text-sm text-brown/60 mb-6 leading-relaxed">
            The admin API isn&apos;t responding. Check that it&apos;s running, then try again.
          </p>
          <a
            href="/admin"
            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-forest text-cream rounded-lg hover:bg-moss transition-colors"
          >
            Try again
          </a>
        </div>
      </div>
    );
  }

  const collapsed = (await cookies()).get('ss-sidebar-collapsed')?.value === 'true';

  return (
    <AdminShell user={session.user} initialCollapsed={collapsed}>
      {children}
    </AdminShell>
  );
}
