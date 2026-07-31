import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import BookDemoModal from '@/components/marketing/BookDemoModal';

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    try {
      // Point this to your actual backend URL when deploying
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit message');
      }

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-slate-600">
            Have questions about AllFix? We're here to help you optimize your repair shop operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-slate-900">Email Us</h3>
                  <p className="mt-1 text-slate-600">Our friendly team is here to help.</p>
                  <a href="mailto:Info@allfix.space" className="mt-2 text-blue-600 hover:text-blue-500 font-medium block">
                    Info@allfix.space
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-slate-900">Call Us</h3>
                  <p className="mt-1 text-slate-600">Mon-Fri from 8am to 5pm.</p>
                  <a href="tel:+940756645486" className="mt-2 text-blue-600 hover:text-blue-500 font-medium block">
                    +94 075 664 5486
                  </a>
                  <a href="tel:+940769696083" className="mt-1 text-blue-600 hover:text-blue-500 font-medium block">
                    +94 076 969 6083
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-slate-900">Visit Us</h3>
                  <p className="mt-1 text-slate-600">Come say hello at our office HQ.</p>
                  <p className="mt-2 text-slate-600">
                    Colombo, Sri Lanka
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-slate-200 shadow-md bg-white text-slate-900">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-900">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="John Doe"
                      className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-500 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-900">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-500 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-slate-900">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-500 focus-visible:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-900">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us about your needs..."
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-500 focus-visible:ring-blue-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Demo Booking Banner */}
        <div className="mt-24 rounded-3xl bg-gradient-to-br from-indigo-900 to-blue-900 overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Want to see AllFix in action?
              </h3>
              <p className="text-blue-200 text-lg">
                Schedule a free 30-minute discovery call with our product experts. We'll show you exactly how AllFix can streamline your specific repair shop workflows.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-white text-indigo-900 hover:bg-blue-50 font-bold px-8 py-6 rounded-xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
            >
              Book a Schedule Now
            </Button>
          </div>
        </div>
      </div>

      <BookDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </section>
  );
}