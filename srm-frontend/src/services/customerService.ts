import { get, post, put, del } from "@/api/client";
import { Customer, Repair, Device } from "@/types";
import { ENDPOINTS } from "@/constants/api";

export const customerService = {
  getAll: () => 
    get<Customer[]>(ENDPOINTS.CUSTOMERS.BASE),
  
  getById: (id: string) => 
    get<Customer>(ENDPOINTS.CUSTOMERS.BY_ID(id)),
  
  getRepairs: (id: string) => 
    get<Repair[]>(ENDPOINTS.CUSTOMERS.REPAIRS(id)),
  
  getDevices: (id: string) => 
    get<Device[]>(ENDPOINTS.CUSTOMERS.DEVICES(id)),
  
  create: (data: Omit<Customer, "id">) => 
    post<Customer>(ENDPOINTS.CUSTOMERS.BASE, data),
  
  update: (id: string, data: Partial<Customer>) => 
    put<Customer>(ENDPOINTS.CUSTOMERS.BY_ID(id), data),
  
  remove: (id: string) => 
    del<void>(ENDPOINTS.CUSTOMERS.BY_ID(id)),
};
