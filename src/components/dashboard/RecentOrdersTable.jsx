import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { formatCurrency, formatDate, shortId } from '@/lib/utils';

export default function RecentOrdersTable({ orders }) {
  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-tan/30 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-tan/20">
        <h3 className="text-sm font-semibold text-ink">Recent Orders</h3>
        <Link
          href="/admin/orders"
          className="text-xs text-moss hover:text-forest font-medium transition-colors"
        >
          View all →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-tan/20">
              <th className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Order</th>
              <th className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Customer</th>
              <th className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Date</th>
              <th className="text-right text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Total</th>
              <th className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-sm text-brown/40 py-8">No orders yet.</td>
              </tr>
            )}
            {recent.map((order) => (
              <tr
                key={order.id}
                className="border-b border-tan/10 hover:bg-cream/50 transition-colors"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs font-mono text-moss hover:text-forest font-medium"
                  >
                    #{shortId(order.id)}
                  </Link>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={order.customer.name || '?'} size="sm" />
                    <span className="text-sm text-ink">{order.customer.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-brown/60">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-5 py-3 text-sm font-semibold text-ink text-right">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-5 py-3">
                  <Badge status={order.deliveryStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
