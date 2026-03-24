'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AccountData } from './step-1-account-new';
import { ShopDetailsData } from './step-2-shop-details-new';

interface RegistrationData {
  account?: AccountData;
  shopDetails?: ShopDetailsData;
  selectedPlan?: string;
}

interface RegistrationContextType {
  data: RegistrationData;
  setAccountData: (data: AccountData) => void;
  setShopDetailsData: (data: ShopDetailsData) => void;
  setSelectedPlan: (plan: string) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RegistrationData>({});

  const setAccountData = (account: AccountData) => {
    setData((prev) => ({ ...prev, account }));
  };

  const setShopDetailsData = (shopDetails: ShopDetailsData) => {
    setData((prev) => ({ ...prev, shopDetails }));
  };

  const setSelectedPlan = (plan: string) => {
    setData((prev) => ({ ...prev, selectedPlan: plan }));
  };

  return (
    <RegistrationContext.Provider value={{ data, setAccountData, setShopDetailsData, setSelectedPlan }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within RegistrationProvider');
  }
  return context;
}
