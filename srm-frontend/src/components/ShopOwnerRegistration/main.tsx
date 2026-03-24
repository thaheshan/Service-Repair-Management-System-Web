'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegistrationProvider } from './registration-context';
import { StepAccount, AccountData } from './step-1-account-new';
import { StepShopDetails, ShopDetailsData } from './step-2-shop-details-new';
import { StepChoosePlan } from './step-3-choose-plan-new';

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [shopDetailsData, setShopDetailsData] = useState<ShopDetailsData | null>(null);
  const router = useRouter();

  const handleStep1Complete = (data: AccountData) => {
    setAccountData(data);
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: ShopDetailsData) => {
    setShopDetailsData(data);
    setCurrentStep(3);
  };

  const handleStep3Complete = (plan: string) => {
    console.log('Registration complete:', {
      account: accountData,
      shopDetails: shopDetailsData,
      selectedPlan: plan,
    });

    router.push('/payment'); 
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