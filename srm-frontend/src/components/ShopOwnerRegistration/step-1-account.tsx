'use client';

import { useState } from 'react';
import { Mail, Phone, Lock, Eye, EyeOff, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Step1Props {
  onContinue: (data: Step1Data) => void;
}

export interface Step1Data {
  shopName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function Step1Account({ onContinue }: Step1Props) {
  const [formData, setFormData] = useState<Step1Data>({
    shopName: 'TechFix Mobile Repairs',
    email: 'techfix09@email.com',
    phone: '+94 77 123 4567',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (!password) return { text: '', color: 'bg-gray-200', percent: 0 };
    if (password.length < 6) return { text: 'Weak', color: 'bg-red-400', percent: 33 };
    if (password.length < 10) return { text: 'Fair', color: 'bg-yellow-400', percent: 66 };
    return { text: 'Strong', color: 'bg-green-400', percent: 100 };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onContinue(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Step 1 of 3</p>
        <h1 className="text-4xl font-bold mt-2">Create your account</h1>
        <p className="text-muted-foreground mt-2">Let's get started with basic information</p>
      </div>

      {/* Shop Name */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Shop Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Store className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.shopName}
            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
            placeholder="Enter shop name"
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">This will be displayed to your customers</p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email"
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter phone number"
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter password"
            className="w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-gray-400"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirm password"
            className="w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3.5 text-gray-400"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Password Strength */}
      {formData.password && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Password strength</p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.percent}%` }} />
          </div>
        </div>
      )}

      {/* Continue Button */}
      <Button
        type="submit"
        className="w-full h-12 bg-primary text-primary-foreground text-base font-medium rounded-lg hover:bg-primary/90 mt-8"
      >
        Continue
      </Button>

      {/* Sign In Link */}
      <p className="text-center text-sm">
        Already have an account?{' '}
        <a href="#" className="text-primary font-medium hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
}
