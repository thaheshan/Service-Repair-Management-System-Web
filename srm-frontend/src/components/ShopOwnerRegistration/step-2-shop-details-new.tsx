"use client"

import { useState } from "react"
import { Store, MapPin, GitBranch, Info, ArrowLeft, ArrowRight, Globe } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RegistrationStepper } from "./registration-stepper"
import { SidePanelStep2 } from "./side-panel-step2"
import { AuthLogo } from "@/components/common/auth-logo"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StepShopDetailsProps {
  onNext: (data: ShopDetailsData) => void
  onBack: () => void
}

export interface ShopDetailsData {
  businessRegNumber: string
  address: string
  country: string
  city: string
  branches: string
  repairTypes: string[]
  agreeTerms: boolean
}

const SRI_LANKA_CITIES = [
  "Colombo", "Dehiwala-Mount Lavinia", "Moratuwa", "Sri Jayawardenepura Kotte",
  "Negombo", "Kandy", "Kalmunai", "Vavuniya", "Galle", "Trincomalee",
  "Batticaloa", "Jaffna", "Katunayake", "Dambulla", "Kolonnawa",
  "Anuradhapura", "Ratnapura", "Badulla", "Matara", "Puttalam",
  "Chavakachcheri", "Kattankudy", "Ampara", "Kurunegala", "Panadura"
].sort()

const COUNTRIES = [
  "Sri Lanka", "United States", "United Kingdom", "Australia", 
  "India", "Canada", "Singapore", "United Arab Emirates", "Malaysia", "Custom"
]

