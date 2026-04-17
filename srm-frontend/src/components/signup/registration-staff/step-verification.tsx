"use client"

import { useState } from "react"
import { CreditCard, ArrowLeft, ArrowRight, Info } from "lucide-react"
import { Checkbox } from "@/components/ui/ui-staff/checkbox"
import { RegistrationStepper } from "./registration-stepper"
import { SidePanelStep3 } from "./side-panel-step3"
import { FileUpload } from "./file-upload"
import { AuthLogo } from "@/components/common/auth-logo"
import { useStaffRegistrationStore } from "@/store/staffRegistrationStore"

interface StepVerificationProps {
  onSubmit: (data: VerificationData) => void
  onBack: () => void
}

export interface VerificationData {
  nicNumber: string
  nicFront: File | null
  nicBack: File | null
  certificate: File | null
  agreeTerms: boolean
}

export function StepVerification({ onSubmit, onBack }: StepVerificationProps) {
  const { isLoading, error } = useStaffRegistrationStore()
  const [formData, setFormData] = useState<VerificationData>({
    nicNumber: "",
    nicFront: null,
    nicBack: null,
    certificate: null,
    agreeTerms: false,
  })

  const handleChange = (field: keyof VerificationData, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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
        <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-10 lg:px-16">
          <div className="w-full max-w-[520px]">
            {/* Logo at the top for Mobile/Tablet */}
            <div className="lg:hidden mb-10 flex justify-center">
               <AuthLogo />
            </div>

            {/* Stepper */}
            <div className="mb-8">
              <RegistrationStepper
                currentStep={3}
                steps={["Personal Info", "Shop Details", "Verification"]}
              />
            </div>

            {/* Header */}
            <div className="mb-6 text-center lg:text-left">
              <div className="hidden lg:block mb-8 text-center">
                <AuthLogo />
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">{"Verification & Documents"}</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Upload required documents for account verification</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {/* National ID Number */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                    National ID Number (NIC) <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      type="text"
                      placeholder="200012345678 or 991234567V"
                      value={formData.nicNumber}
                      onChange={(e) => handleChange("nicNumber", e.target.value)}
                      className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#6B7280]">Enter your 12-digit new NIC or old NIC format</p>
                </div>

                {/* Upload NIC Front */}
                <FileUpload
                  label="Upload NIC Copy (Front)"
                  required
                  onFileSelect={(file) => handleChange("nicFront", file)}
                />

                {/* Upload NIC Back */}
                <FileUpload
                  label="Upload NIC Copy (Back)"
                  required
                  onFileSelect={(file) => handleChange("nicBack", file)}
                />

                {/* Professional Certificate */}
                <FileUpload
                  label="Professional Certificate (Optional)"
                  icon="certificate"
                  helpText="Any technical or repair course certificates"
                  onFileSelect={(file) => handleChange("certificate", file)}
                />

                {/* Info box */}
                <div className="rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]">
                      <Info className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#111827]">Verification Process</h4>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#374151]">
                        {"Your documents will be reviewed by the shop admin within 24-48 hours. You'll receive an email notification once your account is approved."}
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
                    id="terms-step3"
                  />
                  <label htmlFor="terms-step3" className="text-sm leading-relaxed text-[#374151]">
                    I agree to the{" "}
                    <a href="#" className="font-medium text-[#4F46E5] hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="font-medium text-[#4F46E5] hover:underline">Privacy Policy</a>
                    . I confirm that all information provided is accurate and true.
                  </label>
                </div>

                {/* Error message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onBack}
                    disabled={isLoading}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB] disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.agreeTerms}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#4F46E5] text-sm font-semibold text-white transition-colors hover:bg-[#4338CA] disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-[#4F46E5]/20"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Sign in link */}
            <div className="mt-8 pb-8 text-center">
              <p className="text-sm text-[#6B7280]">
                Already have an account?{" "}
                <a href="#" className="font-semibold text-[#111827] underline hover:text-[#4F46E5]">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
