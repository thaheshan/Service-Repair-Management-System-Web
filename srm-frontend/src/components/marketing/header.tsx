'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#', label: 'Home' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faqs', label: 'FAQs' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <img
            src="/all-fix-logo-black.png"
            alt="All Fix Logo"
            className="h-28 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-blue-600 font-medium text-sm hover:text-blue-700 transition px-3 py-2"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile: Show Log In + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/login"
            className="text-blue-600 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            Log In
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 shadow-lg">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50 transition"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-2">
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-[#5865F2] hover:bg-[#4752C4] text-white px-5 py-3 rounded-lg text-sm font-semibold transition-colors shadow-md"
              >
                Get Started Free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
