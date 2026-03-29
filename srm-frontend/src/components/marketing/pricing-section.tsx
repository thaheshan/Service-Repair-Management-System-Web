'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    description: 'Perfect for new repair shops',
    priceMonthly: '2,900',
    priceYearly: '27,840',
    features: [
      'Up to 500 repairs/mo',
      '2 team members',
      'Basic reporting',
      'Email support',
      'Basic inventory',
      'Custom receipts',
      'POS system'
    ],
    cta: 'Get Started',
    mostPopular: false,
  },
  {
    name: 'Professional',
    description: 'For growing repair businesses',
    priceMonthly: '4,900',
    priceYearly: '47,040',
    features: [
      'Everything in Starter',
      'Unlimited repairs',
      'Up to 10 team members',
      'Advanced reporting',
      'SMS notifications',
      'API access',
      'Priority support',
      'Multi-location support'
    ],
    cta: 'Start Free Trial',
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large scale operations',
    priceMonthly: 'Custom',
    priceYearly: 'Custom',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Custom integration',
      'Dedicated Account Manager',
      '99.9% Uptime SLA',
      'White-labeling',
      '24/7 Phone Support'
    ],
    cta: 'Contact Sales',
    mostPopular: false,
  }
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-500 mb-8">
            Choose the perfect plan for your repair business.
          </p>

          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 max-w-sm mx-auto w-full ${
                tier.mostPopular
                  ? 'bg-gradient-to-b from-[#5865F2] to-[#7B52F4] text-white shadow-2xl scale-105 z-10 border-0'
                  : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute top-0 right-6 -translate-y-1/2">
                  <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-full shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${tier.mostPopular ? 'text-white' : 'text-gray-900'}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm ${tier.mostPopular ? 'text-indigo-100' : 'text-gray-500'} h-10`}>
                  {tier.description}
                </p>
                
                <div className="mt-6 flex items-baseline text-5xl font-extrabold">
                  {tier.priceMonthly !== 'Custom' && <span className={`text-2xl mr-1 font-semibold ${tier.mostPopular ? 'text-indigo-100' : 'text-gray-400'}`}>LKR</span>}
                  {tier.priceMonthly === 'Custom' ? 'Custom' : (isYearly ? tier.priceYearly : tier.priceMonthly)}
                  {tier.priceMonthly !== 'Custom' && <span className={`ml-1 text-xl font-medium ${tier.mostPopular ? 'text-indigo-200' : 'text-gray-500'}`}>/mo</span>}
                </div>
              </div>

              <button
                className={`w-full py-3 px-6 rounded-xl font-bold text-center transition-all ${
                  tier.mostPopular
                    ? 'bg-white text-[#5865F2] hover:bg-gray-50 hover:shadow-lg'
                    : index === 0
                      ? 'bg-white text-[#5865F2] border-2 border-[#5865F2] hover:bg-blue-50'
                      : 'bg-[#5865F2] text-white hover:bg-[#4752C4]'
                }`}
              >
                {tier.cta}
              </button>

              <ul className="mt-8 space-y-4">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className={`h-5 w-5 shrink-0 mr-3 ${tier.mostPopular ? 'text-yellow-300' : 'text-green-500'}`} />
                    <span className={`text-sm font-medium ${tier.mostPopular ? 'text-white' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
