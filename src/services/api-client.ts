import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { useTenantStore } from '@/stores/tenant-store';

export const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient: AxiosInstance = axios.create({
  baseURL
});

// Interceptor de requisição para adicionar token JWT e tenant ID
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const currentTenant = useTenantStore.getState().currentTenant;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (currentTenant?.id) {
      config.headers['x-tenant-id'] = currentTenant.id;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para tratar erros comuns
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      // Usuário não autenticado ou token expirado
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Função utilitária para criar endpoints específicos
export const createService = <T>(endpoint: string) => {
  return {
    getAll: async (config?: AxiosRequestConfig) => {
      const response = await apiClient.get<T[]>(endpoint, config);
      return response.data;
    },
    get: async (id: string | number, config?: AxiosRequestConfig) => {
      const response = await apiClient.get<T>(`${endpoint}/${id}`, config);
      return response.data;
    },
    create: async (data: Partial<T> | FormData, config?: AxiosRequestConfig) => {
      const response = await apiClient.post<T>(endpoint, data, config);
      return response.data;
    },
    update: async (id: string | number, data: Partial<T> | FormData, config?: AxiosRequestConfig) => {
      const response = await apiClient.put<T>(`${endpoint}/${id}`, data, config);
      return response.data;
    },
    delete: async (id: string | number, config?: AxiosRequestConfig) => {
      const response = await apiClient.delete(`${endpoint}/${id}`, config);
      return response.data;
    },
  };
};