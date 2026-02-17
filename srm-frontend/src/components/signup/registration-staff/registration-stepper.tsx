"use client"

import { Check } from "lucide-react"

interface RegistrationStepperProps {
  currentStep: number
  steps: string[]
}

export function RegistrationStepper({ currentStep, steps }: RegistrationStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isActive = stepNumber === currentStep

        return (
          <div key={step} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                  isCompleted
                    ? "bg-[#4F46E5] text-white"
                    : isActive
                    ? "bg-[#4F46E5] text-white"
                    : "bg-[#E5E7EB] text-[#6B7280]"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  isActive
                    ? "text-[#4F46E5]"
                    : isCompleted
                    ? "text-[#4F46E5]"
                    : "text-[#6B7280]"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-3 h-[2px] w-16 ${
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
