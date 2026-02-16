'use client'

import { SignupHeader } from './signup-header'
import { AccountTypeCards } from './account-type-cards'
import { ComparisonTable } from './comparison-table'
import { SignupFooter } from './signup-footer'

export function SignupPortal() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <SignupHeader />
          
          {/* Account Type Cards */}
          <AccountTypeCards />
          
          {/* Comparison Table */}
          <ComparisonTable />
        </div>
      </div>
      
      {/* Footer */}
      <SignupFooter />
    </div>
  )
}
