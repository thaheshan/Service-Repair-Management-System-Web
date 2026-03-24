'use client';

import { ReactNode } from 'react';
import { SidebarStepIndicator } from './sidebar-step-indicator';

interface RegistrationLayoutProps {
  currentStep: 1 | 2 | 3;
  children: ReactNode;
}

export function RegistrationLayout({ currentStep, children }: RegistrationLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <SidebarStepIndicator currentStep={currentStep} />

      {/* Right Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto px-6 py-12 lg:py-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
