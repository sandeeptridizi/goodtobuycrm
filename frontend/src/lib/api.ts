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
  getOne: async (id: number) => {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },
  create: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/properties', data);
    return response.data;
  },
  update: async (id: number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/properties/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`/properties/${id}`);
    return response.data;
  },
  getMatchingBuyers: async (id: number) => {
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
  getOne: async (id: number) => {
    const response = await apiClient.get(`/buyers/${id}`);
    return response.data;
  },
  create: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/buyers', data);
    return response.data;
  },
  update: async (id: number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/buyers/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`/buyers/${id}`);
    return response.data;
  },
  getMatchingProperties: async (id: number) => {
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
  getOne: async (id: number) => {
    const response = await apiClient.get(`/sellers/${id}`);
    return response.data;
  },
  create: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/sellers', data);
    return response.data;
  },
  update: async (id: number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/sellers/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
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
  getOne: async (id: number) => {
    const response = await apiClient.get(`/enquiries/${id}`);
    return response.data;
  },
  create: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/enquiries', data);
    return response.data;
  },
  update: async (id: number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/enquiries/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
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
  getOne: async (id: number) => {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },
  create: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/employees', data);
    return response.data;
  },
  update: async (id: number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/employees/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  },
};
