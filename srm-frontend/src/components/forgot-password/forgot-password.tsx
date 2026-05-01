'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Key, ArrowLeft } from 'lucide-react';
import { ResetCard } from './reset-card';
import { IconBadge } from './icon-badge';

import { useForgotPasswordMutation } from '@/services/api/authApiSlice';
import { toast } from 'sonner';

interface ForgotPasswordProps {
  onSubmit?: (email: string) => Promise<void>;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSubmit }) => {
  const router = useRouter();
  const [forgotPassword, { isLoading: loading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await forgotPassword({ email }).unwrap();
      setSubmitted(true);
      toast.success('Reset link sent to your email');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to send reset link');
      console.error('Failed to send reset link:', error);
    }
  };

  if (submitted) {
    return (
      <ResetCard>
        <div className="text-center">
          <IconBadge icon={<Mail className="w-8 h-8 text-[#4F46E5]" />} />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Check your email
          </h1>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <span className="font-semibold">{email}</span>
          </p>
          <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              Didn't receive an email? Check your spam folder or{' '}
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
                className="text-[#4F46E5] font-semibold hover:underline"
              >
                try again
              </button>
              .
            </p>
          </div>
          <Link href="/auth/login" className="text-[#4F46E5] font-semibold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </ResetCard>
    );
  }

  return (
    <ResetCard>
      <div className="text-center mb-8">
        <IconBadge icon={<Key className="w-8 h-8 text-[#4F46E5]" />} />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Forgot your password?
        </h1>
        <p className="text-gray-600">
          No worries! Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-[#CBD5E1] disabled:text-[#64748B] disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-sm transition-all"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <Link
          href="/auth/login"
          className="flex items-center justify-center text-gray-600 hover:text-gray-900 font-semibold gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#4F46E5] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </ResetCard>
  );
};
