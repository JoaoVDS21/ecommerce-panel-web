import { Product } from '@/types/product';
import apiClient, { createService } from './api-client';
import { Category } from '@/types/category';

// Uso do createService para operações padrão
const categoryBaseService = createService<Category>('/categories');

export const categoryService = {
  ...categoryBaseService,
  
  buscar: async (termo: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/categories/busca?termo=${termo}`);
    return response.data;
  },
};