'use client';

import { Wrench } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SRM<span className="text-blue-600">.</span></span>
        </div>
        
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
          <Link href="#" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
            Docs
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
