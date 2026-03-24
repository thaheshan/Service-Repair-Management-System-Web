'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
        <div>
          <h3 className="font-bold text-white mb-4">Product</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-white transition">Features</Link></li>
            <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
            <li><Link href="#" className="hover:text-white transition">Security</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-white mb-4">Company</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-white transition">About</Link></li>
            <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
            <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-white mb-4">Resources</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-white transition">Documentation</Link></li>
            <li><Link href="#" className="hover:text-white transition">API Docs</Link></li>
            <li><Link href="#" className="hover:text-white transition">Support</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-white mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
            <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
            <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-white mb-4">Follow Us</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-white transition">Twitter</Link></li>
            <li><Link href="#" className="hover:text-white transition">LinkedIn</Link></li>
            <li><Link href="#" className="hover:text-white transition">Facebook</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-8 text-center">
        <p>&copy; 2024 SRM - Service Repair Management. All rights reserved.</p>
      </div>
    </footer>
  );
}
