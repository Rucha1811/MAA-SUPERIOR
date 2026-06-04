import axios, { AxiosError } from 'axios';

// Use relative /api so Vite proxy handles it in dev; set VITE_API_URL for production
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request: attach access token ────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response: auto-refresh on 401 ───────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: any)=>void; reject: (e: any)=>void }> = [];

const processQueue = (error: any, token: string|null = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const original = error.config as any;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
          .then(token => { original.headers.Authorization = `Bearer ${token}`; return api(original); });
      }
      original._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        processQueue(null, data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally { isRefreshing = false; }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (d: any) => api.post('/auth/register', d),
  login: (d: any) => api.post('/auth/login', d),
  adminLogin: (d: any) => api.post('/auth/admin/login', d),
  me: () => api.get('/auth/me'),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
};

// ─── Menu ─────────────────────────────────────────────────────────────────────
export const menuApi = {
  getCategories: () => api.get('/menu/categories'),
  getPresets: () => api.get('/menu/presets'),
  createCategory: (d: any) => api.post('/menu/categories', d),
  updateCategory: (id: string, d: any) => api.patch(`/menu/categories/${id}`, d),
  createItem: (d: any) => api.post('/menu/items', d),
  updateItem: (id: string, d: any) => api.patch(`/menu/items/${id}`, d),
  deleteItem: (id: string) => api.delete(`/menu/items/${id}`),
};

// ─── Quotations ───────────────────────────────────────────────────────────────
export const quotationApi = {
  submit: (d: any) => api.post('/quotations', d),
  myQuotes: () => api.get('/quotations/my'),
  adminList: (params?: any) => api.get('/quotations/admin', { params }),
  adminGet: (id: string) => api.get(`/quotations/admin/${id}`),
  adminUpdate: (id: string, d: any) => api.patch(`/quotations/admin/${id}`, d),
};

// ─── Customers ────────────────────────────────────────────────────────────────
export const customerApi = {
  list: (params?: any) => api.get('/customers', { params }),
  get: (id: string) => api.get(`/customers/${id}`),
  toggle: (id: string) => api.patch(`/customers/${id}/toggle`),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = { stats: () => api.get('/dashboard') };

// ─── Settings ─────────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => api.get('/settings'),
  update: (d: any) => api.put('/settings', d),
};

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contactApi = {
  send: (d: any) => api.post('/contact', d),
  adminList: () => api.get('/contact/admin'),
  markRead: (id: string) => api.patch(`/contact/admin/${id}/read`),
};
