'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    content: "SRM has completely transformed how we run our shop. The inventory tracking and automated customer updates alone have saved us hours every week.",
    author: "David Wilson",
    role: "Owner, TechFix Solutions",
    image: "https://i.pravatar.cc/150?u=david"
  },
  {
    content: "The POS system is incredibly intuitive. My staff picked it up in minutes, and our checkout process is now faster than ever.",
    author: "Sarah Jenkins",
    role: "Manager, iRepair Store",
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    content: "Best investment we've made for our business. The reporting features give me exactly the insights I need to grow.",
    author: "Michael Chang",
    role: "Founder, PhoneDoctor Plus",
    image: "https://i.pravatar.cc/150?u=michael"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-[#1E293B] mb-4">
            Trusted by 500+ Repair Shop<br />Owners
          </h2>
          <p className="text-xl text-gray-500">
            Hear what our customers have to say about SRM.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-8 italic leading-relaxed font-medium">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full border-2 border-indigo-50"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
