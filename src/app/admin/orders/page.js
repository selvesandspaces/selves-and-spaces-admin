import { ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="flex-1 hidden lg:flex flex-col items-center justify-center gap-3 text-brown/30">
      <ShoppingBag className="w-14 h-14" />
      <p className="text-sm">Select an order to view details</p>
    </div>
  );
}
