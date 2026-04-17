"use client"

import { useState } from "react"
import { StepPersonalInfo, type PersonalInfoData } from "@/components/signup/registration-staff/step-personal-info"
import { StepShopDetails, type ShopDetailsData } from "@/components/signup/registration-staff/step-shop-details"
import { StepVerification, type VerificationData } from "@/components/signup/registration-staff/step-verification"
import { RegistrationSuccess } from "@/components/signup/registration-staff/registration-success"
import { useStaffRegistrationStore } from "@/store/staffRegistrationStore"

type Step = 1 | 2 | 3 | "success"

export default function TechnicianRegistrationPage() {
  const { 
    currentStep, 
    setStep, 
    personalInfo, 
    shopDetails, 
    registerStaff, 
    isLoading, 
    error 
  } = useStaffRegistrationStore()

  const handleStep1Next = (data: PersonalInfoData) => {
    setStep(2)
    window.scrollTo(0, 0)
  }

  const handleStep2Next = (data: ShopDetailsData) => {
    setStep(3)
    window.scrollTo(0, 0)
  }

  const handleStep2Back = () => {
    setStep(1)
    window.scrollTo(0, 0)
  }

  const handleStep3Submit = async (data: VerificationData) => {
    try {
      await registerStaff()
      setStep(4) // Custom step for success
      window.scrollTo(0, 0)
    } catch (err) {
      // Error is handled in the store and can be displayed in StepVerification
    }
  }

  const handleStep3Back = () => {
    setStep(2)
    window.scrollTo(0, 0)
  }

  if (currentStep === 1) {
    return <StepPersonalInfo onNext={handleStep1Next} />
  }

  if (currentStep === 2) {
    return <StepShopDetails onNext={handleStep2Next} onBack={handleStep2Back} />
  }

  if (currentStep === 3) {
    return <StepVerification onSubmit={handleStep3Submit} onBack={handleStep3Back} />
  }

  return (
    <RegistrationSuccess
      userData={{
        fullName: (personalInfo as any)?.fullName || "Team Member",
        email: personalInfo?.email || "",
        role: "Technician",
      }}
    />
  )
}
