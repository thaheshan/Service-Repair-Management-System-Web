'use client'

import { useState } from 'react'
import { StepPersonalInfo, PersonalInfoData } from './step-personal-info'
import { StepShopDetails, ShopDetailsData } from './step-shop-details'
import { StepVerification, VerificationData } from './step-verification'
import { useStaffRegistrationStore } from '@/store/staffRegistrationStore'
import { post } from '@/api/client'
import { CheckCircle2, ArrowRight } from "lucide-react"

export function TechnicianRegistration() {
  const { 
    currentStep, 
    setStep, 
    personalInfo, 
    shopDetails, 
    setVerification,
    clearRegistration 
  } = useStaffRegistrationStore()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleStep1Next = () => {
    setStep(2)
  }

  const handleStep2Next = () => {
    setStep(3)
  }

  const handleStep3Submit = async (data: VerificationData) => {
    setVerification(data)
    setIsLoading(true)
    setError(null)

    try {
      // Build the payload
      const payload = {
        firstName: personalInfo.fullName?.split(" ")[0] || "",
        lastName: personalInfo.fullName?.split(" ").slice(1).join(" ") || "",
        email: personalInfo.email,
        phone: personalInfo.phone,
        password: personalInfo.password,
        shopId: shopDetails.shopId,
        shopName: shopDetails.shopName,
        companyPersonnelId: shopDetails.companyPersonnelId,
      }

      await post("/onboarding/staff-request", payload)
      // On success
      clearRegistration()
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to submit staff registration.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F9FAFB] p-4">
        <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5]">
            <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-[#111827]">Registration Successful!</h2>
          <p className="mb-8 text-[#6B7280]">
            Your account has been successfully created and linked to the shop. You can now log in to the dashboard.
          </p>
          <a
            href="/login"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#4F46E5] text-sm font-semibold text-white transition-colors hover:bg-[#4338CA]"
          >
            Go to Login
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 z-50 rounded-lg border border-[#EF4444] bg-[#FEF2F2] p-4 text-[#B91C1C] shadow-lg max-w-sm">
          <p className="text-sm font-medium">{error}</p>
          <button onClick={() => setError(null)} className="absolute top-2 right-2 text-[#991B1B] hover:text-[#7F1D1D]">&times;</button>
        </div>
      )}
      {currentStep === 1 && (
        <StepPersonalInfo onNext={handleStep1Next} />
      )}
      {currentStep === 2 && (
        <StepShopDetails
          onNext={handleStep2Next}
          onBack={() => setStep(1)}
        />
      )}
      {currentStep === 3 && (
        <StepVerification
          onSubmit={handleStep3Submit}
          onBack={() => setStep(2)}
        />
      )}
    </>
  )
}