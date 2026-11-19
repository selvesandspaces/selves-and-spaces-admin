import { Users } from 'lucide-react';

export default function ClientsPage() {
  return (
    <div className="flex-1 hidden lg:flex flex-col items-center justify-center gap-3 text-brown/30">
      <Users className="w-14 h-14" />
      <p className="text-sm">Select a client to view details</p>
    </div>
  );
}
