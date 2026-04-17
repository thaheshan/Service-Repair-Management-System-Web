import { create } from "zustand";
import { repairService } from "@/services/repairService";
import { Repair } from "@/types";

interface RepairStore {
  items: Repair[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  addItem: (data: Omit<Repair, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateItem: (id: string, data: Partial<Repair>) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useRepairStore = create<RepairStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await repairService.getAll();
      set({ items, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addItem: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await repairService.create(data);
      set((state) => ({ 
        items: [...state.items, newItem], 
        isLoading: false 
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateItem: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedItem = await repairService.update(id, data);
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updatedItem : item)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const updatedItem = await repairService.updateStatus(id, status);
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updatedItem : item)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await repairService.remove(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
