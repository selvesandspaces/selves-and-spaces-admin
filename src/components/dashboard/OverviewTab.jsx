'use client';

import { motion } from 'framer-motion';
import { Users, ShoppingBag, TrendingUp, Package } from 'lucide-react';
import StatCard from './StatCard';
import { RevenueChart, OrderStatusChart } from './lazyCharts';
import RecentOrdersTable from './RecentOrdersTable';
import { formatCurrency, addMoney } from '@/lib/utils';

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function OverviewTab({ orders, products }) {
  const totalRevenue = orders.reduce((sum, o) => addMoney(sum, o.total), 0);
  const toShip = orders.filter((o) => o.deliveryStatus === 'order_placed').length;
  const inTransit = orders.filter((o) => o.deliveryStatus === 'in_transit').length;

  // Distinct buyers across all orders (not the same as the clients list shown under CRM).
  const customerCount = new Set(
    orders.map((o) => (o.customer.email || o.customer.phone || o.customer.name).toLowerCase())
  ).size;

  const stats = [
    {
      title: 'Orders',
      value: orders.length.toString(),
      delta: { label: `${toShip} to ship · ${inTransit} in transit`, positive: toShip === 0 },
      icon: ShoppingBag,
      accentColor: 'text-moss',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      delta: { label: 'from paid orders', positive: true },
      icon: TrendingUp,
      accentColor: 'text-brown',
    },
    {
      title: 'Customers',
      value: customerCount.toString(),
      delta: { label: 'who have ordered', positive: true },
      icon: Users,
      accentColor: 'text-forest',
    },
    {
      title: 'Products',
      value: products.length.toString(),
      delta: { label: 'in catalogue', positive: true },
      icon: Package,
      accentColor: 'text-lavender',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={staggerItem}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <div className="lg:col-span-2">
          <RevenueChart orders={orders} />
        </div>
        <div>
          <OrderStatusChart orders={orders} />
        </div>
      </motion.div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.35 }}
      >
        <RecentOrdersTable orders={orders} />
      </motion.div>
    </div>
  );
}
