"use client"

import { useState } from "react"
import { User, Mail, Phone, CreditCard, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RegistrationStepper } from "./registration-stepper"
import { SidePanelStep1 } from "./side-panel-step1"
import { PasswordStrength } from "./password-strength"

interface StepPersonalInfoProps {
  onNext: (data: PersonalInfoData) => void
}

export interface PersonalInfoData {
  fullName: string
  email: string
  phone: string
  nic: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

export function StepPersonalInfo({ onNext }: StepPersonalInfoProps) {
  const [formData, setFormData] = useState<PersonalInfoData>({
    fullName: "",
    email: "",
    phone: "",
    nic: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (field: keyof PersonalInfoData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side panel */}
      <div className="hidden w-[480px] shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <SidePanelStep1 />
        </div>
      </div>

      {/* Right side form */}
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-10 lg:px-16">
          <div className="w-full max-w-[520px]">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-[#111827]">Technician Registration</h1>
              <p className="mt-2 text-sm text-[#6B7280]">Create your professional account to get started</p>
            </div>

            {/* Stepper */}
            <div className="mb-10">
              <RegistrationStepper
                currentStep={1}
                steps={["Personal Info", "Shop Details", "Verification"]}
              />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Full Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  Full Name <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  Email Address <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  Phone Number <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="tel"
                    placeholder="+94 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                    required
                  />
                </div>
              </div>

              {/* National Identity Card (NIC) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  National Identity Card (NIC) <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="XXXXXXXXXXV or XXXXXXXXXXXX"
                    value={formData.nic}
                    onChange={(e) => handleChange("nic", e.target.value)}
                    className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-[#6B7280]">Enter your 10 or 12 digit NIC number</p>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  Password <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-10 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <PasswordStrength password={formData.password} />
                <p className="mt-1 text-xs text-[#6B7280]">Minimum 8 characters with letters and numbers</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  Confirm Password <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-10 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => handleChange("agreeTerms", checked === true)}
                  className="mt-0.5"
                  id="terms-step1"
                />
                <label htmlFor="terms-step1" className="text-sm leading-relaxed text-[#374151]">
                  I agree to the{" "}
                  <a href="#" className="font-medium text-[#4F46E5] hover:underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="font-medium text-[#4F46E5] hover:underline">Privacy Policy</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#4F46E5] text-sm font-semibold text-white transition-colors hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:ring-offset-2"
              >
                Continue to Shop Details
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Sign in link */}
            <div className="mt-8 pb-8 text-center">
              <p className="text-sm text-[#6B7280]">
                Already have an account?{" "}
                <a href="../../LoginForm" className="font-semibold text-[#111827] underline hover:text-[#4F46E5]">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
