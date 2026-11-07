'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Tabs from '@/components/ui/Tabs';
import OverviewTab from './OverviewTab';

// Overview is the landing view, so it stays eager; the other tabs load when first opened.
const OrdersTab = dynamic(() => import('./OrdersTab'));
const CrmTab = dynamic(() => import('./CrmTab'));

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'orders', label: 'Orders' },
  { id: 'crm', label: 'CRM' },
];

export default function DashboardClient({ orders, products, initialTab = 'overview' }) {
  const [tab, setTab] = useState(TABS.some((t) => t.id === initialTab) ? initialTab : 'overview');

  function changeTab(id) {
    setTab(id);
    // Keep the tab in the URL so it survives a refresh and can be linked to, without a navigation.
    window.history.replaceState(null, '', id === 'overview' ? '/admin' : `/admin?tab=${id}`);
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div>
        <h2 className="text-xl font-serif font-semibold text-ink">Dashboard</h2>
        <p className="text-sm text-brown/60 mt-0.5">
          Welcome back — here&apos;s how things are going.
        </p>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={changeTab} />

      {tab === 'overview' && <OverviewTab orders={orders} products={products} />}
      {tab === 'orders' && <OrdersTab orders={orders} />}
      {tab === 'crm' && <CrmTab />}
    </div>
  );
}
