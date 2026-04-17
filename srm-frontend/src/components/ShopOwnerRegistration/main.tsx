'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RegistrationProvider } from './registration-context';
import { StepAccount } from './step-1-account-new';
import { StepShopDetails } from './step-2-shop-details-new';
import { StepChoosePlan } from './step-3-choose-plan-new';
import PaymentPage from '@/components/payment/main';
import { RequestPending } from '@/components/Request/request-pending';
import { RequestSuccessful } from '@/components/Request/request-successful';
import { useAuthStore } from '@/store/authStore';
import { useRegistrationStore } from '@/store/registrationStore';

export default function RegistrationPage() {
  const { currentStep, setStep, accountData, shopDetailsData, selectedPlan, setSelectedPlan, requestId, setRequestId, clearRegistration } = useRegistrationStore();
  const { registerShop } = useAuthStore();
  const router = useRouter();

  // Poll for status when in the "Pending Approval" step
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 4 && requestId) {
      interval = setInterval(() => {
        checkStatus();
      }, 5000); // Check every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep, requestId]);

  const handleStep1Complete = () => {
    setStep(2);
  };

  const handleStep2Complete = () => {
    setStep(3);
  };

  const handleStep3Complete = async (plan: string) => {
    setSelectedPlan(plan);
    try {
      const result: any = await registerShop({
        ...accountData,
        ...shopDetailsData,
        selectedPlan: plan,
      });
      setRequestId(result.requestId);
      setStep(4); // Go to Request Pending Screen
    } catch (err) {
      console.error("Registration request failed", err);
    }
  };

  const checkStatus = async () => {
    if (!requestId) return;
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/onboarding/status/${requestId}`);
      const data = await resp.json();
      
      if (data.status === 'APPROVED') {
        setStep(5); // Go to Request Successful/Proceed to Payment
      } else if (data.status === 'COMPLETED') {
        router.push('/login?registration=success');
      }
    } catch (err) {
      console.error("Failed to check status", err);
    }
  };

  const executeRegistration = async (paymentIntentId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/onboarding/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, paymentIntentId })
      });

      // Wipe form data on success
      clearRegistration();
      router.push('/login?registration=success');
    } catch (error: any) {
      console.error('Registration finalization failed', error);
      throw error;
    }
  };

  const handleRegistrationComplete = () => {
    router.push('/login');
  };

  return (
    <RegistrationProvider>
      {currentStep === 1 && (
        <StepAccount onNext={handleStep1Complete} />
      )}
      {currentStep === 2 && (
        <StepShopDetails
          onNext={handleStep2Complete}
          onBack={() => setStep(1)}
        />
      )}
      {currentStep === 3 && (
        <StepChoosePlan
          onNext={handleStep3Complete}
          onBack={() => setStep(2)}
        />
      )}
      {currentStep === 4 && (
        <RequestPending 
          onCheckStatus={() => {}} 
          onGoHome={() => router.push('/')} 
        />
      )}
      {currentStep === 5 && (
        <RequestSuccessful 
          onProceedToPayment={() => setStep(6)} 
          onStartDemo={() => router.push('/')} 
        />
      )}
      {currentStep === 6 && (
        <PaymentPage 
          onPaymentSuccess={executeRegistration} 
          onNavigateToLogin={handleRegistrationComplete}
        />
      )}
    </RegistrationProvider>
  );
}