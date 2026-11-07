import { cn } from '@/lib/utils';

const statusMap = {
  active: 'bg-moss/15 text-moss border border-moss/30',
  inactive: 'bg-tan/30 text-brown border border-tan',
  completed: 'bg-sage/20 text-forest border border-sage/40',
  pending: 'bg-lavender-soft/60 text-lavender border border-lavender/30',
  processing: 'bg-blush border border-tan text-brown',
  cancelled: 'bg-red-100 text-red-600 border border-red-200',
  order_placed: 'bg-lavender-soft/60 text-lavender border border-lavender/30',
  in_transit: 'bg-blush border border-tan text-brown',
  delivered: 'bg-sage/20 text-forest border border-sage/40',
  'in-stock': 'bg-moss/15 text-moss border border-moss/30',
  'low-stock': 'bg-tan/40 text-brown border border-tan',
  'out-of-stock': 'bg-red-100 text-red-600 border border-red-200',
};

const labelMap = {
  active: 'Active',
  inactive: 'Inactive',
  completed: 'Completed',
  pending: 'Pending',
  processing: 'Processing',
  cancelled: 'Cancelled',
  order_placed: 'Order placed',
  in_transit: 'In transit',
  delivered: 'Delivered',
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
};

export default function Badge({ status, className }) {
  const colorClass = statusMap[status] ?? 'bg-tan/30 text-brown border border-tan';
  const label = labelMap[status] ?? status;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );
}
