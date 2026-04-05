"use client"

import { useState } from "react"
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RegistrationStepper } from "./registration-stepper"
import { SidePanelStep1 } from "./side-panel-step1"
import { PasswordStrength } from "@/components/common/inputs/password-strength"
import { AuthLogo } from "@/components/common/auth-logo"

interface StepAccountProps {
  onNext: (data: AccountData) => void
}

export interface AccountData {
  shopName: string
  ownerName: string
  email: string
  phoneCode: string
  phone: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

// Representing a robust list of global phone codes
const PHONE_CODES = [
  { code: "+94", label: "LKA (+94)" },
  { code: "+1", label: "USA/CAN (+1)" },
  { code: "+44", label: "GBR (+44)" },
  { code: "+61", label: "AUS (+61)" },
  { code: "+91", label: "IND (+91)" },
  { code: "+81", label: "JPN (+81)" },
  { code: "+86", label: "CHN (+86)" },
  { code: "+49", label: "DEU (+49)" },
  { code: "+33", label: "FRA (+33)" },
  { code: "+39", label: "ITA (+39)" },
  { code: "+55", label: "BRA (+55)" },
  { code: "+7", label: "RUS (+7)" },
  { code: "+27", label: "ZAF (+27)" },
  { code: "+971", label: "ARE (+971)" },
  { code: "+65", label: "SGP (+65)" },
  { code: "+64", label: "NZL (+64)" },
  { code: "+60", label: "MYS (+60)" },
  { code: "+82", label: "KOR (+82)" },
]

export function StepAccount({ onNext }: StepAccountProps) {
  const [formData, setFormData] = useState<AccountData>({
    shopName: "",
    ownerName: "",
    email: "",
    phoneCode: "+94",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (field: keyof AccountData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for field upon typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.shopName.trim()) newErrors.shopName = "Shop name is required"
    if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required"
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = "Password must contain both letters and numbers"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Terms and Privacy Policy"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext(formData)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Left side panel - Hidden on Mobile/Tablet */}
      <div className="hidden lg:block lg:w-[480px] shrink-0">
        <div className="lg:sticky lg:top-0 h-full lg:h-screen">
          <SidePanelStep1 />
        </div>
      </div>

      {/* Right side form */}
      <div className="flex flex-1 flex-col bg-white overflow-y-auto">
        <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-10 lg:px-16">
          <div className="w-full max-w-[520px]">
            {/* Logo at the top for Mobile/Tablet */}
            <div className="lg:hidden mb-10 flex justify-center">
               <AuthLogo />
            </div>

            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
              <div className="hidden lg:block mb-8">
                <AuthLogo />
              </div>
              <h1 className="text-2xl font-bold text-[#111827]">Create your account</h1>
              <p className="mt-2 text-sm text-[#6B7280]">Let's get started with basic information</p>
            </div>

            {/* Stepper */}
            <div className="mb-10">
              <RegistrationStepper
                currentStep={1}
                steps={["Account", "Shop Details", "Choose Plan"]}
              />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Shop Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  Shop Name <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="TechFix Mobile Repairs"
                    value={formData.shopName}
                    onChange={(e) => handleChange("shopName", e.target.value)}
                    className={`h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:ring-2 ${
                      errors.shopName ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20' : 'border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20'
                    }`}
                  />
                </div>
                {errors.shopName ? (
                  <p className="mt-1.5 text-xs text-[#EF4444] font-medium">{errors.shopName}</p>
                ) : (
                  <p className="mt-1 text-xs text-[#6B7280]">This will be displayed to your customers</p>
                )}
              </div>

              {/* Owner Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  Owner Name <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="John Smith"
                    value={formData.ownerName}
                    onChange={(e) => handleChange("ownerName", e.target.value)}
                    className={`h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:ring-2 ${
                      errors.ownerName ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20' : 'border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20'
                    }`}
                  />
                </div>
                {errors.ownerName && <p className="mt-1.5 text-xs text-[#EF4444] font-medium">{errors.ownerName}</p>}
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
                    className={`h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:ring-2 ${
                      errors.email ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20' : 'border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20'
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-[#EF4444] font-medium">{errors.email}</p>}
              </div>

              {/* Phone Number with Country Dropdown */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  Phone Number <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative flex shadow-sm rounded-lg overflow-hidden">
                  <div className="relative border-y border-l border-[#E5E7EB] bg-[#F9FAFB] rounded-l-lg hover:bg-gray-100 transition-colors">
                    <select
                      value={formData.phoneCode}
                      onChange={(e) => handleChange("phoneCode", e.target.value)}
                      className="h-11 appearance-none bg-transparent pl-3 pr-8 text-sm text-[#374151] font-medium outline-none cursor-pointer"
                    >
                      {PHONE_CODES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                       <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  <div className={`relative flex-1 border ${errors.phone ? 'border-[#EF4444]' : 'border-[#E5E7EB] border-l-0'} rounded-r-lg bg-white overflow-hidden`}>
                    <input
                      type="tel"
                      placeholder="555 000 0000"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={`h-11 w-full pl-3 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:ring-2 ${
                        errors.phone ? 'focus:ring-[#EF4444]/20 focus:border-[#EF4444]' : 'focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]'
                      }`}
                    />
                  </div>
                </div>
                {errors.phone && <p className="mt-1.5 text-xs text-[#EF4444] font-medium">{errors.phone}</p>}
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
                    className={`h-11 w-full rounded-lg border bg-white pl-10 pr-10 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:ring-2 ${
                      errors.password ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20' : 'border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20'
                    }`}
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
                {errors.password ? (
                  <p className="mt-1.5 text-xs text-[#EF4444] font-medium">{errors.password}</p>
                ) : (
                  <>
                    <PasswordStrength password={formData.password} />
                    <p className="mt-1 text-xs text-[#6B7280]">Minimum 8 characters with letters and numbers</p>
                  </>
                )}
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
                    className={`h-11 w-full rounded-lg border bg-white pl-10 pr-10 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:ring-2 ${
                      errors.confirmPassword ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20' : 'border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1.5 text-xs text-[#EF4444] font-medium">{errors.confirmPassword}</p>}
              </div>

              {/* Terms & Conditions */}
              <div className="mt-2">
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <Checkbox
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleChange("agreeTerms", checked === true)}
                      id="terms-step1"
                      className={errors.agreeTerms ? "border-[#EF4444] data-[state=checked]:bg-[#EF4444]" : ""}
                    />
                  </div>
                  <label htmlFor="terms-step1" className={`text-sm leading-relaxed ${errors.agreeTerms ? "text-[#EF4444]" : "text-[#374151]"}`}>
                    I agree to the{" "}
                    <a href="#" className="font-medium text-[#4F46E5] hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="font-medium text-[#4F46E5] hover:underline">Privacy Policy</a>
                  </label>
                </div>
                {errors.agreeTerms && <p className="mt-1 text-xs text-[#EF4444] font-medium">{errors.agreeTerms}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#4F46E5] text-[15px] font-semibold text-white transition-colors hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:ring-offset-2"
              >
                Continue to Shop Details
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

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
