'use client';

import React, { useEffect } from 'react';
import '@/i18n/i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
