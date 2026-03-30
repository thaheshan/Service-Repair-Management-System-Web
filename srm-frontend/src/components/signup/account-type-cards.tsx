'use client'

import { AccountCard } from './account-card'

export function AccountTypeCards() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 mb-20 max-w-4xl mx-auto">
      
      {/* Technician/Staff Card */}
      <AccountCard
        title="Staff/Manager"
        description="Manage assigned repairs and tasks"
        color="orange"
        buttonText="Sign up as Member"
        link="/signup/technician"
        features={[
          'View assigned repairs',
          'Update repair status',
          'Track work hours',
          'Access repair notes',
          'View personal schedule',
        ]}
      />

      {/* Shop Owner Card */}
      <AccountCard
        title="Shop Owner"
        description="Register your repair shop business"
        color="emerald"
        buttonText="Sign up as Shop"
        link="/shop"
        features={[
          'Multi-location support',
          'Brand customization',
          'Business analytics',
          'Billing and invoicing',
          'Customer portal access',
        ]}
      />
      
    </div>
  )
}
