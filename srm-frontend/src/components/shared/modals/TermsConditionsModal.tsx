"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface TermsConditionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsConditionsModal({ isOpen, onClose }: TermsConditionsModalProps) {
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
        aria-labelledby="terms-modal-title"
        className={`relative flex w-full max-w-2xl flex-col rounded-xl bg-card shadow-2xl transition-all duration-300 ${
          show ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5 sm:p-6">
          <h2 id="terms-modal-title" className="text-xl font-bold text-card-foreground">
            Terms & Conditions
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
              Welcome to our Service & Repair Management System. By accessing or using our platform, you agree to be bound by these Terms & Conditions. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">2. Account Registration</h3>
            <p className="leading-relaxed mb-2">
              You must provide accurate, complete, and current information when creating an account. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You are responsible for safeguarding the password that you use to access the service.</li>
              <li>You agree not to disclose your password to any third party.</li>
              <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">3. Acceptable Use</h3>
            <p className="leading-relaxed">
              You agree not to use the platform in any way that causes, or may cause, damage to the platform or impairment of the availability or accessibility of the platform; or in any way which is unlawful, illegal, fraudulent, or harmful.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">4. Intellectual Property</h3>
            <p className="leading-relaxed">
              The service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors. The service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">5. Limitation of Liability</h3>
            <p className="leading-relaxed">
              In no event shall we, nor our directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground mb-2">6. Changes to Terms</h3>
            <p className="leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
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
