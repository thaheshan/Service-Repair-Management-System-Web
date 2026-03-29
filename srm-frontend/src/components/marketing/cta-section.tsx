'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#4A62FF] via-[#5865F2] to-[#8C46FF] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl mix-blend-overlay pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-[#8C46FF]/30 blur-3xl mix-blend-overlay pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight max-w-2xl mx-auto tracking-tight">
              Ready to Transform Your<br />Repair Business?
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-xl mx-auto font-medium">
              Join hundreds of successful repair shops running on SRM today. No credit card required.
            </p>
            <div className="flex justify-center">
              <Link
                href="/signup"
                className="bg-white text-[#5865F2] hover:bg-gray-50 focus:ring-4 focus:ring-white/20 px-10 py-4 text-lg rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
