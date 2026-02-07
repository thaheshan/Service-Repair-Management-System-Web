'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import Testimonial from '../Testimonial/Testimonial';
import './LoginSidebar.scss';

interface LoginSidebarProps {
  logoUrl?: string;
  carouselSlides: Array<{
    id: string;
    imageUrl: string;
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
  logoUrl,
  carouselSlides,
  testimonial,
  heading,
  subheading,
}: LoginSidebarProps) {
  return (
    <aside className="login-sidebar">
      <div className="sidebar-content">
        {logoUrl && (
          <div className="sidebar-logo">
            <Image src={logoUrl || "/placeholder.svg"} alt="ServicePro" width={32} height={32} />
            <span>ServicePro</span>
          </div>
        )}

        <div className="carousel-wrapper">
          <ImageCarousel slides={carouselSlides} autoplay />
        </div>

        <Testimonial {...testimonial} />

        <div className="sidebar-footer">
          <h2 className="sidebar-heading">{heading}</h2>
          <p className="sidebar-description">{subheading}</p>
        </div>
      </div>
    </aside>
  );
}
