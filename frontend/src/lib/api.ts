import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const auth = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  verify: async () => {
    const response = await apiClient.post('/auth/verify');
    return response.data;
  },
};

// Dashboard
export const dashboard = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },
};

// Properties
export const properties = {
  getAll: async () => {
    const response = await apiClient.get('/properties');
    return response.data;
  },
  getOne: async (id: string | number) => {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },
  create: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/properties', data);
    return response.data;
  },
  update: async (id: string | number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/properties/${id}`, data);
    return response.data;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete(`/properties/${id}`);
    return response.data;
  },
  getMatchingBuyers: async (id: string | number) => {
    const response = await apiClient.get(`/properties/${id}/matching-buyers`);
    return response.data;
  },
};

// Buyers
export const buyers = {
  getAll: async () => {
    const response = await apiClient.get('/buyers');
    return response.data;
  },
  getOne: async (id: string | number) => {
    const response = await apiClient.get(`/buyers/${id}`);
    return response.data;
  },
  create: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/buyers', data);
    return response.data;
  },
  update: async (id: string | number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/buyers/${id}`, data);
    return response.data;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete(`/buyers/${id}`);
    return response.data;
  },
  getMatchingProperties: async (id: string | number) => {
    const response = await apiClient.get(`/buyers/${id}/matching-properties`);
    return response.data;
  },
};

// Sellers
export const sellers = {
  getAll: async () => {
    const response = await apiClient.get('/sellers');
    return response.data;
  },
  getOne: async (id: string | number) => {
    const response = await apiClient.get(`/sellers/${id}`);
    return response.data;
  },
  create: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/sellers', data);
    return response.data;
  },
  update: async (id: string | number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/sellers/${id}`, data);
    return response.data;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete(`/sellers/${id}`);
    return response.data;
  },
};

// Enquiries
export const enquiries = {
  getAll: async () => {
    const response = await apiClient.get('/enquiries');
    return response.data;
  },
  getOne: async (id: string | number) => {
    const response = await apiClient.get(`/enquiries/${id}`);
    return response.data;
  },
  create: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/enquiries', data);
    return response.data;
  },
  update: async (id: string | number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/enquiries/${id}`, data);
    return response.data;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete(`/enquiries/${id}`);
    return response.data;
  },
};

// Employees
export const employees = {
  getAll: async () => {
    const response = await apiClient.get('/employees');
    return response.data;
  },
  getOne: async (id: string | number) => {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },
  create: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/employees', data);
    return response.data;
  },
  update: async (id: string | number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/employees/${id}`, data);
    return response.data;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  },
};

// Field Workers (admin-managed credentials)
export const workers = {
  getAll: async () => {
    const response = await apiClient.get('/workers');
    return response.data;
  },
  getOne: async (id: string | number) => {
    const response = await apiClient.get(`/workers/${id}`);
    return response.data;
  },
  create: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/workers', data);
    return response.data;
  },
  update: async (id: string | number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/workers/${id}`, data);
    return response.data;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete(`/workers/${id}`);
    return response.data;
  },
};

// Promotions (leads submitted by field workers) — admin side
export const promotions = {
  getAll: async (status?: string) => {
    const response = await apiClient.get('/promotions', { params: status ? { status } : undefined });
    return response.data;
  },
  getOne: async (id: string | number) => {
    const response = await apiClient.get(`/promotions/${id}`);
    return response.data;
  },
  updateStatus: async (id: string | number, status: string) => {
    const response = await apiClient.patch(`/promotions/${id}/status`, { status });
    return response.data;
  },
  update: async (id: string | number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/promotions/${id}`, data);
    return response.data;
  },
  delete: async (id: string | number) => {
    const response = await apiClient.delete(`/promotions/${id}`);
    return response.data;
  },
};

// --- Field worker (public, mobile) client ---
// Field workers authenticate separately from admin users, so they get their
// own axios instance/token/401 redirect rather than sharing `apiClient`.
const workerApiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

workerApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('worker_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

workerApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('worker_token');
      localStorage.removeItem('worker_user');
      window.location.href = '/field/login';
    }
    return Promise.reject(error);
  }
);

export const workerAuth = {
  login: async (email: string, password: string) => {
    const response = await workerApiClient.post('/worker-auth/login', { email, password });
    return response.data;
  },
  verify: async () => {
    const response = await workerApiClient.post('/worker-auth/verify');
    return response.data;
  },
};

export const workerPromotions = {
  submit: async (data: Record<string, unknown>) => {
    const response = await workerApiClient.post('/promotions', data);
    return response.data;
  },
  getCount: async () => {
    const response = await workerApiClient.get('/promotions/count');
    return response.data as { count: number };
  },
};
