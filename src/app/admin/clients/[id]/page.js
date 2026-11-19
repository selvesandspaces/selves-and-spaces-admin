import { notFound } from 'next/navigation';
import { getClient } from '@/lib/services/clientService';
import ClientDetail from '@/components/clients/ClientDetail';

export default async function ClientDetailPage({ params }) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  return <ClientDetail key={client.id} client={client} />;
}
