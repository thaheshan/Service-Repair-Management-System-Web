import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ 
  message, 
  onClose,
  className = '' 
}) => {
  if (!message) return null;

  return (
    <div className={`p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2 duration-300 ${className}`}>
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm font-medium">
        {message}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="p-1 rounded-md hover:bg-red-100 transition-colors"
          aria-label="dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
