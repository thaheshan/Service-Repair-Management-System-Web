'use client'

import { AlertCircle, CheckCircle2, Gift, MessageCircle, Phone, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface RequestPendingProps {
  onCheckStatus: () => void
  onGoHome: () => void
}

interface PendingDetail {
  label: string
  value: string
  highlight?: boolean
}

interface TimelineStep {
  number: number
  title: string
  description: string
  completed: boolean
  inProgress: boolean
}

const pendingDetails: PendingDetail[] = [
  { label: 'Request ID', value: 'REQ-2024001' },
  { label: 'Business Name', value: 'TechCorp Solutions' },
  { label: 'Owner Email', value: 'owner@techcorp.lk' },
  { label: 'Subscription Plan', value: 'Professional', highlight: true },
  { label: 'Monthly Fee', value: 'LKR 25,000 / month' },
  { label: 'Request Date', value: 'January 15, 2024' },
]

const timelineSteps: TimelineStep[] = [
  { number: 1, title: 'Account Registration Submitted', description: 'Completed on January 15, 2024', completed: true, inProgress: false },
  { number: 2, title: 'Admin Review & Approval', description: 'In Progress - Usually 1-2 business days', completed: false, inProgress: true },
  { number: 3, title: 'Payment Gateway Activation', description: 'Waiting for approval', completed: false, inProgress: false },
  { number: 4, title: 'Account Fully Activated', description: 'Ready to accept payment', completed: false, inProgress: false },
]

export function RequestPending({ onCheckStatus, onGoHome }: RequestPendingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full">
        <div className="relative px-8 pt-8">
          <div className="flex justify-end mb-6">
            <Badge className="bg-orange-100 text-orange-800 border-0">Pending Review</Badge>
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-3">Account Request Submitted</h1>
          <p className="text-center text-gray-600 text-base mb-8">Your account creation request is under review</p>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-8">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 leading-relaxed">
                We are verifying your business details and subscription plan. This typically takes 1-2 business days. We'll send you an email once your request is approved.
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Request Details</h2>
          <div className="space-y-4">
            {pendingDetails.map((detail, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                <span className="text-gray-700 font-medium">{detail.label}</span>
                {detail.highlight ? (
                  <span className="text-blue-600 font-semibold">{detail.value}</span>
                ) : (
                  <span className="text-gray-900 font-medium">{detail.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Approval Timeline</h2>
          <div className="space-y-4">
            {timelineSteps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${step.completed ? 'bg-green-500 text-white' : step.inProgress ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : step.number}
                  </div>
                  {step.number !== timelineSteps.length && (
                    <div className={`w-0.5 h-12 mt-2 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
                <div className="flex-1 py-1">
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className={`text-sm ${step.inProgress ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200 bg-blue-50">
          <h2 className="text-lg font-bold text-gray-900 mb-4">What Happens Next?</h2>
          <ul className="space-y-3">
            {['We\'ll verify your business information and subscription plan', 'Once approved, payment gateway will be activated automatically', 'You\'ll receive a confirmation email with login credentials and payment instructions', 'Demo access will be provided for 7 days to explore all features'].map((text, i) => (
              <li key={i} className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-8 py-6 border-t border-gray-200">
          <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
            <div className="flex gap-3 mb-4">
              <Gift className="w-6 h-6 text-green-600 flex-shrink-0" />
              <h3 className="font-bold text-gray-900">Free Demo Access</h3>
            </div>
            <p className="text-sm text-gray-700 mb-4">Once approved, you'll get 7 days of free demo access to explore all features before making any payment. No credit card required for demo.</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-gray-600">Request Submitted</p><p className="font-semibold text-gray-900">January 15, 2024</p></div>
              <div><p className="text-gray-600">Expected Approval</p><p className="font-semibold text-gray-900">Jan 16-17, 2024</p></div>
              <div><p className="text-gray-600">Demo Expires</p><p className="font-semibold text-gray-900">Jan 24, 2024</p></div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h2>
          <div className="space-y-3">
            <div className="flex gap-3 items-center"><Mail className="w-5 h-5 text-blue-600" /><div><p className="text-sm text-gray-600">Email</p><a href="mailto:support@srm.com" className="text-blue-600 font-medium hover:underline">support@srm.com</a></div></div>
            <div className="flex gap-3 items-center"><Phone className="w-5 h-5 text-blue-600" /><div><p className="text-sm text-gray-600">Phone</p><a href="tel:+94112345678" className="text-blue-600 font-medium hover:underline">+94 11 234 5678</a></div></div>
            <div className="flex gap-3 items-center"><MessageCircle className="w-5 h-5 text-blue-600" /><div><p className="text-sm text-gray-600">Live Chat</p><button className="text-blue-600 font-medium hover:underline">Start Chat</button></div></div>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200 space-y-3">
          <Button onClick={onCheckStatus} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base rounded-lg">
            Check Status
          </Button>
          <Button onClick={onGoHome} variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50 py-6 text-base rounded-lg">
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  )
}