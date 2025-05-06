import apiClient, { baseURL, createService } from './api-client';
import { Banner } from '@/types/banner';

// Uso do createService para operações padrão
const bannerBaseService = createService<Banner>('/banners');

export const bannerService = {
  ...bannerBaseService,
  
  getAll: async (): Promise<Banner[]> => {
    const response = await apiClient.get<Banner[]>('/banners');

    return response.data.map((banner: Banner) => ({
      ...banner,
      imageUrl: `${baseURL}${banner.imageUrl}`
    }))
  },

  get: async (id: number | string): Promise<Banner> => {
    const response = await apiClient.get<Banner>(`/banners/${id}`);

    return response.data ? {
      ...response.data,
      imageUrl: `${baseURL}${response.data.imageUrl}`
    } : response.data
  },
  
  buscar: async (termo: string): Promise<Banner[]> => {
    const response = await apiClient.get<Banner[]>(`/banners/busca?termo=${termo}`);
    return response.data;
  },
};