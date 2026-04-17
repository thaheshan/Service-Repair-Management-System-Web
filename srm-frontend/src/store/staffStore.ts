import { create } from "zustand";
import { get, post, put, del } from "@/api/client";
import { Staff } from "@/types";

interface StaffState {
  items: Staff[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  addItem: (item: Partial<Staff>) => Promise<void>;
  updateItem: (id: string, item: Partial<Staff>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
}

export const useStaffStore = create<StaffState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await get<Staff[]>("/staff");
      set({ items: res, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch staff", isLoading: false });
    }
  },

  addItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await post<Staff>("/staff", item);
      set({ items: [...get().items, newItem], isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to add staff member", isLoading: false });
    }
  },

  updateItem: async (id, item) => {
    set({ isLoading: true, error: null });
    try {
      const updatedItem = await put<Staff>(`/staff/${id}`, item);
      set({
        items: get().items.map((i) => (i.id === id ? updatedItem : i)),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to update staff member", isLoading: false });
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await del(`/staff/${id}`);
      set({
        items: get().items.filter((i) => i.id !== id),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to delete staff member", isLoading: false });
    }
  },

  updateStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
       const updatedItem = await put<Staff>(`/staff/${id}/status`, { status });
       set({
         items: get().items.map((i) => (i.id === id ? updatedItem : i)),
         isLoading: false,
       });
    } catch (error: any) {
      set({ error: error.message || "Failed to update status", isLoading: false });
    }
  }
}));
