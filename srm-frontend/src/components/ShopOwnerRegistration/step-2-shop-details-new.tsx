"use client"

import { useState } from "react"
import { Store, MapPin, GitBranch, Mail, Phone, ArrowLeft, Info, ArrowRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RegistrationStepper } from "./registration-stepper"
import { SidePanelStep2 } from "./side-panel-step2"
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
  city: string
  branches: string
  repairTypes: string[]
  agreeTerms: boolean
}

export function StepShopDetails({ onNext, onBack }: StepShopDetailsProps) {
  const [formData, setFormData] = useState<ShopDetailsData>({
    businessRegNumber: "",
    address: "",
    city: "",
    branches: "",
    repairTypes: [],
    agreeTerms: false,
  })

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
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleRepairType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      repairTypes: prev.repairTypes.includes(type)
        ? prev.repairTypes.filter((t) => t !== type)
        : [...prev.repairTypes, type],
    }))
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
          <SidePanelStep2 />
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
          <div className="w-full max-w-[520px]">
            {/* Stepper */}
            <div className="mb-8">
              <RegistrationStepper
                currentStep={2}
                steps={["Account", "Shop Details", "Choose Plan"]}
              />
            </div>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#111827]">Shop details</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Help us understand your business better</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                {/* Business Registration Number */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                    Business Registration Number <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      type="text"
                      placeholder="BR-XXXXXXXX"
                      value={formData.businessRegNumber}
                      onChange={(e) => handleChange("businessRegNumber", e.target.value)}
                      className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#6B7280]">Optional - for invoicing purposes</p>
                </div>

                {/* Shop Address */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                    Shop Address <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#9CA3AF]" />
                    <textarea
                      placeholder="Street address, city, postal code"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-4 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                      required
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                    City <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <Select onValueChange={(value) => handleChange("city", value)}>
                      <SelectTrigger className="h-11 w-full rounded-lg border-[#E5E7EB] pl-10 text-sm [&>span]:text-[#9CA3AF]">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-york">New York</SelectItem>
                        <SelectItem value="los-angeles">Los Angeles</SelectItem>
                        <SelectItem value="chicago">Chicago</SelectItem>
                        <SelectItem value="houston">Houston</SelectItem>
                        <SelectItem value="phoenix">Phoenix</SelectItem>
                        <SelectItem value="philadelphia">Philadelphia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Number of Branches */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">
                    Number of Branches <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="relative">
                    <GitBranch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <Select onValueChange={(value) => handleChange("branches", value)}>
                      <SelectTrigger className="h-11 w-full rounded-lg border-[#E5E7EB] pl-10 text-sm [&>span]:text-[#9CA3AF]">
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
                </div>

                {/* Type of Repairs */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#111827]">
                    Type of Repairs <span className="text-[#EF4444]">*</span>
                  </label>
                  <p className="mb-3 text-xs text-[#6B7280]">Select all that apply</p>
                  <div className="grid grid-cols-2 gap-3">
                    {repairOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleRepairType(option)}
                        className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                          formData.repairTypes.includes(option)
                            ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]"
                            : "border-[#E5E7EB] bg-white text-[#111827] hover:border-[#4F46E5]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info box */}
                <div className="rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] px-4 py-4">
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
                <div className="flex items-start gap-2">
                  <Checkbox
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleChange("agreeTerms", checked === true)}
                    className="mt-0.5"
                    id="terms-step2"
                  />
                  <label htmlFor="terms-step2" className="text-sm leading-relaxed text-[#374151]">
                    I agree to the{" "}
                    <a href="#" className="font-medium text-[#4F46E5] hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="font-medium text-[#4F46E5] hover:underline">Privacy Policy</a>
                    . I confirm that all information provided is accurate and true.
                  </label>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex gap-4">
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
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#4F46E5] text-sm font-semibold text-white transition-colors hover:bg-[#4338CA]"
                  >
                    Continue to Plan
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
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
