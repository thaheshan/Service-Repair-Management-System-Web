import { Facebook, Twitter, Instagram, Youtube, Box } from "lucide-react";
import Link from "next/link";

export function DashboardFooter() {
  return (
    <footer className="w-full bg-[#111827] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="flex flex-col gap-4 md:col-span-2 pr-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-purple-600 shadow-lg">
                <Box className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">SRM</span>
            </div>
            
            <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-[280px]">
              The User Friendly System to repair electronical devices.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button 
                  key={i} 
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-800 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white focus:outline-none"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* Newsletter */}
            <div className="mt-4 flex flex-col gap-4">
              <h3 className="text-sm font-bold tracking-tight text-white">Newsletter</h3>
              <p className="text-sm font-medium text-gray-400">
                Get the latest sets and updates
              </p>
              <form className="flex w-full items-center gap-0 max-w-[340px]" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 h-10 rounded-l-md bg-gray-800 border-none px-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]"
                />
                <button 
                  type="submit" 
                  className="h-10 rounded-r-md bg-[#0ea5e9] px-6 text-sm font-bold text-white transition-colors hover:bg-sky-400 shadow-sm focus:outline-none"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Browse */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold tracking-tight text-white mb-1">Browse</h3>
            {['All Sets', 'Brands', 'Categories', 'New Releases', 'Popular Sets'].map((link) => (
              <Link key={link} href="#" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
                {link}
              </Link>
            ))}
          </div>

          {/* Column 3: Community */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold tracking-tight text-white mb-1">Community</h3>
            {['Forums', 'User Reviews', 'Build Galleries', 'Submit a Set', 'Leaderboard'].map((link) => (
              <Link key={link} href="#" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
                {link}
              </Link>
            ))}
          </div>

          {/* Column 4: Resources */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold tracking-tight text-white mb-1">Resources</h3>
            {['Brand Guide', 'Size Reference', 'Instructions', 'Where to Buy', 'FAQ'].map((link) => (
              <Link key={link} href="#" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
                {link}
              </Link>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex items-center justify-center border-t border-gray-800 pt-6 pb-2">
          <p className="text-xs font-medium text-gray-500">
            © 2026 Futura Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
