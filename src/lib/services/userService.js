import { apiGet, apiPatch, apiPost } from '@/lib/api/client';

// API (UserOut): { id, email, roles[], created_at, last_sign_in_at, deactivated, name, phone,
//   address{line1,line2,city,state,postal_code,country} }
function fromApi(u) {
  const a = u.address;
  return {
    id: u.id,
    email: u.email ?? '',
    roles: u.roles ?? [],
    createdAt: u.created_at,
    lastSignInAt: u.last_sign_in_at,
    deactivated: !!u.deactivated,
    name: u.name ?? '',
    phone: u.phone ?? '',
    address: a
      ? {
          line1: a.line1 ?? '',
          line2: a.line2 ?? '',
          city: a.city ?? '',
          state: a.state ?? '',
          postalCode: a.postal_code ?? '',
          country: a.country ?? '',
        }
      : null,
  };
}

export const USERS_PER_PAGE = 25;

// Page-based, and the API doesn't return a total, so a short page means the last page.
export async function getUsers({ page = 1, role } = {}) {
  const params = new URLSearchParams({ page: String(page), per_page: String(USERS_PER_PAGE) });
  if (role) params.set('role', role);
  return (await apiGet(`/users?${params}`)).map(fromApi);
}

export async function getUser(id) {
  return fromApi(await apiGet(`/users/${id}`));
}

export async function setUserActive(id, active) {
  return fromApi(await apiPost(`/users/${id}/${active ? 'activate' : 'deactivate'}`));
}

// PATCH /users/me. The API ignores null fields (so a saved value can't be cleared) and replaces
// `address` as a whole, so callers send only the fields they want to set.
export async function updateProfile(changes) {
  return fromApi(await apiPatch('/users/me', changes));
}
