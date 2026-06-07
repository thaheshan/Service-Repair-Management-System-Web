'use client';

import Header from './header';
import HeroSection from './hero-section';
import FeaturesSection from './features-section';
import HowItWorks from './how-it-works';
import PricingSection from './pricing-section';
import TestimonialsSection from './testimonials-section';
import SecuritySection from './security-section';
import FAQSection from './faq-section';
import ContactSection from './contact-section';
import CTASection from './cta-section';
import Footer from './footer';

export default function SRMMarketingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans tracking-normal selection:bg-blue-200">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <PricingSection />
        <TestimonialsSection />
        <SecuritySection />
        <FAQSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
