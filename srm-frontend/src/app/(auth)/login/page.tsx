'use client';

import LoginForm from '@/components/LoginForm/LoginForm';
import LoginSidebar from '@/components/LoginSidebar/LoginSidebar';
import './page.scss';

export default function LoginPage() {
  // Sample carousel slides
  const carouselSlides = [
    {
      id: 'slide-1',
      imageUrl:
        'https://images.unsplash.com/photo-1537694712202-7d88fb184338?w=600&h=600&fit=crop',
      alt: 'Service professional',
    },
    {
      id: 'slide-2',
      imageUrl:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop',
      alt: 'Repair business',
    },
    {
      id: 'slide-3',
      imageUrl:
        'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=600&fit=crop',
      alt: 'Customer service',
    },
  ];

  const testimonial = {
    quote:
      '"ServicePro has transformed how we manage repairs. Our efficiency increased by 40% in just 3 months!"',
    author: 'Michael Chen',
    company: 'TechFix Solutions',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <LoginSidebar
          logoUrl="https://api.dicebear.com/7.x/initials/svg?seed=SP&backgroundColor=6366f1&textColor=ffffff&scale=80"
          carouselSlides={carouselSlides}
          testimonial={testimonial}
          heading="Streamline Your Repair Business"
          subheading="Manage repairs, track inventory, and delight customers all in one place"
        />
        <div className="login-form-wrapper">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
