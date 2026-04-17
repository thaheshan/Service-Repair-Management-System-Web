import { create } from "zustand";
import { inventoryService } from "@/services/inventoryService";
import { InventoryItem } from "@/types";

interface InventoryStore {
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  addItem: (data: Omit<InventoryItem, "id">) => Promise<void>;
  updateItem: (id: string, data: Partial<InventoryItem>) => Promise<void>;
  updateStock: (id: string, delta: number) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  
  // Selectors (computed values)
  getLowStockItems: () => InventoryItem[];
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await inventoryService.getAll();
      set({ items, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addItem: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await inventoryService.create(data);
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
      const updatedItem = await inventoryService.update(id, data);
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updatedItem : item)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateStock: async (id, delta) => {
    // Optimistic update
    const previousItems = get().items;
    set((state) => ({
      items: state.items.map((item) => 
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      ),
    }));

    try {
      await inventoryService.updateStock(id, delta);
    } catch (error: any) {
      // Rollback on failure
      set({ items: previousItems, error: error.message });
      throw error;
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await inventoryService.remove(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  getLowStockItems: () => {
    return get().items.filter(item => item.quantity <= item.reorderLevel);
  }
}));
