import { getClients, toClientSummary } from '@/lib/services/clientService';
import ClientListPanel from '@/components/clients/ClientListPanel';

// The list lives here so it renders once: search, filter and scroll survive picking a client.
export default async function ClientsLayout({ children }) {
  const clients = (await getClients()).map(toClientSummary);

  return (
    <div className="flex h-full">
      <ClientListPanel clients={clients} />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  );
}
