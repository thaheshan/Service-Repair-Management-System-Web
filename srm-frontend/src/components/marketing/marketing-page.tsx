'use client';

import Header from './header';
import HeroSection from './hero-section';
import FeaturesSection from './features-section';
import HowItWorks from './how-it-works';
import PricingSection from './pricing-section';
import TestimonialsSection from './testimonials-section';
import FAQSection from './faq-section';
import CTASection from './cta-section';
import Footer from './footer';

export default function SRMMarketingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
