import Link from 'next/link';
import { Users, UserCheck, UserX, UserPlus } from 'lucide-react';
import StatCard from './StatCard';
import Panel from './Panel';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function CrmTab({ stats }) {
  if (!stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
        Couldn&apos;t load client data. Refresh the page to try again.
      </div>
    );
  }

  const cards = [
    { title: 'Total Clients', value: stats.total.toString(), delta: { label: 'on record', positive: true }, icon: Users, accentColor: 'text-forest' },
    { title: 'Active', value: stats.active.toString(), delta: { label: `${stats.inactive} inactive`, positive: true }, icon: UserCheck, accentColor: 'text-moss' },
    { title: 'Inactive', value: stats.inactive.toString(), delta: { label: 'not currently active', positive: stats.inactive === 0 }, icon: UserX, accentColor: 'text-brown' },
    { title: 'New This Month', value: stats.newThisMonth.toString(), delta: { label: 'added since the 1st', positive: true }, icon: UserPlus, accentColor: 'text-lavender' },
  ];

  const maxCount = Math.max(1, ...stats.therapists.map((t) => t.count));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => <StatCard key={c.title} {...c} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Clients per therapist" empty="No clients yet.">
          {stats.therapists.map((t) => (
            <div key={t.name} className="px-5 py-3 border-b border-tan/10 last:border-0">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink truncate">{t.name}</span>
                <span className="text-brown/60 shrink-0 ml-3">{t.count}</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-tan/20" aria-hidden="true">
                <div className="h-full rounded-full bg-sage" style={{ width: `${(t.count / maxCount) * 100}%` }} />
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="Recently added" href="/admin/clients" empty="No clients yet.">
          {stats.recent.map((c) => (
            <Link key={c.id} href={`/admin/clients/${c.id}`}
              className="flex items-center gap-3 px-5 py-3 border-b border-tan/10 last:border-0 hover:bg-cream/50 transition-colors">
              <Avatar name={c.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink truncate">{c.name}</p>
                <p className="text-xs text-brown/50">Added {formatDate(c.createdAt)}</p>
              </div>
              <Badge status={c.status} />
            </Link>
          ))}
        </Panel>
      </div>
    </div>
  );
}
