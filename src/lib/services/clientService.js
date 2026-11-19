import { cache } from 'react';
import { apiGet, apiGetAll } from '@/lib/api/client';

// API (ClientOut): { id, name, email, phone, date_of_birth, address, therapist_name, session_notes,
//   emergency_contact_name, emergency_contact_phone, status: 'active'|'inactive', created_at, updated_at }
// Read-only: the admin API only lists and fetches clients.
function fromApi(c) {
  return {
    id: c.id,
    name: c.name,
    email: c.email ?? '',
    phone: c.phone ?? '',
    dateOfBirth: c.date_of_birth ?? '',
    address: c.address ?? '',
    therapistName: c.therapist_name ?? '',
    sessionNotes: c.session_notes ?? '',
    emergencyContactName: c.emergency_contact_name ?? '',
    emergencyContactPhone: c.emergency_contact_phone ?? '',
    status: c.status,
    createdAt: c.created_at,
  };
}

// Session notes and emergency contacts are sensitive, so the list only gets what it displays.
// The full record is fetched per client, which the backend also audit-logs.
export function toClientSummary(c) {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    status: c.status,
    createdAt: c.createdAt,
  };
}

// De-duped within a request, so a layout and the dashboard share one fetch.
export const getClients = cache(async () => {
  const raw = await apiGetAll('/admin/clients');
  return raw.map(fromApi);
});

export async function getClient(id) {
  try {
    return fromApi(await apiGet(`/admin/clients/${id}`));
  } catch (err) {
    if (/not found/i.test(err.message)) return null;
    throw err;
  }
}

// Aggregates for the dashboard's CRM tab, computed here so only numbers reach the browser.
export async function getCrmStats() {
  const clients = await getClients();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const perTherapist = new Map();
  for (const c of clients) {
    const name = c.therapistName || 'Unassigned';
    perTherapist.set(name, (perTherapist.get(name) ?? 0) + 1);
  }

  const active = clients.filter((c) => c.status === 'active').length;

  return {
    total: clients.length,
    active,
    inactive: clients.length - active,
    newThisMonth: clients.filter((c) => new Date(c.createdAt) >= monthStart).length,
    therapists: [...perTherapist.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    recent: [...clients]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(toClientSummary),
  };
}
