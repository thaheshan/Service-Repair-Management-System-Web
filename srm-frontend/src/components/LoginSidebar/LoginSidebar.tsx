'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Wrench } from 'lucide-react';

interface LoginSidebarProps {
  logoUrl?: string; // Kept for interface compatibility
  carouselSlides: Array<{
    id: string;
    imageUrl: string | any;
    alt: string;
  }>;
  testimonial: {
    quote: string;
    author: string;
    company: string;
    imageUrl?: string;
  };
  heading: string;
  subheading: string;
}

export default function LoginSidebar({
  carouselSlides,
  testimonial,
  heading,
  subheading,
}: LoginSidebarProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automated Carousel Logic
  useEffect(() => {
    if (carouselSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000); // 4 seconds interval to match smooth transitions
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  return (
    // Matching the gradient from the registration sidebar flow
    <aside className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#4338CA] flex flex-col p-8 lg:p-12 justify-between">
      {/* Background decorative circles */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute bottom-40 right-10 h-40 w-40 rounded-full bg-white/5" />

      {/* Top Header Logo Component */}
      <div className="relative z-10 h-10 w-44">
        <Link href="/" className="absolute top-0 left-[-55px] lg:left-[-75px] flex items-center h-10 w-44">
          <img 
            src="/all-fix-logo.png" 
            alt="All Fix Logo" 
            className="h-16 w-auto object-contain" 
            style={{ transform: 'scale(2.7)', transformOrigin: 'left center' }}
          />
        </Link>
      </div>

      {/* Main Content Area (Vertically Centered Stack) */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-[460px] mx-auto mt-6">
        
        {/* Animated Carousel Image Stack (Made smaller than the card below) */}
        <div className="relative w-[80%] max-w-[340px] aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white/10 ring-1 ring-white/10">
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 ${
                index === currentSlide ? 'block z-10' : 'hidden z-0'
              }`}
            >
              <Image
                src={slide.imageUrl}
                alt={slide.alt}
                fill
                className="object-cover"
                unoptimized 
              />
            </div>
          ))}
        </div>

        {/* Dynamic Carousel Indicators */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8 h-2 shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                  : 'bg-white/40 hover:bg-white/60 w-2 h-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>



        {/* Bottom Footer Section (Stacked right below the testimonial) */}
        <div className="w-full mt-8 text-center flex flex-col items-center">
          <h1 className="text-[24px] lg:text-[26px] xl:text-[28px] font-bold text-white tracking-tight mb-1.5 whitespace-nowrap">
            {heading}
          </h1>
          <p className="text-[13px] lg:text-[14px] text-white/70 font-medium leading-relaxed whitespace-nowrap">
            {subheading}
          </p>
        </div>

      </div>
    </aside>
  );
}
