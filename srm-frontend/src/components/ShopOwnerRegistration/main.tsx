'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegistrationProvider } from './registration-context';
import { StepAccount, AccountData } from './step-1-account-new';
import { StepShopDetails, ShopDetailsData } from './step-2-shop-details-new';
import { StepChoosePlan } from './step-3-choose-plan-new';
import { useAuthStore } from '@/store/authStore';

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [shopDetailsData, setShopDetailsData] = useState<ShopDetailsData | null>(null);
  const { registerShop } = useAuthStore();
  const router = useRouter();

  const handleStep1Complete = (data: AccountData) => {
    setAccountData(data);
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: ShopDetailsData) => {
    setShopDetailsData(data);
    setCurrentStep(3);
  };

  const handleStep3Complete = async (plan: string) => {
    try {
      await registerShop({
        ...accountData,
        ...shopDetailsData,
        selectedPlan: plan,
      });

      router.push('/admin/dashboard'); 
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <RegistrationProvider>
      {currentStep === 1 && (
        <StepAccount onNext={handleStep1Complete} />
      )}
      {currentStep === 2 && (
        <StepShopDetails
          onNext={handleStep2Complete}
          onBack={() => setCurrentStep(1)}
        />
      )}
      {currentStep === 3 && (
        <StepChoosePlan
          onNext={handleStep3Complete}
          onBack={() => setCurrentStep(2)}
        />
      )}
    </RegistrationProvider>
  );
}