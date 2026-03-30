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
      <Link href="/" className="relative z-10 flex items-center gap-3 w-fit group">
        <div className="flex items-center justify-center p-2 bg-white rounded-lg shadow-sm group-hover:scale-105 transition-transform">
          <Wrench className="w-5 h-5 text-[#3b3887]" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">ServicePro</span>
      </Link>

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

        {/* Glassmorphic Testimonial (Wider than Image) */}
        <div className="w-full mt-6 p-5 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/10 shadow-lg relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex gap-4 items-start relative z-10">
            {testimonial.imageUrl && (
              <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-white/20">
                <Image
                  src={testimonial.imageUrl}
                  alt={testimonial.author}
                  width={44}
                  height={44}
                  className="object-cover w-full h-full"
                  unoptimized // Ensuring external URL avatars load seamlessly
                />
              </div>
            )}
            <div className="space-y-2.5">
              <p className="text-[13px] leading-relaxed font-medium text-indigo-50/90 italic">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8B8DF2] tracking-wide">
                <span className="text-white/40">—</span>
                <span>{testimonial.author},</span>
                <span className="text-white/60">{testimonial.company}</span>
              </div>
            </div>
          </div>
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
