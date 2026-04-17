import { create } from "zustand";
import { deviceService } from "@/services/deviceService";
import { Device } from "@/types";

interface DeviceStore {
  items: Device[];
  customerDevices: Device[];
  selectedDevice: Device | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  fetchByCustomer: (customerId: string) => Promise<void>;
  setSelectedDevice: (device: Device | null) => void;
  addItem: (data: Omit<Device, "id">) => Promise<void>;
  updateItem: (id: string, data: Partial<Device>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  items: [],
  customerDevices: [],
  selectedDevice: null,
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await deviceService.getAll();
      set({ items, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchByCustomer: async (customerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const customerDevices = await deviceService.getByCustomer(customerId);
      set({ customerDevices, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setSelectedDevice: (device) => set({ selectedDevice: device }),

  addItem: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await deviceService.create(data);
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
      const updatedItem = await deviceService.update(id, data);
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updatedItem : item)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deviceService.remove(id);
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
