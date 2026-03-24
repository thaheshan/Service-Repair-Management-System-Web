'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Transform Your Repair<br />Business?
        </h2>
        <p className="text-lg text-purple-100 mb-8">
          Join hundreds of repair shops already using SRM to streamline operations and boost profits.
        </p>
        
        <Link
          href="/dashboard"
          className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition text-lg"
        >
          Start Your Free Trial Today
        </Link>
      </div>
    </section>
  );
}
