import { create } from "zustand";
import { get, put } from "@/api/client";
import { Shop } from "@/types";

interface ShopState {
  shop: Shop | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchShop: () => Promise<void>;
  updateShop: (updates: Partial<Shop>) => Promise<void>;
}

export const useShopStore = create<ShopState>((set, get) => ({
  shop: null,
  isLoading: false,
  error: null,

  fetchShop: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await get<Shop>("/shop");
      set({ shop: res, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch shop settings", isLoading: false });
    }
  },

  updateShop: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await put<Shop>("/shop", updates);
      set({ shop: updated, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to update shop settings", isLoading: false });
      throw error;
    }
  }
}));
