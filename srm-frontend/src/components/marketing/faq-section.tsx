'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'Do I need technical skills to use SRM?',
    answer: 'No, SRM is designed to be intuitive and user-friendly. You can set up your complete repair shop management system without any technical knowledge.'
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, we offer a 14-day free trial on all our plans. Get full access to all features with no credit card required.'
  },
  {
    question: 'Can I integrate SRM with other tools?',
    answer: 'SRM offers seamless integrations with popular accounting software, payment gateways, and marketing tools to streamline your workflow.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Absolutely. There are no long-term contracts or lock-in periods. You can downgrade, upgrade, or cancel your subscription at any time.'
  },
  {
    question: 'Do you offer customer support?',
    answer: 'Yes! Our dedicated support team is available via chat and email to help you with any questions or technical issues you might encounter.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faqs" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-[#1E293B] mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-500">
            Find answers to common questions about SRM.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md bg-white' : 'hover:border-gray-200'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-start justify-between bg-white w-full"
                  aria-expanded={isOpen}
                >
                  <span className={`text-lg font-bold pr-8 ${isOpen ? 'text-blue-600' : 'text-gray-900'}`}>{faq.question}</span>
                  <div className={`mt-1 shrink-0 flex items-center justify-center w-6 h-6 rounded-full border transition-colors ${isOpen ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-400'}`}>
                    {isOpen ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>
                
                <div 
                  className={`px-6 pb-6 text-gray-600 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pb-0'}`}
                >
                  <p className="pt-2 border-t border-gray-50">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
