import { notFound } from 'next/navigation';
import { getOrder } from '@/lib/services/orderService';
import OrderDetail from '@/components/orders/OrderDetail';

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  // key: OrderDetail keeps the order in local state, so a new id must start fresh.
  return <OrderDetail key={order.id} order={order} />;
}
