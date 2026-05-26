const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper to get token from localStorage
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// Helper to build headers with authorization
const getHeaders = (customHeaders: Record<string, string> = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const apiClient = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });
    if (!res.ok && res.status === 401) {
      console.error('❌ Unauthorized - token may be expired');
      // Token expired, clear it
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    return res.json();
  },
  post: async (endpoint: string, data: unknown) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok && res.status === 401) {
      console.error('❌ Unauthorized - token may be expired');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    return res.json();
  },
};
