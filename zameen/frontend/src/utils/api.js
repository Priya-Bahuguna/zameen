// ── Zameen API Helper ─────────────────────────────────────────
// All fetch calls to Node.js backend go through this file

const BASE = "https://elegant-insight-production-d440.up.railway.app/api";


// helper
async function request(url, options = {}) {
  const token = localStorage.getItem('zameenToken');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res  = await fetch(BASE + url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// ── Auth ───────────────────────────────────────────────────────
export const authAPI = {
  register : (body) => request('/auth/register', { method:'POST', body: JSON.stringify(body) }),
  login    : (body) => request('/auth/login',    { method:'POST', body: JSON.stringify(body) }),
  getMe    : ()     => request('/auth/me'),
  update   : (body) => request('/auth/me', { method:'PUT', body: JSON.stringify(body) }),
};

// ── Properties ─────────────────────────────────────────────────
export const propAPI = {
  getAll  : (params = {}) => request('/properties?' + new URLSearchParams(params)),
  getOne  : (id)          => request(`/properties/${id}`),
  create  : (body)        => request('/properties', { method:'POST', body: JSON.stringify(body) }),
  update  : (id, body)    => request(`/properties/${id}`, { method:'PUT', body: JSON.stringify(body) }),
  remove  : (id)          => request(`/properties/${id}`, { method:'DELETE' }),
  verify  : (id)          => request(`/properties/${id}/verify`, { method:'POST' }),
};

// ── Localities ─────────────────────────────────────────────────
export const localAPI = {
  getAll  : (params = {}) => request('/localities?' + new URLSearchParams(params)),
  getOne  : (name)        => request(`/localities/${name}`),
};

// ── Reviews ────────────────────────────────────────────────────
export const reviewAPI = {
  getAll : (params = {}) => request('/reviews?' + new URLSearchParams(params)),
  create : (body)        => request('/reviews', { method:'POST', body: JSON.stringify(body) }),
  remove : (id)          => request(`/reviews/${id}`, { method:'DELETE' }),
};

// ── Price History ──────────────────────────────────────────────
export const historyAPI = {
  getByLocality : (name, params = {}) => request(`/pricehistory/${name}?` + new URLSearchParams(params)),
  getAll        : (params = {})       => request('/pricehistory?' + new URLSearchParams(params)),
};

// ── Transactions ───────────────────────────────────────────────
export const txnAPI = {
  getAll : ()     => request('/transactions'),
  create : (body) => request('/transactions', { method:'POST', body: JSON.stringify(body) }),
  update : (id, body) => request(`/transactions/${id}`, { method:'PUT', body: JSON.stringify(body) }),
};
