export type RepairStatus = "pending" | "in_progress" | "completed" | "cancelled" | "ready_to_take" | "delivered";
export type UserRole = "admin" | "manager" | "technician" | "customer";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  shopId?: string;
  phone?: string;
  isActive?: boolean;
}

export interface AuthUser extends User {
  token: string;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt?: string;
}

export interface Device {
  id: string;
  customerId: string;
  brand: string;
  model: string;
  imei?: string;
  serialNumber?: string;
  deviceType?: string;
}

export interface Repair {
  id: string;
  deviceId: string;
  customerId: string;
  shopId: string;
  technicianId?: string;
  status: RepairStatus;
  issueDescription: string;
  description?: string; // fallback as used in some places
  estimatedCost?: number;
  actualCost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderLevel: number;
  unitCost: number;
  category: string;
}

export interface Staff extends User {
  // Inherits from User
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
