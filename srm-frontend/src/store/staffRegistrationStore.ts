import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { post } from '@/api/client'

export interface PersonalInfoData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password?: string
  confirmPassword?: string
}

export interface ShopDetailsData {
  shopId: string
  shopName: string
  companyPersonnelId: string
  shopLocation: string
  branchOutlet: string
  shopManagerEmail: string
  reasonForJoining: string
  agreeTerms: boolean
}

export interface VerificationData {
  method: "email" | "phone"
  code: string
}

interface StaffRegistrationState {
  currentStep: number
  personalInfo: Partial<PersonalInfoData>
  shopDetails: Partial<ShopDetailsData>
  verification: Partial<VerificationData>
  isLoading: boolean
  error: string | null
  
  setStep: (step: number) => void
  setPersonalInfo: (data: Partial<PersonalInfoData>) => void
  setShopDetails: (data: Partial<ShopDetailsData>) => void
  setVerification: (data: Partial<VerificationData>) => void
  registerStaff: () => Promise<void>
  clearRegistration: () => void
}

export const useStaffRegistrationStore = create<StaffRegistrationState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      personalInfo: {},
      shopDetails: { agreeTerms: false },
      verification: {},
      isLoading: false,
      error: null,
      
      setStep: (step) => set({ currentStep: step }),
      setPersonalInfo: (data) => set((state) => ({ personalInfo: { ...state.personalInfo, ...data } })),
      setShopDetails: (data) => set((state) => ({ shopDetails: { ...state.shopDetails, ...data } })),
      setVerification: (data) => set((state) => ({ verification: { ...state.verification, ...data } })),

      registerStaff: async () => {
        const { personalInfo, shopDetails } = get();
        set({ isLoading: true, error: null });

        try {
          // Validate required fields
          if (!personalInfo.email || !personalInfo.password || !shopDetails.shopId) {
            throw new Error("Missing required registration information.");
          }

          // Split fullName into firstName and lastName
          const nameParts = (personalInfo as any).fullName?.trim().split(" ") || [];
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          const payload = {
            firstName,
            lastName,
            email: personalInfo.email.trim().toLowerCase(),
            password: personalInfo.password,
            shopId: shopDetails.shopId,
            phone: `${(personalInfo as any).phoneCode || ""}${personalInfo.phone || ""}`,
            shopName: shopDetails.shopName,
            managerEmail: shopDetails.shopManagerEmail,
          };

          await post("/onboarding/staff-request", payload);
          set({ isLoading: false });
        } catch (err: any) {
          const msg = err.message || "Staff registration failed. Please try again.";
          set({ error: msg, isLoading: false });
          throw err;
        }
      },
      
      clearRegistration: () => set({ 
        currentStep: 1, 
        personalInfo: {}, 
        shopDetails: { agreeTerms: false }, 
        verification: {} 
      }),
    }),
    {
      name: 'staff-registration-storage', // Key used in localStorage
    }
  )
)
