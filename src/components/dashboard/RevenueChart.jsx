'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { addMoney } from '@/lib/utils';

// Revenue per calendar month for the last 12 months, from paid orders.
function monthlyRevenue(orders) {
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      revenue: 0,
    };
  });
  const byKey = Object.fromEntries(months.map((m) => [m.key, m]));
  orders.forEach((o) => {
    const d = new Date(o.paidAt);
    const m = byKey[`${d.getFullYear()}-${d.getMonth()}`];
    if (m) m.revenue = addMoney(m.revenue, o.total);
  });
  return months;
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-tan/30 rounded-lg shadow-lg px-3 py-2">
        <p className="text-xs text-brown/60">{label}</p>
        <p className="text-sm font-semibold text-forest">
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
}

export default function RevenueChart({ orders }) {
  const data = monthlyRevenue(orders);
  return (
    <div className="bg-white rounded-xl p-5 border border-tan/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Revenue</h3>
          <p className="text-xs text-brown/50">Last 12 months</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2B4A3A" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2B4A3A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#8B6B47', opacity: 0.6 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#8B6B47', opacity: 0.6 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#C4A882', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#4A7C59"
            strokeWidth={2}
            fill="url(#forestGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#2B4A3A', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
