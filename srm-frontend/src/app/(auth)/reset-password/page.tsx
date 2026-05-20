import { Suspense } from 'react';
import { ResetPassword } from '../../../components/forgot-password/reset-password';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}