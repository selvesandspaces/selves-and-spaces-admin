import { getOrders } from '@/lib/services/orderService';
import { getProducts } from '@/lib/services/productService';
import { getCrmStats } from '@/lib/services/clientService';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function DashboardPage({ searchParams }) {
  const { tab } = await searchParams;
  const [orders, products, crm] = await Promise.all([
    getOrders(),
    getProducts(),
    // A clients outage shouldn't take the whole dashboard down; the CRM tab shows its own message.
    getCrmStats().catch(() => null),
  ]);

  return (
    <DashboardClient
      orders={orders}
      products={products}
      crm={crm}
      initialTab={tab}
    />
  );
}
