'use client'

import { AlertCircle, CheckCircle2, Gift, MessageCircle, Phone, Mail, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface RequestSuccessfulProps {
  onProceedToPayment: () => void
  onStartDemo: () => void
}

interface SuccessDetail {
  label: string
  value: string
  highlight?: boolean
}

const accountDetails: SuccessDetail[] = [
  { label: 'Account Status', value: 'Active', highlight: true },
  { label: 'Business Name', value: 'Tech Solutions Lanka' },
  { label: 'Owner Email', value: 'owner@techsolutions.lk' },
  { label: 'Contact Number', value: '+94 77 123 4567' },
  { label: 'Subscription Plan', value: 'Enterprise', highlight: true },
  { label: 'Monthly Subscription Fee', value: 'LKR 15,000' },
  { label: 'Approval Date', value: 'March 2, 2026' },
  { label: 'Gateway Status', value: 'Activated', highlight: true },
]

export function RequestSuccessful({ onProceedToPayment, onStartDemo }: RequestSuccessfulProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full">
        <div className="relative px-8 pt-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-3">Request Approved!</h1>
          <p className="text-center text-gray-600 text-base mb-8">Your account is now active and ready to use</p>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-8">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 leading-relaxed font-medium">
                Your account has been approved and activated. Demo access and payment gateway are now ready. Check your email for confirmation details and login credentials.
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Account Details</h2>
          <div className="space-y-3">
            {accountDetails.map((detail, idx) => (
              <div key={idx} className="flex justify-between items-center py-2">
                <span className="text-gray-700">{detail.label}</span>
                <div className="flex items-center gap-2">
                  {detail.highlight && detail.label === 'Account Status' && <Badge className="bg-green-100 text-green-800 border-0">Active</Badge>}
                  {detail.highlight && detail.label === 'Subscription Plan' && <Badge className="bg-green-100 text-green-800 border-0">{detail.value}</Badge>}
                  {detail.highlight && detail.label === 'Gateway Status' && <Badge className="bg-green-100 text-green-800 border-0">{detail.value}</Badge>}
                  {!detail.highlight && <span className="text-gray-900 font-medium">{detail.value}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800 mb-1">Important:</p>
                <p className="text-sm text-yellow-700">Your demo access will expire on March 9, 2026. You must complete payment before this date to maintain uninterrupted service.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex gap-3 items-start">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Confirmation email sent</h3>
                <p className="text-sm text-gray-700">We've sent your account details, login credentials, and payment instructions to owner@techsolutions.lk.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex gap-3 items-center"><Mail className="w-5 h-5 text-blue-600" /><div><p className="text-sm text-gray-600">Email</p><a href="mailto:support@srm.com" className="text-blue-600 font-medium text-sm hover:underline">support@srm.com</a></div></div>
            <div className="flex gap-3 items-center"><Phone className="w-5 h-5 text-blue-600" /><div><p className="text-sm text-gray-600">Phone</p><a href="tel:+94112345678" className="text-blue-600 font-medium text-sm hover:underline">+94 11 234 5678</a></div></div>
            <div className="flex gap-3 items-center"><MessageCircle className="w-5 h-5 text-blue-600" /><div><p className="text-sm text-gray-600">Live Chat</p><button className="text-blue-600 font-medium text-sm hover:underline">Start Chat</button></div></div>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200 space-y-3">
          <Button onClick={onProceedToPayment} className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base rounded-lg">
            Proceed to Payment
          </Button>
          <Button onClick={onStartDemo} variant="outline" className="w-full text-green-600 border-green-600 hover:bg-green-50 py-6 text-base rounded-lg">
            Start Demo Access
          </Button>
        </div>

        <div className="px-8 py-4 border-t border-gray-200 text-center">
          <a href="#" className="text-blue-600 text-sm hover:underline flex items-center justify-center gap-1">
            View Documentation & Help <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="px-8 py-6 border-t border-gray-200 text-center bg-gray-50 rounded-b-2xl">
          <p className="text-gray-600 text-sm mb-3">Have questions? Our support team is here to help</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a href="mailto:support@srm.com" className="text-blue-600 text-sm hover:underline flex items-center gap-1"><Mail className="w-4 h-4" /> support@srm.com</a>
            <a href="tel:+94112345678" className="text-blue-600 text-sm hover:underline flex items-center gap-1"><Phone className="w-4 h-4" /> +94 11 234 5678</a>
            <button className="text-blue-600 text-sm hover:underline flex items-center gap-1"><MessageCircle className="w-4 h-4" /> Live Chat</button>
          </div>
        </div>
      </div>
    </div>
  )
}