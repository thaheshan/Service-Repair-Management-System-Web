"use client"

import { useState } from "react"
import { StepPersonalInfo, type PersonalInfoData } from "@/components/registration/step-personal-info"
import { StepShopDetails, type ShopDetailsData } from "@/components/registration/step-shop-details"
import { StepVerification, type VerificationData } from "@/components/registration/step-verification"
import { RegistrationSuccess } from "@/components/registration/registration-success"

type Step = 1 | 2 | 3 | "success"

export default function TechnicianRegistrationPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData | null>(null)
  const [shopDetails, setShopDetails] = useState<ShopDetailsData | null>(null)

  const handleStep1Next = (data: PersonalInfoData) => {
    setPersonalInfo(data)
    setCurrentStep(2)
    window.scrollTo(0, 0)
  }

  const handleStep2Next = (data: ShopDetailsData) => {
    setShopDetails(data)
    setCurrentStep(3)
    window.scrollTo(0, 0)
  }

  const handleStep2Back = () => {
    setCurrentStep(1)
    window.scrollTo(0, 0)
  }

  const handleStep3Submit = (data: VerificationData) => {
    setCurrentStep("success")
    window.scrollTo(0, 0)
  }

  const handleStep3Back = () => {
    setCurrentStep(2)
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
        fullName: personalInfo?.fullName || "John Michael Smith",
        email: personalInfo?.email || "john.smith@example.com",
        role: "Shop Manager",
      }}
    />
  )
}
