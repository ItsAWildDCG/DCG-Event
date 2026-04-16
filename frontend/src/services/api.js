const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('dcg_token');
}

function buildQuery(params = {}) {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '');
  if (entries.length === 0) {
    return '';
  }

  const query = new URLSearchParams();
  for (const [key, value] of entries) {
    query.set(key, String(value));
  }

  return `?${query.toString()}`;
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
}

export const api = {
  health: () => request('/health'),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  updateAccount: (payload) => request('/auth/me', { method: 'PUT', body: JSON.stringify(payload) }),
  changePassword: (payload) => request('/auth/me/password', { method: 'PUT', body: JSON.stringify(payload) }),
  myRegistrations: () => request('/auth/me/registrations'),
  listEvents: (params = {}) => request(`/events${buildQuery(params)}`),
  getEvent: (eventId) => request(`/events/${eventId}`),
  createEvent: (payload) => request('/events', { method: 'POST', body: JSON.stringify(payload) }),
  updateEvent: (eventId, payload) =>
    request(`/events/${eventId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteEvent: (eventId) => request(`/events/${eventId}`, { method: 'DELETE' }),
  registerForEvent: (eventId) => request(`/events/${eventId}/register`, { method: 'POST' }),
  listRegistrations: (eventId) => request(`/events/${eventId}/registrations`)
};
