'use client'

import { XCircle, ArrowLeft, Mail } from 'lucide-react'

interface RequestRejectedProps {
  onGoHome: () => void
  onContactSupport?: () => void
  onTryAgain: () => void
}

export function RequestRejected({ onGoHome, onContactSupport, onTryAgain }: RequestRejectedProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-red-50 p-6">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100">
          {/* Red header band */}
          <div className="bg-gradient-to-r from-rose-500 to-red-600 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Registration Rejected</h1>
            <p className="text-rose-100 text-sm">Your registration request was not approved</p>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-6">
              <p className="text-rose-800 text-sm font-medium mb-1">What does this mean?</p>
              <p className="text-rose-700 text-sm leading-relaxed">
                After reviewing your registration request, our team was unable to approve your account at this time. 
                This may be due to incomplete information, unverifiable business details, or other eligibility requirements.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <p className="text-gray-700 text-sm font-semibold">What you can do next:</p>
              {[
                'Check that your business registration number (BRN) is valid and correct.',
                'Ensure all the business details you provided are accurate.',
                'Contact our support team for more details on why your request was rejected.',
                'You are welcome to submit a new registration with corrected information.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-gray-600 text-sm">{step}</p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Go to Homepage
              </button>
              {onContactSupport && (
                <button
                  onClick={onContactSupport}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium transition-all text-sm shadow-lg shadow-rose-500/20"
                >
                  <Mail className="w-4 h-4" />
                  Contact Support
                </button>
              )}
              <button
                onClick={onTryAgain}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Need help? Email us at <span className="text-rose-500 font-medium">support@allfix.space</span>
        </p>
      </div>
    </div>
  )
}
