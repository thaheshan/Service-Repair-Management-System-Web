export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
export const TOKEN_KEY = "srm_token";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    VALIDATE: "/auth/validate",
  },
  REPAIRS: {
    BASE: "/repairs",
    BY_ID: (id: string) => `/repairs/${id}`,
    STATUS: (id: string) => `/repairs/${id}/status`,
  },
  CUSTOMERS: {
    BASE: "/customers",
    BY_ID: (id: string) => `/customers/${id}`,
    REPAIRS: (id: string) => `/customers/${id}/repairs`,
    DEVICES: (id: string) => `/customers/${id}/devices`,
  },
  DEVICES: {
    BASE: "/devices",
    BY_ID: (id: string) => `/devices/${id}`,
  },
  INVENTORY: {
    BASE: "/inventory",
    BY_ID: (id: string) => `/inventory/${id}`,
    STOCK: (id: string) => `/inventory/${id}/stock`,
  },
  STAFF: {
    BASE: "/staff",
    BY_ID: (id: string) => `/staff/${id}`,
    REPAIRS: (id: string) => `/staff/${id}/repairs`,
  },
};
