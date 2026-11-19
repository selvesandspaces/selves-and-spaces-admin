import { cache } from 'react';
import { apiGet, apiGetAll, apiPost } from '@/lib/api/client';

// Delivery moves forward one step at a time; the API rejects anything else (409).
export const DELIVERY_STATUSES = ['order_placed', 'in_transit', 'delivered'];
export const NEXT_DELIVERY_STATUS = { order_placed: 'in_transit', in_transit: 'delivered' };

// API: { id, customer{name,email,phone}, shipping_address{line1,line2,city,state,postal_code,country},
//        items[{id,product_id,product_title,unit_price,quantity,line_total}], total_amount, paid_at,
//        razorpay_order_id, razorpay_payment_id, delivery_status, in_transit_at, delivered_at,
//        created_at, updated_at }
// Orders only exist once paid, so there is no pending/cancelled state.
function fromApi(o) {
  const a = o.shipping_address ?? {};
  return {
    id: o.id,
    customer: {
      name: o.customer?.name ?? '',
      email: o.customer?.email ?? '',
      phone: o.customer?.phone ?? '',
    },
    shippingAddress: {
      line1: a.line1 ?? '',
      line2: a.line2 ?? '',
      city: a.city ?? '',
      state: a.state ?? '',
      postalCode: a.postal_code ?? '',
      country: a.country ?? '',
    },
    items: (o.items ?? []).map((i) => ({
      id: i.id,
      productId: i.product_id, // null once the product has been removed
      productTitle: i.product_title,
      unitPrice: Number(i.unit_price),
      quantity: i.quantity,
      lineTotal: Number(i.line_total),
    })),
    total: Number(o.total_amount),
    paidAt: o.paid_at,
    razorpayOrderId: o.razorpay_order_id,
    razorpayPaymentId: o.razorpay_payment_id,
    deliveryStatus: o.delivery_status,
    inTransitAt: o.in_transit_at,
    deliveredAt: o.delivered_at,
    createdAt: o.created_at,
  };
}

// De-duped within a request, so a layout and a page asking for the list share one fetch.
export const getOrders = cache(async () => {
  const raw = await apiGetAll('/admin/orders');
  return raw.map(fromApi);
});

// The few fields the list needs, so addresses and payment ids stay out of the client payload.
export function toOrderSummary(o) {
  return {
    id: o.id,
    customer: { name: o.customer.name, email: o.customer.email, phone: o.customer.phone },
    total: o.total,
    deliveryStatus: o.deliveryStatus,
    createdAt: o.createdAt,
  };
}

export async function getOrder(id) {
  try {
    return fromApi(await apiGet(`/admin/orders/${id}`));
  } catch (err) {
    if (/not found/i.test(err.message)) return null;
    throw err;
  }
}

export async function updateDeliveryStatus(id, status) {
  return fromApi(await apiPost(`/admin/orders/${id}/delivery-status`, { status }));
}
