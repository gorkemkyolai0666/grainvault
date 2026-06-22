export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = 'ApiError'; }
}

function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error('NEXT_PUBLIC_API_URL yapılandırılmamış');
  return url;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('grainvault_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${getApiUrl()}${endpoint}`, { ...options, headers });
  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('grainvault_token');
    localStorage.removeItem('grainvault_user');
    window.location.href = '/login';
    throw new ApiError(401, 'Oturum süresi doldu');
  }
  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Bir hata oluştu' }));
    throw new ApiError(response.status, err.message || `HTTP ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

function crud(base: string) {
  return {
    list: () => fetchAPI(base),
    get: (id: string) => fetchAPI(`${base}/${id}`),
    create: (data: Record<string, unknown>) => fetchAPI(base, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) => fetchAPI(`${base}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`${base}/${id}`, { method: 'DELETE' }),
  };
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (data: Record<string, unknown>) =>
      fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    me: () => fetchAPI('/auth/me'),
  },
  dashboard: { stats: () => fetchAPI('/dashboard/stats') },
  silos: crud('/silos'),
  intakes: crud('/intakes'),
  dispatches: crud('/dispatches'),
  qualityTests: crud('/quality-tests'),
  contracts: crud('/contracts'),
  maintenance: crud('/maintenance'),
};
