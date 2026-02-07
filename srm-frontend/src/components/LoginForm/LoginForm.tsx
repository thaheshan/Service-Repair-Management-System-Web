'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import LoginInput from '../LoginInput/LoginInput';
import './LoginForm.scss';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="login-form-container">
      <div className="form-header">
        <h1 className="form-title">Welcome back</h1>
        <p className="form-subtitle">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <LoginInput
            id="email"
            type="email"
            placeholder="Email"
            icon={<Mail />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="password-input-wrapper">
            <LoginInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              icon={<Lock />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="form-actions">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="checkbox-input"
            />
            <span>Remember me</span>
          </label>
          <a href="#" className="forgot-password-link">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`sign-in-btn ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
          <ArrowRight size={20} />
        </button>
      </form>

      <div className="divider">
        <span>or continue with</span>
      </div>

      <div className="social-login">
        <button type="button" className="social-btn google">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
        <button type="button" className="social-btn microsoft">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <rect x="1" y="1" width="9" height="9" fill="#F25022" />
            <rect x="14" y="1" width="9" height="9" fill="#00A4EF" />
            <rect x="1" y="14" width="9" height="9" fill="#7FBA00" />
            <rect x="14" y="14" width="9" height="9" fill="#FFB900" />
          </svg>
          Microsoft
        </button>
      </div>

      <div className="signup-prompt">
        <p>
          Don't have an account?{' '}
          <a href="#" className="signup-link">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
