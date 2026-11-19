'use client';

import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function ClientRow({ client, isActive }) {
  return (
    <Link
      href={`/admin/clients/${client.id}`}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 px-4 py-3.5 border-b border-tan/20 transition-colors duration-100',
        isActive
          ? 'bg-blush/60 border-l-2 border-l-forest'
          : 'hover:bg-cream/80 border-l-2 border-l-transparent'
      )}
    >
      <Avatar name={client.name} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{client.name}</p>
        <p className="text-xs text-brown/60 truncate">{client.email || client.phone || 'No contact details'}</p>
      </div>
      <Badge status={client.status} />
    </Link>
  );
}
