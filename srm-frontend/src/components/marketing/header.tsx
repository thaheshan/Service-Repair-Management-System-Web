'use client';

import { Wrench } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <Link href="/" className="relative flex items-center h-10 w-48">
          <img 
            src="/all-fix-logo-black.png" 
            alt="All Fix Logo" 
            className="absolute top-1/2 -translate-y-1/2 h-16 w-auto object-contain"
            style={{ transform: 'scale(2.3)', transformOrigin: 'left center', left: '-28px' }}
          />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-gray-900 font-medium text-sm hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="#features" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
            Pricing
          </Link>
          <Link href="#faqs" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
            FAQs
          </Link>
          <Link href="#contact" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-blue-600 font-medium text-sm hover:text-blue-700 transition">
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </header>
  );
}
