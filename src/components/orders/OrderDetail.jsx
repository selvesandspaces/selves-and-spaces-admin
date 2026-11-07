'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Package, MapPin, CreditCard, Truck, Check, Mail, Phone } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDateTime, shortId, cn } from '@/lib/utils';
import { updateDeliveryStatusAction } from '@/lib/actions/orderActions';

const NEXT_ACTION = {
  order_placed: { status: 'in_transit', label: 'Mark as in transit' },
  in_transit: { status: 'delivered', label: 'Mark as delivered' },
};

export default function OrderDetail({ order: initialOrder }) {
  // Local copy so the timeline updates immediately after a status change.
  const [order, setOrder] = useState(initialOrder);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const next = NEXT_ACTION[order.deliveryStatus];

  async function advance() {
    if (!window.confirm(`${next.label}? Delivery can only move forward and this cannot be undone.`)) return;
    setSaving(true);
    setError(null);
    const res = await updateDeliveryStatusAction(order.id, next.status);
    if (res.ok) setOrder(res.data);
    else setError(res.error);
    setSaving(false);
  }

  const a = order.shippingAddress;
  const cityLine = [a.city, a.state, a.postalCode].filter(Boolean).join(', ');

  const steps = [
    { label: 'Order placed', at: order.paidAt, done: true },
    { label: 'In transit', at: order.inTransitAt, done: !!order.inTransitAt },
    { label: 'Delivered', at: order.deliveredAt, done: !!order.deliveredAt },
  ];

  return (
    <motion.div
      key={order.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex-1 overflow-y-auto"
    >
      {/* Header */}
      <div className="px-8 pt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-mono text-xl font-semibold text-ink">#{shortId(order.id)}</h2>
              <Badge status={order.deliveryStatus} />
            </div>
            <p className="text-sm text-brown/60 mt-1">Placed {formatDateTime(order.createdAt)}</p>
            <p className="text-[11px] font-mono text-brown/40 mt-0.5">{order.id}</p>
          </div>
          <p className="text-3xl font-serif font-semibold text-forest">{formatCurrency(order.total)}</p>
        </div>
      </div>

      <div className="px-8 py-6 space-y-5">
        {/* Delivery */}
        <Card icon={Truck} title="Delivery">
          <ol className="flex items-start">
            {steps.map((s, i) => (
              <li key={s.label} className="flex-1 flex flex-col items-center text-center relative">
                {i > 0 && (
                  <span className={cn('absolute top-3 right-1/2 w-full h-0.5', s.done ? 'bg-moss' : 'bg-tan/30')} />
                )}
                <span className={cn(
                  'relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs',
                  s.done ? 'bg-moss text-white' : 'bg-tan/30 text-brown/40'
                )}>
                  {s.done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </span>
                <p className={cn('text-xs font-medium mt-2', s.done ? 'text-ink' : 'text-brown/40')}>{s.label}</p>
                <p className="text-[11px] text-brown/50 mt-0.5 min-h-4">{s.at ? formatDateTime(s.at) : ''}</p>
              </li>
            ))}
          </ol>
          {next && (
            <div className="mt-4 pt-4 border-t border-tan/20 flex items-center gap-3">
              <Button variant="primary" onClick={advance} disabled={saving}>
                {saving ? 'Updating…' : next.label}
              </Button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          )}
        </Card>

        {/* Items */}
        <div className="bg-white rounded-xl border border-tan/30 overflow-hidden">
          <div className="px-5 py-3 border-b border-tan/20 flex items-center gap-2">
            <Package className="w-4 h-4 text-brown/50" />
            <h3 className="text-xs font-semibold text-brown/60 uppercase tracking-wider">Items</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-tan/10">
                <th className="text-left text-xs font-medium text-brown/40 px-5 py-2.5">Product</th>
                <th className="text-center text-xs font-medium text-brown/40 px-3 py-2.5">Qty</th>
                <th className="text-right text-xs font-medium text-brown/40 px-5 py-2.5">Unit Price</th>
                <th className="text-right text-xs font-medium text-brown/40 px-5 py-2.5">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-tan/10 last:border-0">
                  <td className="px-5 py-3 text-sm text-ink">
                    {item.productTitle}
                    {!item.productId && <span className="ml-2 text-xs text-brown/40">(product removed)</span>}
                  </td>
                  <td className="px-3 py-3 text-sm text-ink text-center">{item.quantity}</td>
                  <td className="px-5 py-3 text-sm text-ink text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-5 py-3 text-sm font-medium text-ink text-right">{formatCurrency(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-tan/20 px-5 py-3 flex justify-between text-sm font-semibold text-ink">
            <span>Total paid</span>
            <span className="text-forest">{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Customer */}
          <Card icon={User} title="Customer">
            <p className="text-sm font-medium text-ink">{order.customer.name}</p>
            <div className="mt-2 space-y-1.5 text-sm text-brown/70">
              {order.customer.email && (
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-brown/40" />{order.customer.email}</p>
              )}
              {order.customer.phone && (
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-brown/40" />{order.customer.phone}</p>
              )}
            </div>
          </Card>

          {/* Shipping */}
          <Card icon={MapPin} title="Shipping address">
            <address className="not-italic text-sm text-ink leading-relaxed">
              {a.line1}<br />
              {a.line2 && <>{a.line2}<br /></>}
              {cityLine}<br />
              {a.country}
            </address>
          </Card>
        </div>

        {/* Payment */}
        <Card icon={CreditCard} title="Payment">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
            <dt className="text-brown/50">Paid</dt>
            <dd className="text-ink">{formatDateTime(order.paidAt)}</dd>
            <dt className="text-brown/50">Razorpay order</dt>
            <dd className="font-mono text-xs text-ink self-center">{order.razorpayOrderId}</dd>
            <dt className="text-brown/50">Razorpay payment</dt>
            <dd className="font-mono text-xs text-ink self-center">{order.razorpayPaymentId}</dd>
          </dl>
        </Card>
      </div>
    </motion.div>
  );
}

function Card({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-xl border border-tan/30 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-brown/50" />
        <h3 className="text-xs font-semibold text-brown/60 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}
