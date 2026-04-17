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
      const res = await get<any>("/users");
      // Handle { success: true, data: [...] } structure
      const items = Array.isArray(res) ? res : (res?.data ?? []);
      
      // Map backend 'name' to frontend 'firstName' and 'lastName' if needed
      const mappedItems = items.map((item: any) => {
        if (item.name && (!item.firstName || !item.lastName)) {
          const parts = item.name.split(" ");
          return {
            ...item,
            firstName: parts[0] || "",
            lastName: parts.slice(1).join(" ") || "",
          };
        }
        return item;
      });

      set({ items: mappedItems, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch staff", isLoading: false, items: [] });
    }
  },

  addItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      // Map frontend firstName/lastName to backend 'name'
      const payload = {
        ...item,
        email: item.email?.trim().toLowerCase(), // Normalize email
        name: `${item.firstName} ${item.lastName}`.trim(),
      };
      const res = await post<any>("/users", payload);
      const newItem = res.data || res;
      
      // Map it back for consistent state
      const mappedNewItem = {
        ...newItem,
        firstName: item.firstName,
        lastName: item.lastName,
      };

      set({ items: [...get().items, mappedNewItem], isLoading: false });
      return mappedNewItem;
    } catch (error: any) {
      const msg = error.message || "Failed to add staff member";
      set({ error: msg, isLoading: false });
      throw error; // Throw so UI can handle it
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
      await del(`/users/${id}`);
      set({
        items: get().items.filter((i) => i.id !== id),
        isLoading: false,
      });
    } catch (error: any) {
      const msg = error.message || "Failed to delete staff member";
      set({ error: msg, isLoading: false });
      throw error;
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
