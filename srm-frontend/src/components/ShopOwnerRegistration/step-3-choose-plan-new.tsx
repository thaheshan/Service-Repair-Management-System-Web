"use client"

import { useState } from "react"
import { Check, ArrowLeft, ArrowRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RegistrationStepper } from "./registration-stepper"
import { SidePanelStep3 } from "./side-panel-step3"

interface PlanFeatures {
  [key: string]: string[]
}

interface Step3ChoosePlanProps {
  onNext: (plan: string) => void
  onBack: () => void
}

export function StepChoosePlan({ onNext, onBack }: Step3ChoosePlanProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [agreeTerms, setAgreeTerms] = useState(false)

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "Rs. 5,400",
      period: "/month",
      description: "Perfect for individual repair shops",
      popular: false,
      features: [
        "1 shop location",
        "Up to 500 repairs/month",
        "5-10 staff users",
        "10,000 photo storage",
        "Email notifications",
        "Basic reporting",
      ],
      buttonText: "Start Free Trial",
      buttonStyle: "border",
    },
    {
      id: "professional",
      name: "Professional",
      price: "Rs. 13,750",
      period: "/month",
      description: "Best for growing businesses",
      popular: true,
      features: [
        "5-10 shop locations",
        "Up to 2,000 repairs/month",
        "20-50 staff users",
        "50,000 photo storage",
        "Email + SMS notifications",
        "Advanced reporting",
        "Priority support",
      ],
      buttonText: "Start Free Trial",
      buttonStyle: "primary",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom Pricing",
      period: "",
      description: "For large scale operations",
      popular: false,
      features: [
        "100+ shop locations",
        "Unlimited repairs",
        "Unlimited users",
        "Unlimited storage",
        "All notification channels",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
      ],
      buttonText: "Contact Sales",
      buttonStyle: "border",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan || !agreeTerms) {
      alert("Please select a plan and agree to terms")
      return
    }
    onNext(selectedPlan)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side panel */}
      <div className="hidden w-[480px] shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <SidePanelStep3 />
        </div>
      </div>

      {/* Right side form */}
      <div className="flex flex-1 flex-col">
        {/* Back button */}
        <div className="px-6 pt-6 lg:px-16">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-6 lg:px-16">
          <div className="w-full max-w-[1200px]">
            {/* Stepper */}
            <div className="mb-8">
              <RegistrationStepper
                currentStep={3}
                steps={["Account", "Shop Details", "Choose Plan"]}
              />
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#111827]">Choose your plan</h2>
              <p className="mt-2 text-sm text-[#6B7280]">Select the best plan for your business needs</p>
            </div>

            {/* Pricing Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border-2 p-6 transition-all ${
                    selectedPlan === plan.id
                      ? "border-[#4F46E5] bg-[#F8F6FF]"
                      : "border-[#E5E7EB] bg-white hover:border-[#4F46E5]/50"
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#F59E0B] px-4 py-1 text-xs font-bold text-white">
                      POPULAR
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-[#111827]">{plan.name}</h3>
                    <p className="mt-1 text-xs text-[#6B7280]">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-[#111827]">{plan.price}</span>
                    {plan.period && <span className="text-sm text-[#6B7280]">{plan.period}</span>}
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full rounded-lg py-2 px-4 text-sm font-semibold transition-colors mb-6 ${
                      plan.buttonStyle === "primary"
                        ? "bg-[#4F46E5] text-white hover:bg-[#4338CA]"
                        : "border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F9FAFB]"
                    } ${
                      selectedPlan === plan.id
                        ? plan.buttonStyle === "primary"
                          ? "ring-2 ring-[#4F46E5] ring-offset-2"
                          : "ring-2 ring-[#4F46E5] ring-offset-2"
                        : ""
                    }`}
                  >
                    {selectedPlan === plan.id ? "✓ Selected" : plan.buttonText}
                  </button>

                  {/* Features List */}
                  <div className="space-y-3 border-t border-[#E5E7EB] pt-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="h-4 w-4 shrink-0 text-[#10B981] mt-0.5" />
                        <span className="text-sm text-[#374151]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Terms */}
              <div className="mb-8 flex items-start gap-2">
                <Checkbox
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                  className="mt-0.5"
                  id="terms-step3"
                />
                <label htmlFor="terms-step3" className="text-sm leading-relaxed text-[#374151]">
                  I agree to the{" "}
                  <a href="#" className="font-medium text-[#4F46E5] hover:underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="font-medium text-[#4F46E5] hover:underline">Privacy Policy</a>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#4F46E5] text-sm font-semibold text-white transition-colors hover:bg-[#4338CA] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedPlan || !agreeTerms}
                >
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Sign in link */}
            <div className="mt-8 pb-8 text-center">
              <p className="text-sm text-[#6B7280]">
                Already have an account?{" "}
                <a href="/login" className="font-semibold text-[#111827] underline hover:text-[#4F46E5]">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
