'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegistrationProvider } from './registration-context';
import { StepAccount, AccountData } from './step-1-account-new';
import { StepShopDetails, ShopDetailsData } from './step-2-shop-details-new';
import { StepChoosePlan } from './step-3-choose-plan-new';

import { useRequestRegistrationMutation } from '@/services/api/authApiSlice';
import { toast } from 'sonner';

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [shopDetailsData, setShopDetailsData] = useState<ShopDetailsData | null>(null);
  const [requestRegistration, { isLoading }] = useRequestRegistrationMutation();
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
    if (!accountData || !shopDetailsData) return;

    try {
      // 1. Generate IDs first (or handle in one go if backend supports it)
      // Since our backend requires UUIDs in the registerShopSchema, we should fetch them
      const idResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/shops/generate-ids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop_name: accountData.shopName,
          owner_email: accountData.email,
        }),
      });
      const { data: ids } = await idResponse.json();

      // 2. Submit full registration request
      const submissionData = {
        shop_id: ids.shop_id,
        tenant_id: ids.tenant_id,
        shop_name: accountData.shopName,
        owner: {
          name: accountData.ownerName,
          email: accountData.email,
          password: accountData.password,
        },
        address: shopDetailsData.address,
        city: shopDetailsData.city,
        country: shopDetailsData.country,
        phone: accountData.phone,
        brn: shopDetailsData.businessRegNumber,
        branches: shopDetailsData.branches,
        repairTypes: shopDetailsData.repairTypes,
        plan: plan,
      };

      const result = await requestRegistration(submissionData).unwrap();
      
      toast.success('Registration request submitted successfully!');
      router.push(`/request?id=${result.requestId}`); 
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to submit registration');
      console.error('Registration error:', error);
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