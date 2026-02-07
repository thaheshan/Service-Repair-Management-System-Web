'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';
import './LoginInput.scss';

interface LoginInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const LoginInput = forwardRef<HTMLInputElement, LoginInputProps>(
  ({ icon, error, className = '', ...props }, ref) => {
    return (
      <div className="login-input-wrapper">
        <div className="input-container">
          {icon && <span className="input-icon">{icon}</span>}
          <input
            ref={ref}
            className={`login-input ${error ? 'error' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <span className="input-error">{error}</span>}
      </div>
    );
  }
);

LoginInput.displayName = 'LoginInput';

export default LoginInput;
