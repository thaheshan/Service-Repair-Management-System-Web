'use client';

import React from 'react';

interface IconBadgeProps {
  icon: React.ReactNode;
  bgColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  bgColor = 'bg-blue-100',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  return (
    <div
      className={`${sizeMap[size]} ${bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
    >
      {icon}
    </div>
  );
};
