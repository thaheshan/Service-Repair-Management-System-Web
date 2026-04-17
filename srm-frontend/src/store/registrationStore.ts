import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AccountData {
  shopName: string;
  ownerName: string;
  email: string;
  phoneCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface ShopDetailsData {
  businessRegNumber: string;
  address: string;
  city: string;
  country: string;
  branches: string;
  repairTypes: string[];
}

interface RegistrationState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  accountData: AccountData;
  shopDetailsData: ShopDetailsData;
  requestId: string | null;
  setStep: (step: 1 | 2 | 3 | 4 | 5 | 6) => void;
  setAccountData: (data: Partial<AccountData>) => void;
  setShopDetailsData: (data: Partial<ShopDetailsData>) => void;
  setSelectedPlan: (plan: string) => void;
  setRequestId: (id: string | null) => void;
  clearRegistration: () => void;
}

const defaultAccountData: AccountData = {
  shopName: "",
  ownerName: "",
  email: "",
  phoneCode: "+94",
  phone: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
};

const defaultShopDetailsData: ShopDetailsData = {
  businessRegNumber: "",
  address: "",
  city: "",
  country: "Sri Lanka",
  branches: "1",
  repairTypes: [],
};

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      currentStep: 1,
      accountData: defaultAccountData,
      shopDetailsData: defaultShopDetailsData,
      selectedPlan: "",
      requestId: null,
      setStep: (step) => set({ currentStep: step }),
      setAccountData: (data) =>
        set((state) => ({
          accountData: { ...state.accountData, ...data },
        })),
      setShopDetailsData: (data) =>
        set((state) => ({
          shopDetailsData: { ...state.shopDetailsData, ...data },
        })),
      setSelectedPlan: (plan) => set({ selectedPlan: plan }),
      setRequestId: (id) => set({ requestId: id }),
      clearRegistration: () =>
        set({
          currentStep: 1,
          accountData: defaultAccountData,
          shopDetailsData: defaultShopDetailsData,
          selectedPlan: "",
          requestId: null,
        }),
    }),
    {
      name: 'srm-registration-storage',
    }
  )
);
