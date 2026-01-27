import { apiClient } from '@/lib/api/client';
export const customerService = {
  getAll: () => apiClient.get('/customers'),
  create: (data: unknown) => apiClient.post('/customers', data),
};
