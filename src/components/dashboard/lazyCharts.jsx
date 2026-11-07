'use client';

import dynamic from 'next/dynamic';

// Recharts is the heaviest dependency on the dashboard. Loading the charts on demand keeps it out of
// the initial bundle, and the stat cards and tables render without waiting for it. The charts measure
// their container in the browser anyway, so there is nothing to server-render.
// The skeleton matches the card's height (header + 200px plot) so nothing shifts when it loads.
function ChartSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="bg-white rounded-xl p-5 border border-tan/30 min-h-[292px] animate-pulse"
    >
      <div className="h-4 w-28 bg-tan/30 rounded mb-2" />
      <div className="h-3 w-20 bg-tan/20 rounded mb-6" />
      <div className="h-[200px] bg-tan/15 rounded-lg" />
    </div>
  );
}

export const RevenueChart = dynamic(() => import('./RevenueChart'), {
  ssr: false,
  loading: ChartSkeleton,
});

export const OrderStatusChart = dynamic(() => import('./OrderStatusChart'), {
  ssr: false,
  loading: ChartSkeleton,
});
