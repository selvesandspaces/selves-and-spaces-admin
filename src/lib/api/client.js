import { createClient } from '@/lib/supabase/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// FastAPI validation errors arrive as { detail: [{ loc, msg }] }; other errors as { detail: "..." }.
function describeError(status, text) {
  try {
    const { detail } = JSON.parse(text);
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((d) => `${(d.loc ?? []).filter((l) => l !== 'body').join('.')}: ${d.msg}`)
        .join('; ');
    }
  } catch {}
  return text || `Request failed (${status})`;
}

async function authHeaders() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, { body, formData } = {}) {
  const headers = await authHeaders();
  const options = { method, headers, cache: 'no-store', signal: AbortSignal.timeout(20000) };

  if (formData) {
    options.body = formData; // fetch sets the multipart boundary itself
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, options);
  } catch (err) {
    throw new Error(
      err?.name === 'TimeoutError'
        ? 'The server took too long to respond. Please try again.'
        : 'Could not reach the server. Make sure the API is running.'
    );
  }

  if (res.status === 204) return null;

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(describeError(res.status, text));
  }

  return res.json();
}

export const apiGet = (path) => request('GET', path);
export const apiPost = (path, body) => request('POST', path, { body });
export const apiPatch = (path, body) => request('PATCH', path, { body });
export const apiDelete = (path) => request('DELETE', path);
export const apiUpload = (path, formData) => request('POST', path, { formData });

// Fetches every page of a list endpoint. Pages come in parallel batches; a short page ends the list.
const PAGE_SIZE = 100; // the API's maximum
const BATCH = 4;

export async function apiGetAll(path) {
  const sep = path.includes('?') ? '&' : '?';
  const all = [];
  for (let start = 0; ; start += BATCH) {
    const pages = await Promise.all(
      Array.from({ length: BATCH }, (_, i) =>
        apiGet(`${path}${sep}limit=${PAGE_SIZE}&offset=${(start + i) * PAGE_SIZE}`)
      )
    );
    for (const page of pages) all.push(...page);
    if (pages.some((page) => page.length < PAGE_SIZE)) return all;
  }
}
