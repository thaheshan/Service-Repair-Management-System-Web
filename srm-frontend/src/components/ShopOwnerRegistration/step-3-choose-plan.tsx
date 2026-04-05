'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Step3Props {
  onContinue: (plan: string) => void;
  onBack: () => void;
}

interface PlanDetails {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  popular?: boolean;
  features: string[];
  buttonText: string;
  buttonVariant: 'default' | 'outline';
}

const plans: PlanDetails[] = [
  {
    id: 'single',
    name: 'Single Shop',
    price: 'Rs. 5,400',
    period: '/month',
    description: 'Perfect for individual repair shops',
    features: [
      '1 shop location',
      'Up to 500 repairs/month',
      '5-10 staff users',
      '10,000 photo storage',
      'Email notifications',
      'Basic reporting',
    ],
    buttonText: 'Start Free Trial',
    buttonVariant: 'outline',
  },
  {
    id: 'small',
    name: 'Small Business',
    price: 'Rs. 13,750',
    period: '/month',
    description: 'Best for growing businesses',
    popular: true,
    features: [
      '5-10 shop locations',
      'Up to 2,000 repairs/month',
      '20-50 staff users',
      '50,000 photo storage',
      'Email + SMS notifications',
      'Advanced reporting',
      'Priority support',
    ],
    buttonText: 'Start Free Trial',
    buttonVariant: 'default',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom Pricing',
    period: '',
    description: 'For large scale operations',
    features: [
      '100+ shop locations',
      'Unlimited repairs',
      'Unlimited users',
      'Unlimited storage',
      'All notification channels',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline',
  },
];

export function Step3ChoosePlan({ onContinue, onBack }: Step3Props) {
  const [selectedPlan, setSelectedPlan] = useState('small');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Please agree to the Terms of Service');
      return;
    }
    onContinue(selectedPlan);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Step 3 of 3</p>
        <h1 className="text-4xl font-bold mt-2">Choose your plan</h1>
        <p className="text-muted-foreground mt-2">Select the best plan for your business needs</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative p-6 rounded-lg border-2 transition-all cursor-pointer ${
              selectedPlan === plan.id
                ? 'border-primary bg-primary bg-opacity-3'
                : 'border-border bg-white hover:border-primary hover:border-opacity-50'
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs font-bold">
                POPULAR
              </div>
            )}

            {/* Plan Name and Price */}
            <div className="mb-4">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6 py-6 border-y border-border">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* Button */}
            <Button
              type="button"
              variant={plan.buttonVariant}
              className={`w-full h-10 rounded-lg font-medium ${
                plan.buttonVariant === 'default'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border border-border bg-white text-foreground hover:bg-secondary'
              }`}
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="terms"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="w-4 h-4 mt-1 rounded border-border accent-primary cursor-pointer"
        />
        <label htmlFor="terms" className="text-sm text-foreground cursor-pointer">
          I agree to the{' '}
          <a href="#" className="text-primary font-medium hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary font-medium hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12 rounded-lg"
        >
          ← Back
        </Button>
        <Button
          type="submit"
          disabled={!agreeTerms}
          className="flex-1 h-12 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Account
        </Button>
      </div>
    </form>
  );
}