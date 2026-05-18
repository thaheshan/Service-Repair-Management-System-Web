import { store } from '@/store/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = {
  get: async (endpoint: string) => {
    const token = store.getState().auth.token; // Get token from Redux
    
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }), // Add token
      },
    });
    return res.json();
  },
  
  post: async (endpoint: string, data: unknown) => {
    const token = store.getState().auth.token; // Get token from Redux
    
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }), // Add token
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  
  // Add other methods (PUT, DELETE, etc.)
  put: async (endpoint: string, data: unknown) => {
    const token = store.getState().auth.token;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (endpoint: string) => {
    const token = store.getState().auth.token;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    return res.json();
  },
};