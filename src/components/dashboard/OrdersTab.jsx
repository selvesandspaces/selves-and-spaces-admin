'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Truck, PackageCheck, IndianRupee, Package } from 'lucide-react';
import StatCard from './StatCard';
import { RevenueChart, OrderStatusChart } from './lazyCharts';
import { formatCurrency, formatDate, shortId, timeAgo, addMoney } from '@/lib/utils';

const DAY_MS = 86_400_000;

function byOldest(a, b) {
  return new Date(a.createdAt) - new Date(b.createdAt);
}

function topProducts(orders, limit = 5) {
  const map = new Map();
  orders.forEach((o) =>
    o.items.forEach((i) => {
      const row = map.get(i.productTitle) ?? { title: i.productTitle, units: 0, revenue: 0 };
      row.units += i.quantity;
      row.revenue = addMoney(row.revenue, i.lineTotal);
      map.set(i.productTitle, row);
    })
  );
  return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, limit);
}

export default function OrdersTab({ orders }) {
  const placed = orders.filter((o) => o.deliveryStatus === 'order_placed').sort(byOldest);
  const inTransit = orders.filter((o) => o.deliveryStatus === 'in_transit').sort(byOldest);
  const delivered = orders.filter((o) => o.deliveryStatus === 'delivered');

  const revenue = orders.reduce((sum, o) => addMoney(sum, o.total), 0);
  const avgOrder = orders.length ? revenue / orders.length : 0;

  const deliveryDays = delivered
    .filter((o) => o.deliveredAt)
    .map((o) => (new Date(o.deliveredAt) - new Date(o.paidAt)) / DAY_MS);
  const avgDeliveryDays = deliveryDays.length
    ? deliveryDays.reduce((a, b) => a + b, 0) / deliveryDays.length
    : null;

  const stats = [
    {
      title: 'To Ship',
      value: placed.length.toString(),
      delta: {
        label: placed.length ? `oldest placed ${timeAgo(placed[0].createdAt)}` : 'nothing waiting',
        positive: placed.length === 0,
      },
      icon: Clock,
      accentColor: 'text-lavender',
    },
    {
      title: 'In Transit',
      value: inTransit.length.toString(),
      delta: { label: 'on the way to customers', positive: true },
      icon: Truck,
      accentColor: 'text-brown',
    },
    {
      title: 'Delivered',
      value: delivered.length.toString(),
      delta: {
        label: avgDeliveryDays !== null ? `avg ${avgDeliveryDays.toFixed(1)} days to deliver` : 'no deliveries yet',
        positive: true,
      },
      icon: PackageCheck,
      accentColor: 'text-moss',
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(avgOrder),
      delta: { label: `across ${orders.length} order${orders.length !== 1 ? 's' : ''}`, positive: true },
      icon: IndianRupee,
      accentColor: 'text-forest',
    },
  ];

  const products = topProducts(orders);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <div className="lg:col-span-2"><RevenueChart orders={orders} /></div>
        <OrderStatusChart orders={orders} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Waiting to ship" href="/admin/orders" empty="No orders waiting to ship.">
          {placed.slice(0, 6).map((o) => (
            <Link key={o.id} href={`/admin/orders/${o.id}`}
              className="flex items-center justify-between gap-3 px-5 py-3 border-b border-tan/10 last:border-0 hover:bg-cream/50 transition-colors">
              <div className="min-w-0">
                <p className="text-sm text-ink truncate">{o.customer.name}</p>
                <p className="text-xs text-brown/50">
                  <span className="font-mono text-moss">#{shortId(o.id)}</span> · {formatDate(o.createdAt)}
                </p>
              </div>
              <span className="text-sm font-semibold text-ink shrink-0">{formatCurrency(o.total)}</span>
            </Link>
          ))}
        </Panel>

        <Panel title="Top products" empty="No sales yet." icon={Package}>
          {products.map((p) => (
            <div key={p.title}
              className="flex items-center justify-between gap-3 px-5 py-3 border-b border-tan/10 last:border-0">
              <div className="min-w-0">
                <p className="text-sm text-ink truncate">{p.title}</p>
                <p className="text-xs text-brown/50">{p.units} unit{p.units !== 1 ? 's' : ''} sold</p>
              </div>
              <span className="text-sm font-semibold text-forest shrink-0">{formatCurrency(p.revenue)}</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, href, empty, children }) {
  const hasRows = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <div className="bg-white rounded-xl border border-tan/30 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-tan/20">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {href && (
          <Link href={href} className="text-xs text-moss hover:text-forest font-medium transition-colors">
            View all →
          </Link>
        )}
      </div>
      {hasRows ? children : <p className="text-center text-sm text-brown/40 py-8">{empty}</p>}
    </div>
  );
}
