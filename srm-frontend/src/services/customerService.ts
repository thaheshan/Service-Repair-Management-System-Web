import { apiClient } from '@/lib/api/client';
export const customerService = {
  getAll: () => apiClient.get('/customers'),
  create: (data: any) => apiClient.post('/customers', data),
};
