"use client"

import { useState } from "react"
import { StepPersonalInfo, type PersonalInfoData } from "@/components/signup/registration-staff/step-personal-info"
import { StepShopDetails, type ShopDetailsData } from "@/components/signup/registration-staff/step-shop-details"
import { RegistrationSuccess } from "@/components/signup/registration-staff/registration-success"
import { useRegisterStaffMutation } from "@/services/api/authApiSlice"
import { toast } from "sonner"

type Step = 1 | 2 | "success"

export default function TechnicianRegistrationPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData | null>(null)
  const [registerStaff, { isLoading }] = useRegisterStaffMutation()

  const handleStep1Next = (data: PersonalInfoData) => {
    setPersonalInfo(data)
    setCurrentStep(2)
    window.scrollTo(0, 0)
  }

  const handleStep2Next = async (data: ShopDetailsData) => {
    if (!personalInfo) return

    try {
      // Build the phone number with country code
      const fullPhone = `${personalInfo.phoneCode}${personalInfo.phone.replace(/\s/g, "")}`

      // Send exactly what the backend expects
      await registerStaff({
        full_name: personalInfo.fullName,
        phone: fullPhone,
        password: personalInfo.password,
        shop_id: data.shopId,
        role: data.role,
      }).unwrap()

      toast.success("Account created successfully! You can now log in.")
      setCurrentStep("success")
      window.scrollTo(0, 0)
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Registration failed. Please check your details and try again."
      toast.error(message)
    }
  }

  const handleStep2Back = () => {
    setCurrentStep(1)
    window.scrollTo(0, 0)
  }

  if (currentStep === 1) {
    return <StepPersonalInfo onNext={handleStep1Next} />
  }

  if (currentStep === 2) {
    return <StepShopDetails onNext={handleStep2Next} onBack={handleStep2Back} />
  }

  return (
    <RegistrationSuccess
      userData={{
        fullName: personalInfo?.fullName || "",
        email: personalInfo?.email || personalInfo?.phone || "",
        role: "Staff Member",
      }}
    />
  )
}
