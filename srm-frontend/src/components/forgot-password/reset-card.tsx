'use client';

import React from 'react';

interface ResetCardProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export const ResetCard: React.FC<ResetCardProps> = ({
  children,
  maxWidth = 'max-w-md',
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div
        className={`${maxWidth} w-full bg-white rounded-2xl shadow-lg p-8`}
      >
        {children}
      </div>
    </div>
  );
};
