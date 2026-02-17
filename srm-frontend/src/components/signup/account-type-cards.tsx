'use client'

import { AccountCard } from './account-card'

export function AccountTypeCards() {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-20">
      
      {/* Admin Card */}
      <AccountCard
        title="Admin/Manager"
        description="Full system access and business management"
        color="indigo"
        buttonText="Sign up as Admin"
        link="/signup/admin"
        features={[
          'Manage all repairs and staff',
          'Access analytics and reports',
          'Configure system settings',
          'Manage inventory and pricing',
          'Full customer management',
        ]}
      />

      {/* Technician Card */}
      <AccountCard
        title="Staff/Technician"
        description="Manage assigned repairs and tasks"
        color="orange"
        buttonText="Sign up as Staff"
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
        link="/signup/shop"
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
