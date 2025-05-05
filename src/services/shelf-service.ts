import apiClient, { createService } from './api-client';
import { Shelf } from '@/types/shelf';

// Uso do createService para operações padrão
const shelfBaseService = createService<Shelf>('/shelves');

export const shelfService = {
  ...shelfBaseService,
  
  buscar: async (termo: string): Promise<Shelf[]> => {
    const response = await apiClient.get<Shelf[]>(`/shelves/busca?termo=${termo}`);
    return response.data;
  },
};