export function StepShopDetails({ onNext, onBack }: StepShopDetailsProps) {
  const [formData, setFormData] = useState<ShopDetailsData>({
    businessRegNumber: "",
    address: "",
    country: "Sri Lanka",
    city: "",
    branches: "",
    repairTypes: [],
    agreeTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const repairOptions = [
    "Mobile Phones",
    "Tablets",
    "Laptops",
    "Smartwatches",
    "Gaming Consoles",
    "Cameras",
    "Other",
  ]

  const handleChange = (field: keyof ShopDetailsData, value: string | boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      // If country changes, clear city to prevent data mismatches
      if (field === "country" && prev.country !== value) {
        updated.city = ""
      }
      return updated
    })
    
    // Clear validation error when typing/selecting
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const toggleRepairType = (type: string) => {
    setFormData((prev) => {
      const newTypes = prev.repairTypes.includes(type)
        ? prev.repairTypes.filter((t) => t !== type)
        : [...prev.repairTypes, type]
        
      if (errors.repairTypes && newTypes.length > 0) {
        setErrors((errs) => {
          const newErrors = { ...errs }
          delete newErrors.repairTypes
          return newErrors
        })
      }
      
      return { ...prev, repairTypes: newTypes }
    })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.address.trim()) newErrors.address = "Shop address is required"
    if (!formData.country) newErrors.country = "Country is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.branches) newErrors.branches = "Number of branches is required"
    if (formData.repairTypes.length === 0) newErrors.repairTypes = "Select at least one repair type"
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must confirm your information is accurate"

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
          <SidePanelStep2 />
        </div>
      </div>

      {/* Right side form */}
      <div className="flex flex-1 flex-col bg-white overflow-y-auto">
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
            {/* Logo at the top for Mobile/Tablet */}
            <div className="lg:hidden mb-10 flex justify-center">
               <AuthLogo />
            </div>

            {/* Stepper */}
            <div className="mb-8">
              <RegistrationStepper
                currentStep={2}
                steps={["Account", "Shop Details", "Choose Plan"]}
              />
            </div>

            {/* Header */}
            <div className="mb-6 lg:text-left text-center">
              <div className="hidden lg:block mb-8">
                <AuthLogo />
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">Shop details</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Help us understand your business better</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Business Registration Number */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  Business Registration Number <span className="text-[#9CA3AF] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="BR-XXXXXXXX"
                    value={formData.businessRegNumber}
                    onChange={(e) => handleChange("businessRegNumber", e.target.value)}
                    className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                  />
                </div>
                <p className="mt-1.5 text-xs text-[#6B7280]">For invoicing purposes</p>
              </div>

              {/* Shop Address */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  Shop Address <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-[#9CA3AF]" />
                  <textarea
                    placeholder="Street address, building, postal code"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    rows={3}
                    className={`w-full resize-none rounded-lg border bg-white pl-10 pr-4 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:ring-2 ${
                      errors.address ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20' : 'border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20'
                    }`}
                  />
                </div>
                {errors.address && <p className="mt-1 text-xs text-[#EF4444] font-medium">{errors.address}</p>}
              </div>

              {/* Country & City Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Country */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                    Country <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                      <SelectTrigger className={`h-11 w-full rounded-lg pl-10 text-sm [&>span]:text-[#111827] transition-all focus:ring-2 ${
                        errors.country ? 'border-[#EF4444] focus:ring-[#EF4444]/20' : 'border-[#E5E7EB] focus:ring-[#4F46E5]/20'
                      }`}>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.country && <p className="mt-1 text-xs text-[#EF4444] font-medium">{errors.country}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                    City <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                    {formData.country === "Sri Lanka" ? (
                      <Select value={formData.city} onValueChange={(value) => handleChange("city", value)}>
                        <SelectTrigger className={`h-11 w-full rounded-lg pl-10 text-sm [&>span]:text-[#111827] transition-all focus:ring-2 ${
                          errors.city ? 'border-[#EF4444] focus:ring-[#EF4444]/20' : 'border-[#E5E7EB] focus:ring-[#4F46E5]/20'
                        }`}>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          {SRI_LANKA_CITIES.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g. London"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        className={`h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:ring-2 ${
                          errors.city ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20' : 'border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20'
                        }`}
                      />
                    )}
                  </div>
                  {errors.city && <p className="mt-1 text-xs text-[#EF4444] font-medium">{errors.city}</p>}
                </div>
              </div>

              {/* Number of Branches */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                  Number of Branches <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <Select value={formData.branches} onValueChange={(value) => handleChange("branches", value)}>
                    <SelectTrigger className={`h-11 w-full rounded-lg pl-10 text-sm [&>span]:text-[#111827] transition-all focus:ring-2 ${
                        errors.branches ? 'border-[#EF4444] focus:ring-[#EF4444]/20' : 'border-[#E5E7EB] focus:ring-[#4F46E5]/20'
                      }`}>
                      <SelectValue placeholder="Select branches count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Branch</SelectItem>
                      <SelectItem value="2-5">2-5 Branches</SelectItem>
                      <SelectItem value="6-10">6-10 Branches</SelectItem>
                      <SelectItem value="10+">10+ Branches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.branches && <p className="mt-1 text-xs text-[#EF4444] font-medium">{errors.branches}</p>}
              </div>

              {/* Type of Repairs */}
              <div>
                <label className="mb-1 block text-sm font-medium text-[#111827]">
                  Type of Repairs <span className="text-[#EF4444]">*</span>
                </label>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs text-[#6B7280]">Select all that apply</p>
                  {errors.repairTypes && <p className="text-xs text-[#EF4444] font-medium animate-pulse">{errors.repairTypes}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {repairOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleRepairType(option)}
                      className={`rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                        formData.repairTypes.includes(option)
                          ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]"
                          : errors.repairTypes 
                            ? "border-[#FCA5A5] bg-white text-[#111827] hover:border-[#EF4444]" 
                            : "border-[#E5E7EB] bg-white text-[#111827] hover:border-[#4F46E5]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info box */}
              <div className="rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] px-4 py-4 mt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]">
                    <Info className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#111827]">Business Information</h4>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#374151]">
                      This information helps us match you with relevant customers and opportunities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="mt-2">
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <Checkbox
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleChange("agreeTerms", checked === true)}
                      id="terms-step2"
                      className={errors.agreeTerms ? "border-[#EF4444] data-[state=checked]:bg-[#EF4444]" : ""}
                    />
                  </div>
                  <label htmlFor="terms-step2" className={`text-sm leading-relaxed ${errors.agreeTerms ? "text-[#EF4444]" : "text-[#374151]"}`}>
                    I agree to the{" "}
                    <a href="#" className="font-medium text-[#4F46E5] hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="font-medium text-[#4F46E5] hover:underline">Privacy Policy</a>
                    . I confirm that all information provided is accurate and true.
                  </label>
                </div>
                {errors.agreeTerms && <p className="mt-1 text-xs text-[#EF4444] font-medium">{errors.agreeTerms}</p>}
              </div>

              {/* Buttons */}
              <div className="mt-4 flex gap-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[15px] font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#4F46E5] text-[15px] font-semibold text-white transition-colors hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:ring-offset-2"
                >
                  Continue to Plan
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
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
