'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-[#4A62FF] via-[#5865F2] to-[#8C46FF] text-white relative overflow-hidden">
      {/* Abstract Background Shapes (Optional for depth) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[120px]"></div>
        <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8">
          <span className="text-yellow-300">★</span> Trusted In 20+ Countries
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-[64px] font-extrabold mb-6 leading-[1.1] tracking-tight text-white max-w-4xl mx-auto">
          Complete Service Repair<br className="hidden md:block"/> Management System
        </h1>
        
        <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Streamline your shop, track repairs, and delight customers with the all-in-one platform built for the modern repair business.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-[#5865F2] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started Free
          </Link>
          <a
            href="https://www.youtube.com/watch?v=P7QHU6uJr74"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-xl font-semibold text-lg backdrop-blur-sm transition-all duration-200"
          >
            <Play className="w-5 h-5 mr-2 fill-current" /> Watch Demo
          </a>
        </div>

        <div className="text-indigo-100/80 text-sm font-medium mb-16 flex items-center justify-center gap-3 flex-wrap">
          <span>No credit card required</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/30 hidden sm:block"></span>
          <span>14-day free trial</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/30 hidden sm:block"></span>
          <span>Cancel anytime</span>
        </div>

        {/* Dashboard Preview Overlay */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-3xl blur-2xl transform -translate-y-4"></div>
          <div className="relative rounded-2xl bg-white/10 p-2 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200/50">
              <div className="aspect-[16/10] sm:aspect-[16/9] w-full bg-gray-50 flex items-center justify-center relative">
                {/* Fallback image as shown in current implementation, to be replaced by actual asset */}
                <img 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Admin%20Dashboard%20Task%20Update%20Screen%2011%201-4Oaj9vzq17Kxo5c1a4tNHvEuO41yAW.png" 
                  alt="SRM Dashboard Preview" 
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade into white section below */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20 translate-y-1/2"></div>
    </section>
  );
}
