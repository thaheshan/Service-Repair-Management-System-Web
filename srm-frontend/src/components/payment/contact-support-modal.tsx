"use client"

import { useState } from "react"
import { X, Headphones, Mail, MessageCircle, Phone, CheckCircle2 } from "lucide-react"

interface ContactSupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactSupportModal({ isOpen, onClose }: ContactSupportModalProps) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return
    // Simulate submission
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setSubject("")
      setMessage("")
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          /* Success State */
          <div className="flex flex-col items-center text-center py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5] mb-4">
              <CheckCircle2 className="h-9 w-9 text-[#10B981]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827] mb-2">Message Sent!</h2>
            <p className="text-sm text-[#6B7280]">
              Our support team will get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF2FF] mb-3">
                <Headphones className="h-7 w-7 text-[#4F46E5]" />
              </div>
              <h2 className="text-xl font-bold text-[#111827]">Contact Support</h2>
              <p className="text-sm text-[#6B7280] mt-1">
                We&apos;re here to help. Send us a message and we&apos;ll respond shortly.
              </p>
            </div>

            {/* Quick Contact Options */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Mail, label: "Email", value: "support@repairshop.lk" },
                { icon: Phone, label: "Phone", value: "+94 11 234 5678" },
                { icon: MessageCircle, label: "Live Chat", value: "Available 9AM–6PM" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-[#E5E7EB] p-3 text-center"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF]">
                    <Icon className="h-4 w-4 text-[#4F46E5]" />
                  </div>
                  <p className="text-[11px] font-bold text-[#111827]">{label}</p>
                  <p className="text-[10px] text-[#6B7280] leading-tight">{value}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-[1px] flex-1 bg-[#E5E7EB]" />
              <span className="text-xs font-medium text-[#9CA3AF]">or send us a message</span>
              <div className="h-[1px] flex-1 bg-[#E5E7EB]" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  Subject <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] bg-white transition-all"
                >
                  <option value="">Select a topic…</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="account">Account Access</option>
                  <option value="technical">Technical Issue</option>
                  <option value="refund">Refund Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  Message <span className="text-[#EF4444]">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail…"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] bg-white transition-all"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-11 rounded-xl border border-[#4F46E5] text-[#4F46E5] text-sm font-semibold hover:bg-[#EEF2FF] transition-colors focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!subject || !message.trim()}
                  className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white text-sm font-semibold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  )
}
