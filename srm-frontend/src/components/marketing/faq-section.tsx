'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, we offer a 14-day free trial for all plans. No credit card required to get started.'
  },
  {
    question: 'Can I upgrade or downgrade my plan anytime?',
    answer: 'Absolutely! You can change your plan at any time. Changes take effect immediately.'
  },
  {
    question: 'Do you provide training and support?',
    answer: 'Yes, we provide comprehensive onboarding, documentation, and dedicated support for all users.'
  },
  {
    question: 'How secure is customer data?',
    answer: 'We use enterprise-grade encryption and comply with all data protection regulations.'
  },
  {
    question: 'Can I integrate SRM with other tools?',
    answer: 'Yes, we offer integrations with popular tools and custom API access for enterprise customers.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, bank transfers, and digital payment methods.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">Find answers to common questions about SRM</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
