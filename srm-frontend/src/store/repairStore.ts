import { create } from 'zustand';
export const useRepairStore = create((set) => ({
  repairs: [],
  setRepairs: (repairs: any[]) => set({ repairs }),
}));
