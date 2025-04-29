
import apiClient from './api-client';
import { LoginCredentials, LoginResponse, User } from '@/types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: any): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', userData);
    return response.data;
  },
  
  me: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};