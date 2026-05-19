import { Suspense } from 'react';
import Paymentflow from '../../../components/payment/main';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading payment details...</div>}>
      <Paymentflow />
    </Suspense>
  );
}