'use client';

import React, { useMemo } from 'react';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
}) => {
  const { strength, percentage, color } = useMemo(() => {
    let strength = 0;

    if (!password) {
      return { strength: 0, percentage: 0, color: 'bg-gray-300' };
    }

    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    const percentage = (strength / 5) * 100;
    let colorClass = 'bg-red-500';

    if (strength <= 2) colorClass = 'bg-red-500';
    else if (strength === 3) colorClass = 'bg-yellow-500';
    else if (strength >= 4) colorClass = 'bg-blue-600';

    return { strength, percentage, color: colorClass };
  }, [password]);

  return (
    <div className="mt-3 space-y-2">
      <div className="text-sm font-medium text-gray-600">Password strength</div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
