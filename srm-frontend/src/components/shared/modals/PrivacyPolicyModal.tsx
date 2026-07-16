"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  const [show, setShow] = useState(isOpen)
  const [render, setRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setRender(true)
      // Small delay to ensure the element is in the DOM before animating opacity
      const timer = setTimeout(() => setShow(true), 10)
      
      // Prevent background scrolling and layout shift from scrollbar disappearing
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.body.style.overflow = "hidden" 
      
      return () => clearTimeout(timer)
    } else {
      setShow(false)
      // Wait for animation to finish before removing from DOM
      const timer = setTimeout(() => {
        setRender(false)
        document.body.style.paddingRight = ""
        document.body.style.overflow = "unset"
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.paddingRight = ""
      document.body.style.overflow = "unset"
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!render) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        className={`relative flex w-full max-w-2xl flex-col rounded-xl bg-card shadow-2xl transition-all duration-300 ${
          show ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5 sm:p-6">
          <h2 id="privacy-modal-title" className="text-xl font-bold text-card-foreground">
            Privacy Policy
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6 text-sm text-muted-foreground space-y-6">
          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">1. Introduction</h3>
            <p className="leading-relaxed">
              We respect your privacy and are committed to protecting it through our compliance with this privacy policy. This policy describes the types of information we may collect from you or that you may provide when you visit our platform, and our practices for collecting, using, maintaining, protecting, and disclosing that information.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">2. Information We Collect</h3>
            <p className="leading-relaxed mb-2">
              We collect several types of information from and about users of our platform, including information:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>By which you may be personally identified, such as name, postal address, e-mail address, telephone number.</li>
              <li>That is about you but individually does not identify you, such as anonymous usage data.</li>
              <li>About your internet connection, the equipment you use to access our Website, and usage details.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">3. How We Use Your Information</h3>
            <p className="leading-relaxed">
              We use information that we collect about you or that you provide to us, including any personal information: to present our platform and its contents to you; to provide you with information, products, or services that you request from us; to fulfill any other purpose for which you provide it; to carry out our obligations and enforce our rights arising from any contracts entered into between you and us.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">4. Disclosure of Your Information</h3>
            <p className="leading-relaxed">
              We may disclose aggregated information about our users, and information that does not identify any individual, without restriction. We may disclose personal information that we collect or you provide as described in this privacy policy to our subsidiaries, affiliates, contractors, service providers, and other third parties we use to support our business.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">5. Data Security</h3>
            <p className="leading-relaxed">
              We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. Unfortunately, the transmission of information via the internet is not completely secure, and we cannot guarantee the security of your personal information transmitted to our platform.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">6. Contact Information</h3>
            <p className="leading-relaxed">
              To ask questions or comment about this privacy policy and our privacy practices, contact us via the provided support channels.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/50 p-5 sm:p-6 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}
