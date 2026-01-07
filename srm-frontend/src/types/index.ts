export interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'technician' | 'customer';
  name: string;
  shopId?: string;
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
}
export interface Device {
  id: string;
  customerId: string;
  brand: string;
  model: string;
  imei?: string;
  serialNumber?: string;
}
export interface Repair {
  id: string;
  deviceId: string;
  customerId: string;
  shopId: string;
  technicianId?: string;
  status: 'not_started' | 'in_progress' | 'ready_to_take' | 'delivered';
  issueDescription: string;
  estimatedCost?: number;
  actualCost?: number;
  createdAt: string;
  updatedAt: string;
}
export interface Photo {
  id: string;
  repairId: string;
  url: string;
  type: 'intake' | 'progress' | 'completed';
  createdAt: string;
}
