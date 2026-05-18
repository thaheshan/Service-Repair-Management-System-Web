'use client';

import { useRouter } from 'next/navigation';
import { PaymentFailed } from '@/components/payment/payment-failed';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <PaymentFailed
      onTryAgain={() => router.push('/payment')}
      onUseDifferentMethod={() => router.push('/payment')}
    />
  );
}
