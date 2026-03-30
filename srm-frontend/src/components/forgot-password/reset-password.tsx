'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { ResetCard } from './reset-card';
import { IconBadge } from './icon-badge';
import { PasswordStrength } from '@/components/common/inputs/password-strength';

interface ResetPasswordProps {
  onSubmit?: (password: string, confirmPassword: string) => Promise<void>;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onSubmit }) => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(password, confirmPassword);
      }
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/auth/reset-success');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled =
    loading || !password || !confirmPassword || password !== confirmPassword;

  return (
    <ResetCard>
      <div className="text-center mb-8">
        <IconBadge icon={<Lock className="w-8 h-8 text-blue-600" />} />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Create new password
        </h1>
        <p className="text-gray-600">
          Please enter a strong password for your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isButtonDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <Link
          href="/auth/login"
          className="flex items-center justify-center text-gray-600 hover:text-gray-900 font-semibold gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </ResetCard>
  );
};
