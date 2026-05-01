'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

import { useLoginMutation } from '@/services/api/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { toast } from 'sonner';

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login({ email, password }).unwrap();
      
      // Save token to cookie for the middleware
      document.cookie = `token=${result.accessToken}; path=/; max-age=86400; SameSite=Lax`;
      
      dispatch(setCredentials({
        user: result.user,
        accessToken: result.accessToken,
      }));

      // Use hard redirect for reliability during dev
      if (result.user.role === 'ADMIN') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('[LoginForm] Login error:', err);
      setError(err.data?.message || 'Invalid email or password. Please try again.');
      toast.error('Login failed');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-[#1a1c29] tracking-tight mb-2">Welcome back</h1>
        <p className="text-[15px] text-[#6b7280]">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-[13px] font-bold text-[#374151]">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-[#9ca3af]" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e5e7eb] bg-white text-[14px] text-[#1f2937] focus:outline-none focus:ring-2 focus:ring-[#8B8DF2]/50 focus:border-[#8B8DF2] transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-[13px] font-bold text-[#374151]">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-[#9ca3af]" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full pl-11 pr-12 py-3 rounded-xl border border-[#e5e7eb] bg-white text-[14px] text-[#1f2937] focus:outline-none focus:ring-2 focus:ring-[#8B8DF2]/50 focus:border-[#8B8DF2] transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9ca3af] hover:text-[#6b7280] focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer h-[18px] w-[18px] appearance-none rounded border-2 border-[#D1D5DB] bg-white checked:border-[#4F46E5] checked:bg-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:ring-offset-1 transition-all cursor-pointer"
              />
              <svg
                className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-[2px] top-[2px] transition-opacity"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[13px] font-medium text-[#6b7280] group-hover:text-[#4b5563] transition-colors">Remember me</span>
          </label>
          <Link href="/forgot-password" data-ignore className="text-[13px] font-semibold text-[#4F46E5] hover:text-[#4338CA] hover:underline transition-colors">
            Forgot password?
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 mt-2 rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md shadow-[#4F46E5]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
           <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Social Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#e5e7eb]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-[13px] font-medium text-[#9ca3af]">or continue with</span>
        </div>
      </div>

      {/* Social Providers */}
      <div className="grid grid-cols-2 gap-4">
        <button type="button" className="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-[#e5e7eb] bg-white hover:bg-[#f9fafb] text-[#374151] text-[13px] font-semibold transition-colors">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
        <button type="button" className="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-[#e5e7eb] bg-white hover:bg-[#f9fafb] text-[#374151] text-[13px] font-semibold transition-colors">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <rect x="1" y="1" width="9" height="9" fill="#F25022" />
            <rect x="14" y="1" width="9" height="9" fill="#00A4EF" />
            <rect x="1" y="14" width="9" height="9" fill="#7FBA00" />
            <rect x="14" y="14" width="9" height="9" fill="#FFB900" />
          </svg>
          Microsoft
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[13px] font-medium text-[#6b7280]">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#4F46E5] font-bold hover:underline transition-all">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}