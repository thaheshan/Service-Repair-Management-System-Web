'use client';

import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SRM</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
            Product
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
            Features
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
            Pricing
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
