import { apiClient } from '@/lib/api/client';
export const repairService = {
  getAll: () => apiClient.get('/repairs'),
  getById: (id: string) => apiClient.get(`/repairs/${id}`),
  create: (data: unknown) => apiClient.post('/repairs', data),
};
