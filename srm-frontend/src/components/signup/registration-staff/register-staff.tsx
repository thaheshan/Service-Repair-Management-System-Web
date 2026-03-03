'use client'

import { useState } from 'react'
import { StepPersonalInfo, PersonalInfoData } from './step-personal-info'
import { StepShopDetails, ShopDetailsData } from './step-shop-details'
import { StepVerification, VerificationData } from './step-verification'

type AllData = {
  personalInfo?: PersonalInfoData
  shopDetails?: ShopDetailsData
  verification?: VerificationData
}

export function TechnicianRegistration() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<AllData>({})

  const handleStep1Next = (data: PersonalInfoData) => {
    setFormData(prev => ({ ...prev, personalInfo: data }))
    setStep(2)
  }

  const handleStep2Next = (data: ShopDetailsData) => {
    setFormData(prev => ({ ...prev, shopDetails: data }))
    setStep(3)
  }

  const handleStep3Submit = (data: VerificationData) => {
    const finalData = { ...formData, verification: data }
    console.log('Final registration data:', finalData)
    // TODO: call your API here
  }

  return (
    <>
      {step === 1 && (
        <StepPersonalInfo onNext={handleStep1Next} />
      )}
      {step === 2 && (
        <StepShopDetails
          onNext={handleStep2Next}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <StepVerification
          onSubmit={handleStep3Submit}
          onBack={() => setStep(2)}
        />
      )}
    </>
  )
}