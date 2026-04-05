"use client"

import { useState } from "react"
import { Check, ArrowLeft } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RegistrationStepper } from "./registration-stepper"
import { SidePanelStep3 } from "./side-panel-step3"
import { AuthLogo } from "@/components/common/auth-logo"

interface Step3ChoosePlanProps {
  onNext: (plan: string) => void
  onBack: () => void
}

export function StepChoosePlan({ onNext, onBack }: Step3ChoosePlanProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const plans = [
    {
      id: "starter",
      name: "Single Shop",
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
      buttonStyle: "outline",
    },
    {
      id: "professional",
      name: "Small Business",
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
      buttonStyle: "outline",
    },
  ]

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!selectedPlan) newErrors.plan = "Please select a subscription plan to continue."
    if (!agreeTerms) newErrors.terms = "You must agree to the Terms of Service and Privacy Policy."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext(selectedPlan)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Left side panel - Hidden on Mobile/Tablet */}
      <div className="hidden lg:block lg:w-[480px] shrink-0">
        <div className="lg:sticky lg:top-0 h-full lg:h-screen">
          <SidePanelStep3 />
        </div>
      </div>

      {/* Right side form */}
      <div className="flex flex-1 flex-col bg-white overflow-y-auto">
        <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-10 lg:px-14">
          <div className="w-full max-w-[900px]">
            {/* Logo at the top for Mobile/Tablet */}
            <div className="lg:hidden mb-10 flex justify-center">
               <AuthLogo />
            </div>

            {/* Stepper */}
            <div className="mb-8">
              <RegistrationStepper
                currentStep={3}
                steps={["Account", "Shop Details", "Choose Plan"]}
              />
            </div>

            {/* Header */}
            <div className="mb-8 lg:text-left text-center">
              <div className="hidden lg:block mb-8">
                <AuthLogo />
              </div>
              <h2 className="text-[30px] font-bold text-[#111827] tracking-tight">Choose your plan</h2>
              <p className="mt-1.5 text-[15px] text-[#6B7280]">Select the best plan for your business needs</p>
            </div>

            {/* Pricing Cards */}
            <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-[20px] p-7 transition-all duration-300 ${
                    plan.popular
                      ? "border border-transparent bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-10"
                      : "border border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
                  } ${
                    selectedPlan === plan.id && !plan.popular
                      ? "border-[#4F46E5] ring-1 ring-[#4F46E5]"
                      : ""
                  } ${
                    selectedPlan === plan.id && plan.popular
                      ? "ring-2 ring-[#4F46E5]"
                      : ""
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#F59E0B] px-4 py-1 text-[11px] font-bold text-white tracking-widest shadow-sm">
                      POPULAR
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-3">
                    <h3 className="text-[15px] font-bold text-[#111827]">{plan.name}</h3>
                  </div>

                  {/* Price */}
                  <div className="mb-4 flex items-baseline">
                    <span className="text-[32px] font-bold text-[#111827] tracking-tight">{plan.price}</span>
                    {plan.period && <span className="text-[14px] text-[#9CA3AF] ml-1">{plan.period}</span>}
                  </div>

                  {/* Description & Divider */}
                  <p className="text-[13px] text-[#6B7280] mb-5">{plan.description}</p>
                  
                  <div className="h-[1px] w-full bg-[#E5E7EB] mb-6"></div>

                  {/* Features List */}
                  <div className="space-y-3.5 flex-1 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="h-[18px] w-[18px] shrink-0 text-[#10B981]" strokeWidth={2.5} />
                        <span className="text-[13px] font-medium text-[#4B5563]">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Select Button — single clean ternary, no conflicting overrides */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`mt-auto w-full rounded-xl py-3.5 px-4 text-[14px] font-semibold ${
                      selectedPlan === plan.id
                        ? "bg-[#4F46E5] text-white border border-transparent shadow-md"
                        : plan.buttonStyle === "primary"
                        ? "bg-[#4F46E5] text-white border border-transparent shadow-md hover:bg-[#4338CA]"
                        : "border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F9FAFB] hover:border-[#C7D2FE]"
                    }`}
                  >
                    {selectedPlan === plan.id ? "✓ Selected" : plan.buttonText}
                  </button>
                </div>
              ))}
            </div>
            {errors.plan && <p className="mb-6 text-sm text-[#EF4444] font-medium text-center">{errors.plan}</p>}

            {/* Form Container */}
            <form onSubmit={handleSubmit}>
              {/* Terms Checkbox */}
              <div className="mb-10 border-t border-[#E5E7EB] pt-8">
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <Checkbox
                      checked={agreeTerms}
                      onCheckedChange={(checked) => {
                        setAgreeTerms(checked === true)
                        if (errors.terms) setErrors({})
                      }}
                      id="terms-step3"
                      className={errors.terms ? "border-[#EF4444] data-[state=checked]:bg-[#EF4444]" : ""}
                    />
                  </div>
                  <label htmlFor="terms-step3" className={`text-sm font-medium leading-relaxed ${errors.terms ? "text-[#EF4444]" : "text-[#4B5563]"}`}>
                    I agree to the{" "}
                    <a href="#" className="text-[#4F46E5] hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-[#4F46E5] hover:underline">Privacy Policy</a>
                  </label>
                </div>
                {errors.terms && <p className="mt-1 text-xs text-[#EF4444] font-medium">{errors.terms}</p>}
              </div>

              {/* Bottom Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex h-12 flex-1 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[15px] font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  className={`flex h-12 flex-1 items-center justify-center rounded-xl text-[15px] font-semibold transition-all duration-300 ${
                    !selectedPlan || !agreeTerms
                      ? "bg-[#CBD5E1] text-[#64748B] cursor-not-allowed"
                      : "bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-md"
                  }`}
                  disabled={!selectedPlan || !agreeTerms}
                >
                  Create Account
                </button>
              </div>
            </form>

            {/* Empty space block if required to match scroll bounds */}
            <div className="pb-10"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
