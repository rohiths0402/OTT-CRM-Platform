const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");

function getAuthToken() {
  return localStorage.getItem("loopAccessToken") || "";
}

let refreshPromise = null;

async function refreshAccessToken() {
  const refresh = localStorage.getItem("loopRefreshToken");
  if (!refresh) return false;
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refresh }),
    }).then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.access) return false;
      localStorage.setItem("loopAccessToken", data.access);
      if (data.refresh) localStorage.setItem("loopRefreshToken", data.refresh);
      return true;
    }).catch(() => false).finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

async function request(endpoint, options = {}, canRefresh = true) {
  const token = getAuthToken();
  const path = `/${String(endpoint || "").replace(/^\/+/, "")}`;
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error("Cannot reach the Loop backend. Confirm Django is running at http://127.0.0.1:8000.");
  }
  if (response.status === 401 && canRefresh && !path.includes('/auth/refresh/')) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request(endpoint, options, false);
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail || data?.message || data?.error;
    throw new Error(typeof detail === "string" ? detail : `API request failed (${response.status}).`);
  }
  return data;
}

export const unwrapList = (response) => Array.isArray(response) ? response : (response?.results || response?.data || []);

async function getAll(endpoint, pageSize = 500) {
  const separator = endpoint.includes('?') ? '&' : '?';
  const first = await request(`${endpoint}${separator}page=1&page_size=${pageSize}`);
  if (Array.isArray(first)) return first;
  if (!Array.isArray(first?.results)) return unwrapList(first);
  const rows = [...first.results];
  const pageCount = Math.ceil((first.count || rows.length) / pageSize);
  for (let page = 2; page <= pageCount; page += 1) {
    const next = await request(`${endpoint}${separator}page=${page}&page_size=${pageSize}`);
    rows.push(...unwrapList(next));
  }
  return rows;
}

export const api = {
  get: (endpoint) => request(endpoint),
  getAll,
  post: (endpoint, data) => request(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  patch: (endpoint, data) => request(endpoint, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (endpoint, data) => request(endpoint, { method: "DELETE", ...(data ? { body: JSON.stringify(data) } : {}) }),
};
export default api;
