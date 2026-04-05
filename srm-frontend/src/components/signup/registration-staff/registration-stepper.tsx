"use client"

import { Check } from "lucide-react"

interface RegistrationStepperProps {
  currentStep: number
  steps: string[]
}

export function RegistrationStepper({ currentStep, steps }: RegistrationStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isActive = stepNumber === currentStep

        return (
          <div key={step} className="flex items-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  isCompleted || isActive
                    ? "bg-[#4F46E5] text-white"
                    : "bg-[#E5E7EB] text-[#6B7280]"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`text-xs sm:text-sm font-medium whitespace-nowrap ${isActive ? "block" : "hidden sm:block"} ${
                  isActive || isCompleted ? "text-[#4F46E5]" : "text-[#6B7280]"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-1.5 sm:mx-3 h-[2px] w-4 sm:w-8 md:w-16 shrink-0 ${
                  stepNumber < currentStep ? "bg-[#4F46E5]" : "bg-[#E5E7EB]"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
