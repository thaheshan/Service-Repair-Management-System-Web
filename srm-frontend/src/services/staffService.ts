import { get, post, put, del } from "@/api/client";
import { Staff, Repair } from "@/types";
import { ENDPOINTS } from "@/constants/api";

export const staffService = {
  getAll: () => 
    get<Staff[]>(ENDPOINTS.STAFF.BASE),
  
  getTechnicians: () => 
    get<Staff[]>(`${ENDPOINTS.STAFF.BASE}?role=technician`),
  
  getById: (id: string) => 
    get<Staff>(ENDPOINTS.STAFF.BY_ID(id)),
  
  create: (data: Omit<Staff, "id">) => 
    post<Staff>(ENDPOINTS.STAFF.BASE, data),
  
  update: (id: string, data: Partial<Staff>) => 
    put<Staff>(ENDPOINTS.STAFF.BY_ID(id), data),
  
  remove: (id: string) => 
    del<void>(ENDPOINTS.STAFF.BY_ID(id)),
  
  getAssignedRepairs: (id: string) => 
    get<Repair[]>(ENDPOINTS.STAFF.REPAIRS(id)),
};
