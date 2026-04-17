import { create } from "zustand";
import { customerService } from "@/services/customerService";
import { Customer, Repair, Device } from "@/types";

interface CustomerStore {
  items: Customer[];
  selectedCustomer: Customer | null;
  customerRepairs: Repair[];
  customerDevices: Device[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  fetchCustomerDetails: (id: string) => Promise<void>;
  setSelectedCustomer: (customer: Customer | null) => void;
  addItem: (data: Omit<Customer, "id">) => Promise<void>;
  updateItem: (id: string, data: Partial<Customer>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  items: [],
  selectedCustomer: null,
  customerRepairs: [],
  customerDevices: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await customerService.getAll();
      set({ items, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCustomerDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const [repairs, devices] = await Promise.all([
        customerService.getRepairs(id),
        customerService.getDevices(id)
      ]);
      set({ 
        customerRepairs: repairs, 
        customerDevices: devices, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setSelectedCustomer: (customer) => {
    set({ selectedCustomer: customer });
    if (customer) {
      get().fetchCustomerDetails(customer.id);
    } else {
      set({ customerRepairs: [], customerDevices: [] });
    }
  },

  addItem: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await customerService.create(data);
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
      const updatedItem = await customerService.update(id, data);
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
      await customerService.remove(id);
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
