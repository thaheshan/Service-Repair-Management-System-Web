'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 text-white py-24 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
          Complete Service Repair<br />Management System
        </h1>
        <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto text-balance">
          Streamline your repair shop operations with our all-in-one SRM platform. 
          Manage customers, track repairs, and boost revenue with intelligent automation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            View Dashboard Demo
          </Link>
          <Link
            href="#"
            className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
          >
            ▶ Watch Demo
          </Link>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-12 relative">
          <div className="bg-gradient-to-b from-purple-500/50 to-purple-600/50 rounded-2xl p-1 inline-block max-w-3xl w-full mx-auto">
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Admin%20Dashboard%20Task%20Update%20Screen%2011%201-4Oaj9vzq17Kxo5c1a4tNHvEuO41yAW.png" 
                       alt="SRM Dashboard" 
                       className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
