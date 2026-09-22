/**
 * Thin API client for the Todo backend.
 * All requests go through /api (proxied in dev, same origin in production).
 */

const BASE = '/api/todos';

async function request(path = '', options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString();
    return request(qs ? `?${qs}` : '');
  },

  getStats: () => request('/stats'),

  getById: (id) => request(`/${id}`),

  create: (body) =>
    request('', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  update: (id, body) =>
    request(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    }),

  toggle: (id) =>
    request(`/${id}/toggle`, {
      method: 'PATCH'
    }),

  remove: (id) =>
    request(`/${id}`, {
      method: 'DELETE'
    })
};
