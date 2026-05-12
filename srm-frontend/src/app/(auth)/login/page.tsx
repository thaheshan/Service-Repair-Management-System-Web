'use client';

import LoginForm from '@/components/LoginForm/LoginForm';
import LoginSidebar from '@/components/LoginSidebar/LoginSidebar';
import { AuthLogo } from '@/components/common/auth-logo';

import img1 from '../../../../public/login img 1.jpeg';
import img2 from '../../../../public/login img 2.png';
import img3 from '../../../../public/login img 3.png';

export default function LoginPage() {
  // Provided local assets for the carousel via Static Imports to resolve spaces
  const carouselSlides = [
    {
      id: 'slide-1',
      imageUrl: img1,
      alt: 'Hardware Technician Workspace',
    },
    {
      id: 'slide-2',
      imageUrl: img2,
      alt: 'System Customization',
    },
    {
      id: 'slide-3',
      imageUrl: img3,
      alt: 'System Architecture',
    },
  ];

  const testimonial = {
    quote:
      '"ServicePro has transformed how we manage repairs. Our efficiency increased by 40% in just 3 months!"',
    author: 'Michael Chen',
    company: 'TechFix Solutions',
    // Using a reliable ui-avatars fallback that generates a beautiful colored initial profile
    imageUrl:
      'https://ui-avatars.com/api/?name=Michael+Chen&background=6366f1&color=fff&size=128',
  };

  return (
    <div className="flex min-h-screen w-full bg-white lg:overflow-hidden">
      {/* Dynamic Visual Sidebar - Hidden on Mobile/Tablet */}
      <div className="hidden lg:flex lg:w-1/2 relative h-full shrink-0">
        <LoginSidebar
          logoUrl="" // Will use pure Icon inside component
          carouselSlides={carouselSlides}
          testimonial={testimonial}
          heading="Streamline Your Repair Business"
          subheading="Manage repairs, track inventory, and delight customers all in one place"
        />
      </div>

      {/* Authentication Form Half */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative overflow-y-auto w-full">
        {/* Logo at the top for Mobile/Tablet */}
        <div className="lg:hidden mb-12">
          <AuthLogo />
        </div>

        <div className="w-full max-w-[420px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
