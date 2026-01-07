const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const apiClient = {
  get: async (endpoint: string) => {
    const res = await fetch(\\\\);
    return res.json();
  },
  post: async (endpoint: string, data: any) => {
    const res = await fetch(\\\\, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
