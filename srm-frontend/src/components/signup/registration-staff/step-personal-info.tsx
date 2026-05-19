"use client"

import { useState } from "react"
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ChevronDown } from "lucide-react"
import { Checkbox } from "@/components/ui/ui-staff/checkbox"
import { RegistrationStepper } from "./registration-stepper"
import { SidePanelStep1 } from "./side-panel-step1"
import { PasswordStrength } from "@/components/common/inputs/password-strength"


interface StepPersonalInfoProps {
  onNext: (data: PersonalInfoData) => void
}

export interface PersonalInfoData {
  fullName: string
  email: string
  phoneCode: string
  phone: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

// Top country codes — same as shop owner registration
const COUNTRY_CODES = [
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+1",  flag: "🇺🇸", name: "USA/Canada" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+65",  flag: "🇸🇬", name: "Singapore" },
  { code: "+60",  flag: "🇲🇾", name: "Malaysia" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "+33",  flag: "🇫🇷", name: "France" },
  { code: "+81",  flag: "🇯🇵", name: "Japan" },
  { code: "+86",  flag: "🇨🇳", name: "China" },
  { code: "+82",  flag: "🇰🇷", name: "South Korea" },
  { code: "+55",  flag: "🇧🇷", name: "Brazil" },
  { code: "+92",  flag: "🇵🇰", name: "Pakistan" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

export function StepPersonalInfo({ onNext }: StepPersonalInfoProps) {
  const [formData, setFormData] = useState<PersonalInfoData>({
    fullName: "",
    email: "",
    phoneCode: "+94",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof PersonalInfoData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error on change
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e })
  }

  const validate = () => {
    const e: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      e.fullName = "Full name is required."
    } else if (formData.fullName.trim().split(" ").length < 2) {
      e.fullName = "Please enter your first and last name."
    }

    if (!formData.email.trim()) {
      e.email = "Email address is required."
    } else if (!EMAIL_REGEX.test(formData.email)) {
      e.email = "Enter a valid email address."
    }

    if (!formData.phone.trim()) {
      e.phone = "Phone number is required."
    } else if (!/^\d{6,14}$/.test(formData.phone.replace(/\s/g, ""))) {
      e.phone = "Enter a valid phone number (digits only)."
    }

    if (!formData.password) {
      e.password = "Password is required."
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      e.password = "Minimum 8 characters with at least one letter and one number."
    }

    if (!formData.confirmPassword) {
      e.confirmPassword = "Please confirm your password."
    } else if (formData.password !== formData.confirmPassword) {
      e.confirmPassword = "Passwords do not match."
    }

    if (!formData.agreeTerms) {
      e.agreeTerms = "You must agree to the Terms of Service and Privacy Policy."
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onNext(formData)
  }

  const inputClass = (field: string) =>
    `h-11 w-full rounded-lg border bg-white pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:ring-2 ${
      errors[field]
        ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
        : "border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20"
    }`

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Left side panel - Hidden on Mobile/Tablet */}
      <div className="hidden lg:block lg:w-[480px] shrink-0">
        <div className="lg:sticky lg:top-0 h-full lg:h-screen">
          <SidePanelStep1 />
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-white overflow-y-auto">
        <div className="flex flex-1 items-start justify-center px-6 pt-16 pb-10 lg:px-16 lg:pt-24 lg:pb-16">
          <div className="w-full max-w-[520px]">
            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

              {/* Full Name */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Full Name <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className={`${inputClass("fullName")} pl-10`}
                  />
                </div>
                {errors.fullName
                  ? <p className="mt-1 text-xs text-[#EF4444]">{errors.fullName}</p>
                  : <p className="mt-1 text-xs text-[#9CA3AF]">Enter your first and last name</p>
                }
              </div>

              {/* Email Address */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Email Address <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`${inputClass("email")} pl-10`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-[#EF4444]">{errors.email}</p>}
              </div>

              {/* Phone Number with country code */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Phone Number <span className="text-[#EF4444]">*</span>
                </label>
                <div className={`flex h-11 overflow-hidden rounded-lg border transition-all focus-within:ring-2 ${
                  errors.phone
                    ? "border-[#EF4444] focus-within:border-[#EF4444] focus-within:ring-[#EF4444]/20"
                    : "border-[#E5E7EB] focus-within:border-[#4F46E5] focus-within:ring-[#4F46E5]/20"
                }`}>
                  {/* Country code dropdown */}
                  <div className="relative flex shrink-0 items-center border-r border-[#E5E7EB] bg-[#F9FAFB]">
                    <select
                      value={formData.phoneCode}
                      onChange={(e) => handleChange("phoneCode", e.target.value)}
                      className="h-full appearance-none bg-transparent py-0 pl-3 pr-8 text-sm font-medium text-[#374151] outline-none focus:outline-none"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-[#9CA3AF]" />
                  </div>
                  {/* Phone input */}
                  <input
                    type="tel"
                    placeholder="7X XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value.replace(/[^\d\s]/g, ""))}
                    className="h-full flex-1 bg-white px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none"
                  />
                </div>
                {errors.phone
                  ? <p className="mt-1 text-xs text-[#EF4444]">{errors.phone}</p>
                  : <p className="mt-1 text-xs text-[#9CA3AF]">Enter your mobile number without country code</p>
                }
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Password <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className={`${inputClass("password")} pl-10 pr-10`}
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
                {errors.password
                  ? <p className="mt-1 text-xs text-[#EF4444]">{errors.password}</p>
                  : <p className="mt-1 text-xs text-[#9CA3AF]">Minimum 8 characters with letters and numbers</p>
                }
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                  Confirm Password <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className={`${inputClass("confirmPassword")} pl-10 pr-10`}
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
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-[#EF4444]">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-start gap-2">
                  <Checkbox
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleChange("agreeTerms", checked === true)}
                    className={`mt-0.5 ${errors.agreeTerms ? "border-[#EF4444]" : ""}`}
                    id="terms-step1-staff"
                  />
                  <label
                    htmlFor="terms-step1-staff"
                    className={`text-sm leading-relaxed ${errors.agreeTerms ? "text-[#EF4444]" : "text-[#374151]"}`}
                  >
                    I agree to the{" "}
                    <a href="#" className="font-medium text-[#4F46E5] hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="font-medium text-[#4F46E5] hover:underline">Privacy Policy</a>
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-xs text-[#EF4444]">{errors.agreeTerms}</p>
                )}
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
                <a href="/login" className="font-semibold text-[#111827] underline hover:text-[#4F46E5]">Sign in</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
