"use client"

import { useState } from "react"
import { CreditCard, Building2, Wallet, Smartphone, Gift, Lock } from "lucide-react"
import { OrderSummary } from "./order-summary"

interface SelectPaymentMethodProps {
  onContinue: (method: string) => void
}

const paymentMethods = [
  {
    id: "payhere",
    icon: CreditCard,
    label: "PayHere (Local Gateway)",
    description: "Secure local payment via PayHere",
    badge: "Recommended",
    badgeColor: "text-amber-600 bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: "credit-card",
    icon: CreditCard,
    label: "Credit/Debit Card (Global)",
    description: "Visa, Mastercard, American Express",
    badge: "Secure",
    badgeColor: "text-[#4F46E5] bg-[#EEF2FF]",
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#4F46E5]",
  },
  {
    id: "bank-transfer",
    icon: Building2,
    label: "Bank Transfer",
    description: "Direct transfer to our business account",
    badge: "Free",
    badgeColor: "text-[#10B981] bg-[#D1FAE5]",
    iconBg: "bg-[#D1FAE5]",
    iconColor: "text-[#10B981]",
  },
]

export function SelectPaymentMethod({ onContinue }: SelectPaymentMethodProps) {
  const [selected, setSelected] = useState("")

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto p-4 lg:p-8">
      {/* Left Column */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Select Payment Method</h1>
        <p className="text-sm text-[#6B7280] mb-6">{"Choose how you'd like to pay for your repair service"}</p>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelected(method.id)}
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                selected === method.id
                  ? "border-[#4F46E5] bg-[#EEF2FF] ring-1 ring-[#4F46E5]"
                  : "border-[#E5E7EB] bg-[#FFFFFF] hover:border-[#D1D5DB]"
              }`}
            >
              <div
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected === method.id ? "border-[#4F46E5]" : "border-[#D1D5DB]"
                }`}
              >
                {selected === method.id && (
                  <div className="h-2 w-2 rounded-full bg-[#4F46E5]" />
                )}
              </div>

              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${method.iconBg}`}>
                <method.icon className={`h-5 w-5 ${method.iconColor}`} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#111827]">{method.label}</span>
                  {method.badge && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${method.badgeColor}`}>
                      {method.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">{method.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Saved Payment Methods */}
        <div className="mt-8">
          <h3 className="text-base font-bold text-[#111827] mb-1">Saved Payment Methods</h3>
          <p className="text-xs text-[#6B7280] mb-4">Use a previously saved card for faster checkout</p>

          <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="bg-gradient-to-r from-[#6366F1] to-[#A855F7] p-4 rounded-t-xl">
              <div className="flex items-center justify-between text-[#FFFFFF]">
                <span className="text-sm font-mono tracking-widest">{"•••• •••• •••• 4242"}</span>
                <span className="text-xs">12/25</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-[#FFFFFF]">
              <span className="text-xs text-[#6B7280]">Visa ending in 4242</span>
              <div className="flex items-center gap-3">
                <button className="text-xs font-semibold text-[#4F46E5] hover:underline">Use This</button>
                <button className="text-xs font-semibold text-[#EF4444] hover:underline">Remove</button>
              </div>
            </div>
          </div>
        </div>

        <button className="mt-4 text-sm font-medium text-[#4F46E5] hover:underline">
          + Add New Payment Method
        </button>

        <button
          onClick={() => onContinue(selected || "credit-card")}
          disabled={!selected}
          className="mt-6 w-full rounded-xl bg-[#4F46E5] px-6 py-3.5 text-sm font-semibold text-[#FFFFFF] hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Payment
        </button>

        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-[#9CA3AF]">
          <Lock className="h-3 w-3" />
          <span>Your payment information is secure and encrypted.</span>
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:w-[380px]">
        <OrderSummary
          planName="Single Shop Plan"
          planPrice={5400}
          quantity={1}
          showPromoInput={true}
        />
      </div>
    </div>
  )
}
