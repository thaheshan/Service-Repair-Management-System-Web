import { Wrench, Twitter, Linkedin, Github, Facebook } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/all-fix-logo.png" alt="All Fix Logo" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-slate-400 text-sm mb-6 max-w-sm leading-relaxed">
              Complete Service Repair Management System built for the modern repair business. 
              Streamline your operations and delight your customers.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-sm hover:text-white transition">Features</Link></li>
              <li><Link href="#pricing" className="text-sm hover:text-white transition">Pricing</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition">Integrations</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm hover:text-white transition">Documentation</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition">Blog</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition">Help Center</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm hover:text-white transition">About Us</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition">Careers</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition">Press</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} All Fix. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <Link href="#" className="text-slate-400 hover:text-white transition p-2">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-white transition p-2">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-white transition p-2">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-white transition p-2">
              <Github className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
