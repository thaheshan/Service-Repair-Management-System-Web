import { create } from "zustand";
import { get as apiGet, patch } from "@/api/client";
import { Shop } from "@/types";

interface ShopState {
  shop: Shop | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchShop: () => Promise<void>;
  updateShop: (updates: Partial<Shop>) => Promise<void>;
}

export const useShopStore = create<ShopState>((set, getState) => ({
  shop: null,
  isLoading: false,
  error: null,

  fetchShop: async () => {
    set({ isLoading: true, error: null });
    try {
      const res: any = await apiGet("/shops");
      
      let shopDisplay = null;
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        shopDisplay = res.data[0];
      } else if (Array.isArray(res) && res.length > 0) {
        shopDisplay = res[0];
      } else if (res && res.id) {
        shopDisplay = res;
      }
      
      set({ shop: shopDisplay, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch shop settings", isLoading: false });
    }
  },

  updateShop: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const currentShop = getState().shop;
      if (!currentShop?.id) throw new Error("No active shop to update");
      const res = await patch<{success: boolean, data: Shop}>(`/shops/${currentShop.id}`, updates);
      set({ shop: res.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to update shop settings", isLoading: false });
      throw error;
    }
  }
}));
