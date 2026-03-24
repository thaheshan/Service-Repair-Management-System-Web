"use client"

import { CheckCircle2, Gift, Mail, ArrowRight, Headphones } from "lucide-react"

interface PaymentSuccessProps {
  handleLogin: () => void
}

export function PaymentSuccess({ handleLogin }: PaymentSuccessProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-12 px-4 bg-[#FFFFFF]">
      {/* Success Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#10B981] mb-4">
        <CheckCircle2 className="h-12 w-12 text-[#10B981]" />
      </div>

      <h1 className="text-3xl lg:text-4xl font-bold text-[#10B981] mb-8 text-balance text-center">
        Payment Successful!
      </h1>

      {/* Trial Card */}
      <div className="w-full max-w-lg rounded-xl border-2 border-[#10B981]/30 bg-[#FFFFFF] p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="h-5 w-5 text-[#10B981]" />
          <h3 className="text-lg font-bold text-[#111827]">Your 30-Day Trial Starts Now</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B7280]">Plan</span>
            <span className="text-sm font-semibold text-[#111827]">Professional</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B7280]">Trial Ends</span>
            <span className="text-sm font-semibold text-[#111827]">February 19, 2026</span>
          </div>
          <hr className="border-[#E5E7EB]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B7280]">First Payment</span>
            <span className="text-sm font-bold text-[#10B981]">Rs. 25,000</span>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="w-full max-w-lg rounded-xl bg-[#F9FAFB] p-6 mb-8">
        <h3 className="text-base font-bold text-[#111827] mb-3">Account Information</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280]">Shop ID:</span>
            <span className="text-sm font-medium text-[#111827]">SHOP-000001</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280]">Email:</span>
            <span className="text-sm font-semibold text-[#111827]">john@abchardware.lk</span>
          </div>
        </div>
        <hr className="border-[#E5E7EB] my-3" />
        <div className="flex items-center gap-2 text-[#10B981]">
          <Mail className="h-4 w-4" />
          <span className="text-sm font-medium">Confirmation email sent to your inbox</span>
        </div>
      </div>

      {/* What's Next? */}
      <div className="w-full max-w-lg mb-8">
        <h3 className="text-lg font-bold text-[#111827] text-center mb-5">{"What's Next?"}</h3>
        <div className="space-y-4">
          {[
            { step: 1, text: "Set up your shop profile and inventory" },
            { step: 2, text: "Import existing products or add new items" },
            { step: 3, text: "Start managing sales and tracking inventory" },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-sm font-bold text-[#FFFFFF]">
                {item.step}
              </div>
              <p className="text-sm text-[#374151]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Go to Dashboard Button */}
      <button
        onClick={handleLogin}
        className="w-full max-w-lg flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-4 text-sm font-semibold text-[#FFFFFF] hover:bg-[#4338CA] transition-colors"
      >
        Back to Login
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-4 text-sm text-[#9CA3AF]">Need help?</p>
      <button className="flex items-center gap-1.5 text-sm font-medium text-[#4F46E5] hover:underline mt-1">
        <Headphones className="h-4 w-4" />
        Contact Support
      </button>
    </div>
  )
}
