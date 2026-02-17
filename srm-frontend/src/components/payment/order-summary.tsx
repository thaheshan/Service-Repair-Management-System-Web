"use client"

import { useState } from "react"
import { Lock, CreditCard, Headphones, Phone, Mail, ShieldCheck } from "lucide-react"

interface OrderSummaryProps {
  planName?: string
  planPrice?: number
  quantity?: number
  shipping?: number
  tax?: number
  discount?: number
  discountCode?: string
  showPromoInput?: boolean
  showPaymentMethod?: boolean
  showNeedHelp?: boolean
  showSecurityNote?: boolean
  showWhatHappensNext?: boolean
  onApplyPromo?: (code: string) => void
}

export function OrderSummary({
  planName = "Single Shop Plan",
  planPrice = 5400,
  quantity = 1,
  shipping,
  tax,
  discount,
  discountCode,
  showPromoInput = true,
  showPaymentMethod = false,
  showNeedHelp = false,
  showSecurityNote = false,
  showWhatHappensNext = false,
  onApplyPromo,
}: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState("")
  const [appliedCode, setAppliedCode] = useState(discountCode || "")

  const subtotal = planPrice * quantity
  const shippingAmount = shipping || 0
  const taxAmount = tax || 0
  const discountAmount = discount || 0
  const total = subtotal + shippingAmount + taxAmount - discountAmount

  const handleApply = () => {
    if (promoCode.trim()) {
      setAppliedCode(promoCode.toUpperCase())
      onApplyPromo?.(promoCode)
    }
  }

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6">
      <h3 className="text-lg font-bold text-[#111827] mb-4">Order Summary</h3>

      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
          <CreditCard className="h-5 w-5 text-[#4F46E5]" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#111827] text-sm">{planName}</p>
          <p className="text-xs text-[#6B7280]">{"Qty: " + quantity}</p>
        </div>
        <p className="font-semibold text-[#111827] text-sm">{"Rs. " + planPrice.toLocaleString()}</p>
      </div>

      <div className="border-t border-[#E5E7EB] pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#6B7280]">Subtotal</span>
          <span className="text-sm font-medium text-[#111827]">{"Rs. " + subtotal.toLocaleString()}</span>
        </div>

        {shipping !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B7280]">Shipping</span>
            <span className="text-sm font-medium text-[#111827]">{"Rs. " + shippingAmount.toLocaleString()}</span>
          </div>
        )}

        {tax !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B7280]">{"Tax (10%)"}</span>
            <span className="text-sm font-medium text-[#111827]">{"Rs. " + taxAmount.toLocaleString()}</span>
          </div>
        )}

        {appliedCode && discountAmount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#10B981]">{"Discount (" + appliedCode + ")"}</span>
            <span className="text-sm font-medium text-[#10B981]">{"-Rs. " + discountAmount.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="border-t border-[#E5E7EB] mt-4 pt-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#111827]">Total Amount</span>
          <span className="text-2xl font-bold text-[#10B981]">{"Rs. " + total.toLocaleString()}</span>
        </div>
      </div>

      {showPromoInput && (
        <div className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] bg-[#FFFFFF]"
            />
            <button
              onClick={handleApply}
              className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#F3F4F6] bg-[#FFFFFF] transition-colors"
            >
              Apply
            </button>
          </div>
          {appliedCode && (
            <p className="mt-2 text-xs text-[#10B981] flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              {"Code: " + appliedCode + " - Save Rs. " + discountAmount.toLocaleString()}
            </p>
          )}
        </div>
      )}

      {showPaymentMethod && (
        <div className="mt-4">
          <p className="text-xs text-[#6B7280] mb-2">Payment Method</p>
          <div className="flex items-center gap-2 rounded-lg bg-[#EEF2FF] px-3 py-2.5">
            <CreditCard className="h-4 w-4 text-[#4F46E5]" />
            <span className="text-sm font-medium text-[#111827]">Credit/Debit Card</span>
          </div>
        </div>
      )}

      {showWhatHappensNext && (
        <div className="mt-6">
          <h4 className="font-bold text-[#111827] text-sm mb-4">{"What Happens Next?"}</h4>
          <div className="space-y-4">
            {[
              { step: 1, title: "Transfer Payment", desc: "Complete bank transfer using details above" },
              { step: 2, title: "Verification", desc: "We verify your payment (2-4 hours)" },
              { step: 3, title: "Confirmation", desc: "Receive email confirmation & invoice" },
              { step: 4, title: "Order Processing", desc: "Your repair service begins" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#FFFFFF] ${
                    item.step === 1 ? "bg-[#4F46E5]" : "bg-[#D1D5DB]"
                  }`}
                >
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{item.title}</p>
                  <p className="text-xs text-[#6B7280]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showNeedHelp && (
        <div className="mt-4 rounded-lg bg-[#F9FAFB] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Headphones className="h-4 w-4 text-[#6B7280]" />
            <span className="text-sm font-bold text-[#111827]">{"Need Help?"}</span>
          </div>
          <p className="text-xs text-[#6B7280] mb-2">Contact our support team if you have any questions</p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-xs font-medium text-[#4F46E5] hover:underline">
              <Phone className="h-3 w-3" /> Call Us
            </button>
            <button className="flex items-center gap-1 text-xs font-medium text-[#4F46E5] hover:underline">
              <Mail className="h-3 w-3" /> Email
            </button>
          </div>
        </div>
      )}

      {showSecurityNote && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#F9FAFB] p-3">
          <Lock className="h-4 w-4 text-[#6B7280] mt-0.5 shrink-0" />
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Your payment information is secure and encrypted with industry-standard 256-bit SSL encryption.
          </p>
        </div>
      )}
    </div>
  )
}
