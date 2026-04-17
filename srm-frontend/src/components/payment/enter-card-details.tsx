"use client"

import { useState } from "react"
import { ArrowLeft, ShieldCheck, Lock, CreditCard, Info } from "lucide-react"
import { OrderSummary } from "./order-summary"

interface EnterCardDetailsProps {
  onBack: () => void
  onPay: () => void
}

export function EnterCardDetails({ onBack, onPay }: EnterCardDetailsProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [country, setCountry] = useState("India")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [streetAddress, setStreetAddress] = useState("")
  const [saveCard, setSaveCard] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16)
    const groups = cleaned.match(/.{1,4}/g)
    return groups ? groups.join(" ") : cleaned
  }

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4)
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + " / " + cleaned.slice(2)
    }
    return cleaned
  }

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111827] mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to payment methods
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Card Form */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#111827] mb-2">Enter Card Details</h1>
          <p className="text-sm text-[#6B7280] mb-6">Complete your payment securely with credit or debit card</p>

          {/* Secure Payment Badge */}
          <div className="flex items-center gap-3 rounded-xl bg-[#EEF2FF] p-4 mb-6">
            <ShieldCheck className="h-5 w-5 text-[#4F46E5]" />
            <div>
              <p className="text-sm font-semibold text-[#111827]">Secure Payment</p>
              <p className="text-xs text-[#6B7280]">Your card details are encrypted with 256-bit SSL</p>
            </div>
          </div>

          {/* Card Number */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">Card Number</label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-[#FFFFFF]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <div className="flex h-6 w-9 items-center justify-center rounded bg-[#1A1F71] text-[4px] font-bold text-[#FFFFFF]">
                  <span className="text-[8px] font-bold italic">VISA</span>
                </div>
                <div className="flex h-6 w-9 items-center justify-center rounded bg-[#EB001B]/10">
                  <div className="flex">
                    <div className="h-3 w-3 rounded-full bg-[#EB001B] opacity-80" />
                    <div className="h-3 w-3 rounded-full bg-[#F79E1B] opacity-80 -ml-1.5" />
                  </div>
                </div>
                <div className="flex h-6 w-9 items-center justify-center rounded bg-[#006FCF]/10">
                  <CreditCard className="h-3.5 w-3.5 text-[#006FCF]" />
                </div>
              </div>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">Enter the 16-digit card number on the card</p>
          </div>

          {/* Cardholder Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">Cardholder Name</label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-[#FFFFFF]"
            />
            <p className="text-xs text-[#9CA3AF] mt-1">Enter name as it appears on your card</p>
          </div>

          {/* Expiry and CVV */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">Expiry Date</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM / YY"
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-[#FFFFFF]"
              />
            </div>
            <div className="flex-1">
              <label className="flex items-center gap-1 text-sm font-semibold text-[#111827] mb-1.5">
                CVV
                <Info className="h-3.5 w-3.5 text-[#9CA3AF]" />
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-[#FFFFFF]"
              />
            </div>
          </div>

          {/* Separator */}
          <hr className="border-[#E5E7EB] mb-6" />

          {/* Billing Address */}
          <h2 className="text-lg font-bold text-[#111827] mb-4">Billing Address</h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">Country</label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full appearance-none rounded-lg border border-[#E5E7EB] px-3 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-[#FFFFFF]"
              >
                <option>India</option>
                <option>Sri Lanka</option>
                <option>Bangladesh</option>
                <option>Pakistan</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-[#FFFFFF]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="400001"
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-[#FFFFFF]"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">Street Address</label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="123 Main Street, Apt 4B"
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-[#FFFFFF]"
            />
          </div>

          {/* Save Card */}
          <div className="mb-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="peer h-[18px] w-[18px] appearance-none rounded border-2 border-[#D1D5DB] bg-white checked:border-[#4F46E5] checked:bg-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:ring-offset-1 transition-all cursor-pointer"
                />
                <svg
                  className="pointer-events-none absolute left-[2px] top-[2px] h-[14px] w-[14px] text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l4 4 6-6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">Save this card for future purchases</p>
                <p className="text-xs text-[#6B7280] mt-0.5">Your card details will be securely stored for faster checkout next time</p>
              </div>
            </label>
          </div>

          {/* Terms */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="peer h-[18px] w-[18px] appearance-none rounded border-2 border-[#D1D5DB] bg-white checked:border-[#4F46E5] checked:bg-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:ring-offset-1 transition-all cursor-pointer"
                />
                <svg
                  className="pointer-events-none absolute left-[2px] top-[2px] h-[14px] w-[14px] text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l4 4 6-6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[#374151]">
                  I agree to the{" "}
                  <button type="button" className="font-semibold text-[#4F46E5] hover:underline">Terms & Conditions</button>
                  {" "}and{" "}
                  <button type="button" className="font-semibold text-[#4F46E5] hover:underline">Privacy Policy</button>
                </p>
              </div>
            </label>
          </div>

          {/* Test Mode Alert */}
          <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4 flex gap-3">
             <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
             <div className="text-xs text-amber-800 leading-relaxed">
                <strong>Safety Notice (Test Mode)</strong>: You are currently in our secure Sandbox environment for Sri Lanka. No real charges will be made. You can use any test card details to proceed.
             </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={onPay}
            disabled={!agreeTerms}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3.5 text-sm font-semibold text-[#FFFFFF] hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock className="h-4 w-4" />
            Pay Rs. 25
          </button>

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
              <ShieldCheck className="h-3.5 w-3.5" />
              SSL Encrypted
            </div>
            <div className="flex items-center gap-1">
              <div className="flex h-5 w-8 items-center justify-center rounded bg-[#1A1F71] text-[6px] font-bold text-[#FFFFFF]">
                <span className="text-[7px] font-bold italic">VISA</span>
              </div>
              <div className="flex h-5 w-8 items-center justify-center rounded bg-[#F3F4F6]">
                <div className="flex">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#EB001B] opacity-80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#F79E1B] opacity-80 -ml-1" />
                </div>
              </div>
              <div className="flex h-5 w-8 items-center justify-center rounded bg-[#F3F4F6]">
                <CreditCard className="h-3 w-3 text-[#006FCF]" />
              </div>
            </div>
            <span className="text-xs text-[#9CA3AF]">PCI DSS</span>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-[380px]">
          <OrderSummary
            planName="Shop Registration"
            planPrice={25}
            quantity={1}
            discount={0}
            showPromoInput={false}
            showPaymentMethod={true}
            showNeedHelp={true}
            showSecurityNote={true}
          />
        </div>
      </div>
    </div>
  )
}
