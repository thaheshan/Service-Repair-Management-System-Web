"use client"

import { useState } from "react"
import { Store, ArrowLeft, CheckCircle2, Loader2, UserCog, Wrench } from "lucide-react"
import { RegistrationStepper } from "./registration-stepper"
import { SidePanelStep2 } from "./side-panel-step2"


interface StepShopDetailsProps {
  onNext: (data: ShopDetailsData) => void
  onBack: () => void
}

export interface ShopDetailsData {
  shopId: string        // the shopCode (e.g. "SHOP-ABC123")
  role: "TECHNICIAN" | "MANAGER"
}

export function StepShopDetails({ onNext, onBack }: StepShopDetailsProps) {
  const [shopId, setShopId] = useState("")
  const [role, setRole] = useState<"TECHNICIAN" | "MANAGER">("TECHNICIAN")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)
  const [validShop, setValidShop] = useState<string | null>(null) // shop name after successful validation

  const validateShopIdWithBackend = async (id: string) => {
    if (!id.trim()) return
    setIsValidating(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/v1/staff/validate-shop-id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_id: id.trim() }),
      })
      if (res.ok) {
        const data = await res.json()
        setValidShop(data?.data?.shop_id || id.trim())
        setErrors(prev => { const e = { ...prev }; delete e.shopId; return e })
      } else {
        const data = await res.json()
        setValidShop(null)
        setErrors(prev => ({ ...prev, shopId: data?.message || "Invalid Shop ID. Please check and try again." }))
      }
    } catch {
      setValidShop(null)
      setErrors(prev => ({ ...prev, shopId: "Unable to verify Shop ID. Check your connection." }))
    } finally {
      setIsValidating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!shopId.trim()) errs.shopId = "Shop ID is required."
    else if (!validShop) errs.shopId = "Please verify your Shop ID first."
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      onNext({ shopId: shopId.trim(), role })
    }
  }

  const hasError = (field: string) => !!errors[field]

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Left side panel */}
      <div className="hidden lg:block lg:w-[480px] shrink-0">
        <div className="lg:sticky lg:top-0 h-full lg:h-screen">
          <SidePanelStep2 />
        </div>
      </div>

      {/* Right side form */}
      <div className="flex flex-1 flex-col bg-white overflow-y-auto">
        <div className="px-6 pt-6 lg:px-16">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 pt-16 pb-6 lg:px-16 lg:pt-24 lg:pb-12">
          <div className="w-full max-w-[520px]">
            <div className="mb-8">
              <RegistrationStepper
                currentStep={2}
                steps={["Personal Info", "Shop Details", "Verification"]}
              />
            </div>

            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-[#111827]">Join Your Shop</h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                Enter the Shop ID provided by your shop owner to link your account
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 flex flex-col gap-6">

                {/* Shop ID */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
                    Shop ID <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                      <input
                        type="text"
                        placeholder="e.g. SHOP-ABC123"
                        value={shopId}
                        onChange={(e) => {
                          setShopId(e.target.value)
                          setValidShop(null)
                          setErrors(prev => { const er = { ...prev }; delete er.shopId; return er })
                        }}
                        className={`h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all focus:ring-2 ${
                          hasError("shopId")
                            ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
                            : validShop
                            ? "border-[#10B981] focus:border-[#10B981] focus:ring-[#10B981]/20"
                            : "border-[#E5E7EB] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20"
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => validateShopIdWithBackend(shopId)}
                      disabled={isValidating || !shopId.trim()}
                      className="flex h-11 items-center gap-1.5 rounded-lg bg-[#4F46E5] px-4 text-sm font-semibold text-white hover:bg-[#4338CA] disabled:opacity-50 focus:outline-none shrink-0"
                    >
                      {isValidating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Verify"
                      )}
                    </button>
                  </div>

                  {validShop && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Shop verified! You're joining: <strong>{validShop}</strong>
                    </div>
                  )}
                  {hasError("shopId") && (
                    <p className="mt-1 text-xs text-[#EF4444]">{errors.shopId}</p>
                  )}
                  {!validShop && !hasError("shopId") && (
                    <p className="mt-1 text-xs text-[#9CA3AF]">
                      Ask your shop owner for the Shop ID shown in their dashboard
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#111827]">
                    Your Role <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { value: "TECHNICIAN", label: "Technician", icon: Wrench, desc: "Repair & service tasks" },
                      { value: "MANAGER", label: "Manager", icon: UserCog, desc: "Manage shop operations" },
                    ] as const).map(({ value, label, icon: Icon, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRole(value)}
                        className={`flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-all focus:outline-none ${
                          role === value
                            ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]"
                            : "border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${role === value ? "text-[#4F46E5]" : "text-[#9CA3AF]"}`} />
                        <span className="text-sm font-semibold">{label}</span>
                        <span className="text-xs text-[#6B7280]">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Info box */}
              <div className="mt-5 rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] px-4 py-3">
                <p className="text-xs leading-relaxed text-[#374151]">
                  <strong>How to get your Shop ID:</strong> Ask your shop owner or manager to share the
                  Shop ID visible in their admin dashboard header. It looks like <code className="font-mono bg-white/60 px-1 rounded">SHOP-XXXXXX</code>.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </button>
                <button
                  type="submit"
                  className="flex h-12 flex-1 items-center justify-center rounded-lg bg-[#4F46E5] text-sm font-semibold text-white transition-colors hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:ring-offset-2"
                >
                  Continue
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
