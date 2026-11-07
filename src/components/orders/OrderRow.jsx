'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate, shortId, cn } from '@/lib/utils';

export default function OrderRow({ order, isActive }) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
      onClick={() => router.push(`/admin/orders/${order.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/admin/orders/${order.id}`); }}
      className={cn(
        'flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-tan/20 transition-colors duration-100',
        isActive
          ? 'bg-blush/60 border-l-2 border-l-forest'
          : 'hover:bg-cream/80 border-l-2 border-l-transparent'
      )}
    >
      <Avatar name={order.customer.name || '?'} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-moss font-medium">#{shortId(order.id)}</p>
        <p className="text-sm text-ink truncate">{order.customer.name}</p>
        <p className="text-xs text-brown/50">{formatDate(order.createdAt)}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-semibold text-ink">{formatCurrency(order.total)}</span>
        <Badge status={order.deliveryStatus} />
      </div>
    </motion.div>
  );
}
