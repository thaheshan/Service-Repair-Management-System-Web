'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'John Smith',
    role: 'Owner, ElectroRepair Solutions',
    content: 'SRM has transformed how we manage our repair business. We\'ve increased efficiency by 40% and customer satisfaction is at an all-time high.',
    avatar: '👨‍💼',
    rating: 5
  },
  {
    name: 'Sarah Johnson',
    role: 'Manager, Mobile Fix Experts',
    content: 'The scheduling feature alone has saved us hours every day. Our technicians love the app and our customers appreciate the transparency.',
    avatar: '👩‍💼',
    rating: 5
  },
  {
    name: 'Mike Chen',
    role: 'Owner, TechCare Plus',
    content: 'Best investment for our repair shop. The analytics helped us identify bottlenecks and optimize our processes. Highly recommended!',
    avatar: '👨‍💼',
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Trusted by 500+ Repair Shop<br />Owners
          </h2>
          <p className="text-gray-600">See what our customers are saying about SRM</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 text-sm">&quot;{testimonial.content}&quot;</p>
              
              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
