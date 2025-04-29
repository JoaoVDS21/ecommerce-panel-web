import { Product, ProductFormData } from '@/types/product';
import apiClient, { createService } from './api-client';

// Uso do createService para operações padrão
const productBaseService = createService<Product>('/products');

export const productService = {
  ...productBaseService,
  
  // Métodos personalizados adicionais
  getByCategoriaId: async (categoryId: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/products/category/${categoryId}`);
    return response.data;
  },
  
  buscar: async (termo: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/products/busca?termo=${termo}`);
    return response.data;
  },
};