"use client"

import { useState } from "react"
import { Store, Badge, MapPin, GitBranch, Mail, ArrowLeft, Info, FileText } from "lucide-react"
import { Checkbox } from "@/components/ui/ui-staff/checkbox"
import { RegistrationStepper } from "./registration-stepper"
import { SidePanelStep2 } from "./side-panel-step2"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/ui-staff/select"

interface StepShopDetailsProps {
  onNext: (data: ShopDetailsData) => void
  onBack: () => void
}

export interface ShopDetailsData {
  shopName: string
  companyPersonnelId: string
  shopLocation: string
  branchOutlet: string
  shopManagerEmail: string
  reasonForJoining: string
  agreeTerms: boolean
}

// All 25 Sri Lanka districts
const SL_DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PERSONNEL_ID_REGEX = /^[A-Za-z0-9\-]{3,30}$/

export function StepShopDetails({ onNext, onBack }: StepShopDetailsProps) {
  const [formData, setFormData] = useState<ShopDetailsData>({
    shopName: "",
    companyPersonnelId: "",
    shopLocation: "",
    branchOutlet: "",
    shopManagerEmail: "",
    reasonForJoining: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof ShopDetailsData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e })
  }

  const validate = () => {
    const e: Record<string, string> = {}

    if (!formData.shopName.trim()) {
      e.shopName = "Shop name is required."
    } else if (formData.shopName.trim().length < 2) {
      e.shopName = "Shop name must be at least 2 characters."
    }

    if (!formData.companyPersonnelId.trim()) {
      e.companyPersonnelId = "Company Personnel ID is required."
    } else if (!PERSONNEL_ID_REGEX.test(formData.companyPersonnelId.trim())) {
      e.companyPersonnelId = "ID must be 3–30 alphanumeric characters (hyphens allowed)."
    }

    if (!formData.shopLocation) {
      e.shopLocation = "Please select the shop's district."
    }

    if (!formData.shopManagerEmail.trim()) {
      e.shopManagerEmail = "Shop manager email is required."
    } else if (!EMAIL_REGEX.test(formData.shopManagerEmail)) {
      e.shopManagerEmail = "Enter a valid email address."
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
    `h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:ring-2 ${
      errors[field]
        ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
        : "border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20"
    }`

  return (
    <div className="flex min-h-screen">
      {/* Left side panel */}
      <div className="hidden w-[480px] shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <SidePanelStep2 />
        </div>
      </div>

      {/* Right side form */}
      <div className="flex flex-1 flex-col bg-white">
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
          <div className="w-full max-w-[520px]">

            {/* Stepper */}
            <div className="mb-8">
              <RegistrationStepper
                currentStep={2}
                steps={["Personal Info", "Shop Details", "Verification"]}
              />
            </div>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#111827]">Shop Information</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Enter the details of the repair shop you want to join</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
                <div className="flex flex-col gap-5">

                  {/* Shop Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                      Shop Name <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                      <input
                        type="text"
                        placeholder="Enter shop name"
                        value={formData.shopName}
                        onChange={(e) => handleChange("shopName", e.target.value)}
                        className={inputClass("shopName")}
                      />
                    </div>
                    {errors.shopName
                      ? <p className="mt-1 text-xs text-[#EF4444]">{errors.shopName}</p>
                      : <p className="mt-1 text-xs text-[#9CA3AF]">The official name of the repair shop</p>
                    }
                  </div>

                  {/* Company Personnel ID */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                      Company Personnel ID <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <Badge className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                      <input
                        type="text"
                        placeholder="e.g., TECH-2024-001"
                        value={formData.companyPersonnelId}
                        onChange={(e) => handleChange("companyPersonnelId", e.target.value)}
                        className={inputClass("companyPersonnelId")}
                      />
                    </div>
                    {errors.companyPersonnelId
                      ? <p className="mt-1 text-xs text-[#EF4444]">{errors.companyPersonnelId}</p>
                      : <p className="mt-1 text-xs text-[#9CA3AF]">Your unique employee ID provided by the shop</p>
                    }
                  </div>

                  {/* Shop Location — all 25 Sri Lanka districts */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                      Shop Location <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                      <Select onValueChange={(value) => handleChange("shopLocation", value)}>
                        <SelectTrigger
                          className={`h-11 w-full rounded-lg pl-10 text-sm [&>span]:text-[#9CA3AF] data-[state=open]:ring-2 ${
                            errors.shopLocation
                              ? "border-[#EF4444] data-[state=open]:border-[#EF4444] data-[state=open]:ring-[#EF4444]/20"
                              : "border-[#E5E7EB] data-[state=open]:border-[#4F46E5] data-[state=open]:ring-[#4F46E5]/20"
                          }`}
                        >
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {SL_DISTRICTS.map((district) => (
                            <SelectItem key={district} value={district.toLowerCase().replace(/\s+/g, "-")}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.shopLocation
                      ? <p className="mt-1 text-xs text-[#EF4444]">{errors.shopLocation}</p>
                      : <p className="mt-1 text-xs text-[#9CA3AF]">Select the district where the shop is located</p>
                    }
                  </div>

                  {/* Branch/Outlet (Optional) */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                      Branch/Outlet{" "}
                      <span className="text-xs font-normal text-[#9CA3AF]">(Optional)</span>
                    </label>
                    <div className="relative">
                      <GitBranch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                      <input
                        type="text"
                        placeholder="e.g., Main Branch, Mall Outlet"
                        value={formData.branchOutlet}
                        onChange={(e) => handleChange("branchOutlet", e.target.value)}
                        className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                      />
                    </div>
                    <p className="mt-1 text-xs text-[#9CA3AF]">Specify if the shop has multiple locations</p>
                  </div>

                  {/* Shop Manager Email */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                      Shop Manager Email <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                      <input
                        type="email"
                        placeholder="manager@repairshop.com"
                        value={formData.shopManagerEmail}
                        onChange={(e) => handleChange("shopManagerEmail", e.target.value)}
                        className={inputClass("shopManagerEmail")}
                      />
                    </div>
                    {errors.shopManagerEmail
                      ? <p className="mt-1 text-xs text-[#EF4444]">{errors.shopManagerEmail}</p>
                      : <p className="mt-1 text-xs text-[#9CA3AF]">Your access request will be sent to this email</p>
                    }
                  </div>

                  {/* Reason for Joining (Optional) */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                      Reason for Joining{" "}
                      <span className="text-xs font-normal text-[#9CA3AF]">(Optional)</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3.5 h-4 w-4 text-[#9CA3AF]" />
                      <textarea
                        placeholder="Tell us why you want to join this shop…"
                        value={formData.reasonForJoining}
                        onChange={(e) => handleChange("reasonForJoining", e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-4 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Info box */}
              <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]">
                    <Info className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#111827]">Verification Required</h4>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#374151]">
                      {"Your request will be sent to the shop manager for approval. You'll receive an email notification once your account is verified."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="mt-6 flex flex-col gap-1.5">
                <div className="flex items-start gap-2">
                  <Checkbox
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleChange("agreeTerms", checked === true)}
                    className={`mt-0.5 ${errors.agreeTerms ? "border-[#EF4444]" : ""}`}
                    id="terms-step2-staff"
                  />
                  <label
                    htmlFor="terms-step2-staff"
                    className={`text-sm leading-relaxed ${errors.agreeTerms ? "text-[#EF4444]" : "text-[#374151]"}`}
                  >
                    I agree to the{" "}
                    <a href="#" className="font-medium text-[#4F46E5] hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="font-medium text-[#4F46E5] hover:underline">Privacy Policy</a>
                    . I confirm that all information provided is accurate and true.
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-xs text-[#EF4444]">{errors.agreeTerms}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </button>
                <button
                  type="submit"
                  className="flex h-12 flex-1 items-center justify-center rounded-lg bg-[#4F46E5] text-sm font-semibold text-white transition-colors hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:ring-offset-2"
                >
                  Continue
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
