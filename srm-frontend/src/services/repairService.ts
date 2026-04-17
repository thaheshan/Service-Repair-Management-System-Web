import { get, post, put, del, patch } from "@/api/client";
import { Repair } from "@/types";
import { ENDPOINTS } from "@/constants/api";

export const repairService = {
  getAll: () => 
    get<Repair[]>(ENDPOINTS.REPAIRS.BASE),
  
  getById: (id: string) => 
    get<Repair>(ENDPOINTS.REPAIRS.BY_ID(id)),
  
  getByCustomer: (customerId: string) => 
    get<Repair[]>(`${ENDPOINTS.REPAIRS.BASE}?customerId=${customerId}`),
  
  getByTech: (techId: string) => 
    get<Repair[]>(`${ENDPOINTS.REPAIRS.BASE}?technicianId=${techId}`),
  
  create: (data: Omit<Repair, "id" | "createdAt" | "updatedAt">) => 
    post<Repair>(ENDPOINTS.REPAIRS.BASE, data),
  
  update: (id: string, data: Partial<Repair>) => 
    put<Repair>(ENDPOINTS.REPAIRS.BY_ID(id), data),
  
  updateStatus: (id: string, status: string) => 
    patch<Repair>(ENDPOINTS.REPAIRS.STATUS(id), { status }),
  
  remove: (id: string) => 
    del<void>(ENDPOINTS.REPAIRS.BY_ID(id)),
};
