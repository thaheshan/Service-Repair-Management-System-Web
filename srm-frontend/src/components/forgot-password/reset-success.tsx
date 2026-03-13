'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import { ResetCard } from './reset-card';
import { IconBadge } from './icon-badge';

export const ResetSuccess: React.FC = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    if (!autoRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/auth/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect, router]);

  return (
    <ResetCard maxWidth="max-w-md">
      <div className="text-center">
        <IconBadge
          icon={<CheckCircle className="w-8 h-8 text-green-500" />}
          bgColor="bg-green-100"
        />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Password Reset Successful!
        </h1>

        <p className="text-gray-600 mb-8">
          Your password has been successfully reset.
          <br />
          You can now sign in with your new password.
        </p>

        <button
          onClick={() => router.push('/auth/login')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors mb-2 flex items-center justify-center gap-2"
        >
          Continue to Sign In
          <span>→</span>
        </button>

        <p className="text-sm text-gray-600 mb-8">
          Redirecting automatically in{' '}
          <span className="font-semibold">{countdown}</span> seconds...
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-1">Security Tip</h3>
              <p className="text-sm text-gray-700">
                Make sure to use a strong, unique password and enable two-factor
                authentication for additional security.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            Need help?{' '}
            <Link href="/support" className="text-blue-600 font-semibold hover:underline">
              Contact Support
            </Link>
          </div>

          <button
            onClick={() => setAutoRedirect(!autoRedirect)}
            className="text-sm text-red-600 font-semibold hover:underline flex items-center justify-center gap-1 w-full"
          >
            <AlertTriangle className="w-4 h-4" />
            Didn't request a password reset?
          </button>
        </div>
      </div>
    </ResetCard>
  );
};
