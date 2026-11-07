import { getOrders, toOrderSummary } from '@/lib/services/orderService';
import OrderListPanel from '@/components/orders/OrderListPanel';

// The list lives here so it renders once: search, filter and scroll survive picking an order.
export default async function OrdersLayout({ children }) {
  const orders = (await getOrders()).map(toOrderSummary);

  return (
    <div className="flex h-full">
      <OrderListPanel orders={orders} />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  );
}
