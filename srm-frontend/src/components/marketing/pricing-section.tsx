'use client';

import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'LKR 2,999',
    description: 'Perfect for small repair shops',
    features: [
      'Up to 10 repair orders/month',
      '1 technician account',
      'Basic customer management',
      'Mobile app access',
      'Email support'
    ],
    featured: false
  },
  {
    name: 'Professional',
    price: 'LKR 6,999',
    description: 'Most popular for growing shops',
    features: [
      'Unlimited repair orders',
      'Up to 10 technician accounts',
      'Advanced customer management',
      'Revenue analytics',
      'Smart scheduling',
      'Priority support',
      'Custom reports'
    ],
    featured: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large repair operations',
    features: [
      'Everything in Professional',
      'Unlimited technician accounts',
      'Multi-branch management',
      'API access',
      'Custom integrations',
      '24/7 dedicated support',
      'Training & onboarding'
    ],
    featured: false
  }
];

export default function PricingSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600">Choose the plan that fits your business needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl p-8 transition transform ${
                plan.featured
                  ? 'bg-gradient-to-b from-purple-600 to-purple-700 text-white shadow-xl scale-105'
                  : 'bg-gray-50 text-gray-900 border border-gray-200'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={`text-sm mb-4 ${plan.featured ? 'text-purple-100' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              
              <div className="mb-6">
                <div className="text-4xl font-bold">{plan.price}</div>
                {plan.price !== 'Custom' && <div className={`text-sm ${plan.featured ? 'text-purple-100' : 'text-gray-600'}`}>/month</div>}
              </div>

              <button
                className={`w-full py-3 rounded-lg font-semibold mb-8 transition ${
                  plan.featured
                    ? 'bg-white text-purple-600 hover:bg-gray-50'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </button>

              <div className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
