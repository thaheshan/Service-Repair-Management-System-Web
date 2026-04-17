import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'border-[#4F46E5]',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]} ${color}`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};
