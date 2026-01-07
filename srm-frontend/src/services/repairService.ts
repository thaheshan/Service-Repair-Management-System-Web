import { apiClient } from '@/lib/api/client';
export const repairService = {
  getAll: () => apiClient.get('/repairs'),
  getById: (id: string) => apiClient.get(\/repairs/\\),
  create: (data: any) => apiClient.post('/repairs', data),
};
