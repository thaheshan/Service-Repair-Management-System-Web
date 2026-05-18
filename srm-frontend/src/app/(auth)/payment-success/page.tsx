'use client';

import { useRouter } from 'next/navigation';
import { PaymentSuccess } from '@/components/payment/payment-success';

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <PaymentSuccess onGoToDashboard={() => router.push('/login')} />
  );
}
