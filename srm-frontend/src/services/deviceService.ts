import { get, post, put, del } from "@/api/client";
import { Device } from "@/types";
import { ENDPOINTS } from "@/constants/api";

export const deviceService = {
  getAll: () => 
    get<Device[]>(ENDPOINTS.DEVICES.BASE),
  
  getById: (id: string) => 
    get<Device>(ENDPOINTS.DEVICES.BY_ID(id)),
  
  getByCustomer: (customerId: string) => 
    get<Device[]>(`${ENDPOINTS.DEVICES.BASE}?customerId=${customerId}`),
  
  create: (data: Omit<Device, "id">) => 
    post<Device>(ENDPOINTS.DEVICES.BASE, data),
  
  update: (id: string, data: Partial<Device>) => 
    put<Device>(ENDPOINTS.DEVICES.BY_ID(id), data),
  
  remove: (id: string) => 
    del<void>(ENDPOINTS.DEVICES.BY_ID(id)),
};
