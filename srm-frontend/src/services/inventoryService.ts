import { get, post, put, del, patch } from "@/api/client";
import { InventoryItem } from "@/types";
import { ENDPOINTS } from "@/constants/api";

export const inventoryService = {
  getAll: () => 
    get<InventoryItem[]>(ENDPOINTS.INVENTORY.BASE),
  
  getLowStock: () => 
    get<InventoryItem[]>(`${ENDPOINTS.INVENTORY.BASE}?lowStock=true`),
  
  create: (data: Omit<InventoryItem, "id">) => 
    post<InventoryItem>(ENDPOINTS.INVENTORY.BASE, data),
  
  update: (id: string, data: Partial<InventoryItem>) => 
    put<InventoryItem>(ENDPOINTS.INVENTORY.BY_ID(id), data),
  
  updateStock: (id: string, delta: number) => 
    patch<InventoryItem>(ENDPOINTS.INVENTORY.STOCK(id), { delta }),
  
  remove: (id: string) => 
    del<void>(ENDPOINTS.INVENTORY.BY_ID(id)),
};
