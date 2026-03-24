'use client';

import { Check, User, Store, CreditCard } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export function SidebarStepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Account', icon: User },
    { number: 2, label: 'Shop Details', icon: Store },
    { number: 3, label: 'Choose Plan', icon: CreditCard },
  ];

  return (
    <div className="hidden lg:flex flex-col gap-8 items-center py-12 px-8 h-full bg-gradient-to-b from-[#5B4BB1] to-[#3D2B7F]">
      {/* Logo/Branding */}
      <div className="flex flex-col items-center gap-8 flex-1">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center">
            {/* Step Circle */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                currentStep >= step.number
                  ? 'bg-white text-[#5B4BB1]'
                  : 'bg-[rgba(255,255,255,0.3)] text-white border-2 border-white border-opacity-50'
              }`}
            >
              {currentStep > step.number ? (
                <Check className="w-8 h-8" strokeWidth={3} />
              ) : (
                <step.icon className="w-8 h-8" />
              )}
            </div>

            {/* Label */}
            <p
              className={`mt-3 text-sm font-medium ${
                currentStep >= step.number ? 'text-white' : 'text-white text-opacity-70'
              }`}
            >
              {step.label}
            </p>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="w-1 h-12 bg-white bg-opacity-30 mt-4" />
            )}
          </div>
        ))}
      </div>

      {/* Illustration and Info */}
      <div className="w-full max-w-xs">
        {currentStep === 1 && (
          <div className="bg-gradient-to-b from-[#A8E6E8] to-[#89CACC] rounded-lg p-6 flex items-center justify-center h-32">
            <div className="text-white text-6xl">📱</div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="bg-[#F5A623] text-white rounded-t-lg p-3 text-center font-bold text-lg mb-0">
            REPAIR SHOP
          </div>
        )}
        {currentStep === 2 && (
          <div className="bg-gradient-to-b from-[#A8E6E8] to-[#89CACC] rounded-b-lg p-6 flex items-center justify-center h-32">
            <div className="text-4xl">🔧</div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="bg-gradient-to-b from-[#A8E6E8] to-[#89CACC] rounded-lg p-6 flex items-center justify-center h-32">
            <div className="text-5xl">✨</div>
          </div>
        )}

        {/* Info Text */}
        <div className="mt-6 space-y-3">
          {currentStep === 1 && (
            <>
              <div className="flex items-center gap-3 text-white">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Create your free account in under 2 minutes</span>
              </div>
            </>
          )}
          {currentStep === 2 && (
            <div className="flex items-center gap-3 text-white">
              <Check className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Customize your shop profile and service offerings</span>
            </div>
          )}
          {currentStep === 3 && (
            <>
              <div className="flex items-center gap-3 text-white">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">14-day free trial with full access</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">No credit card required to start</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Upgrade or downgrade anytime</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
