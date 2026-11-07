import { getOrders } from '@/lib/services/orderService';
import { getProducts } from '@/lib/services/productService';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function DashboardPage({ searchParams }) {
  const { tab } = await searchParams;
  const [orders, products] = await Promise.all([
    getOrders(),
    getProducts(),
  ]);

  return (
    <DashboardClient
      orders={orders}
      products={products}
      initialTab={tab}
    />
  );
}
