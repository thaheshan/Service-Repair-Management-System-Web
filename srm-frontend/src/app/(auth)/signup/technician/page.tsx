"use client"

import { useState } from "react"
import { StepPersonalInfo, type PersonalInfoData } from "@/components/signup/registration-staff/step-personal-info"
import { StepShopDetails, type ShopDetailsData } from "@/components/signup/registration-staff/step-shop-details"
import { StepVerification, type VerificationData } from "@/components/signup/registration-staff/step-verification"
import { RegistrationSuccess } from "@/components/signup/registration-staff/registration-success"

type Step = 1 | 2 | 3 | "success"

import { useRegisterStaffMutation } from "@/services/api/authApiSlice"
import { toast } from "sonner"

export default function TechnicianRegistrationPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData | null>(null)
  const [shopDetails, setShopDetails] = useState<ShopDetailsData | null>(null)
  const [registerStaff, { isLoading }] = useRegisterStaffMutation()

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

  const handleStep3Submit = async (data: VerificationData) => {
    if (!personalInfo || !shopDetails) return

    try {
      // Note: backend expects shopId. For now we use shopName as a placeholder 
      // or we should have a way to get shopId. 
      // Assuming shopDetails has a field for shopId or we find it.
      
      const submissionData = {
        firstName: personalInfo.fullName.split(' ')[0],
        lastName: personalInfo.fullName.split(' ').slice(1).join(' ') || 'User',
        email: personalInfo.email,
        password: personalInfo.password,
        shopId: shopDetails.shopName, // This should ideally be a selected shop ID
        // other fields can be added if backend supports them
      }

      await registerStaff(submissionData).unwrap()
      
      toast.success("Staff registration request submitted!")
      setCurrentStep("success")
      window.scrollTo(0, 0)
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to register staff")
    }
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
