import { useState } from 'react';
import { Calendar, Clock, X, ChevronRight, User, Mail, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate next 14 days
  const upcomingDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // Start from tomorrow
    return d;
  }).filter(d => d.getDay() !== 0 && d.getDay() !== 6); // Exclude weekends

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:30 PM', '04:30 PM'];

  const handleBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      date: selectedDate.toISOString(),
      time: selectedTime,
      notes: formData.get('notes') as string,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/v1/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to book demo');
      setStep(3); // Success step
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        {/* Sidebar Info */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white md:w-1/3 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Book a Demo</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              See how AllFix can streamline your repair shop operations and boost your revenue.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-blue-50">
                <Clock className="w-4 h-4 text-blue-300" />
                <span>30 Min Discovery Call</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-blue-50">
                <Calendar className="w-4 h-4 text-blue-300" />
                <span>Personalized Walkthrough</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-blue-500/30">
            <p className="text-xs text-blue-200 italic">
              "AllFix transformed how we manage our daily repairs and inventory."
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8 md:w-2/3 bg-slate-50">
          
          {/* Step 1: Date & Time */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Select Date & Time</h4>
              
              <div className="mb-6">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Available Dates</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                  {upcomingDays.map((date, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border-2 transition-all ${
                        selectedDate?.toDateString() === date.toDateString()
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-medium uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-xl font-bold mt-1">{date.getDate()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div className="mb-8 animate-in fade-in slide-in-from-bottom-4">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Available Times</label>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                          selectedTime === time
                            ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-200 mt-auto">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!selectedDate || !selectedTime}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                >
                  Next Details <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 duration-300 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  ← Back to Calendar
                </button>
              </div>
              
              <h4 className="text-lg font-bold text-slate-900 mb-4">Your Details</h4>
              
              <form id="booking-form" onSubmit={handleBook} className="space-y-4 flex-1">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" /> Full Name
                  </label>
                  <Input name="name" required placeholder="John Doe" className="bg-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" /> Work Email
                    </label>
                    <Input name="email" type="email" required placeholder="john@company.com" className="bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" /> Phone
                    </label>
                    <Input name="phone" placeholder="+1 (555) 000-0000" className="bg-white" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">What would you like to focus on?</label>
                  <Textarea name="notes" placeholder="e.g. Inventory management, repair tracking..." rows={3} className="bg-white resize-none" />
                </div>
              </form>

              <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-6">
                <div className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">{selectedDate?.toLocaleDateString()}</span> at <span className="font-semibold text-slate-900">{selectedTime}</span>
                </div>
                <Button 
                  type="submit" 
                  form="booking-form"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Confirming...</> : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">You're booked!</h3>
              <p className="text-slate-600 mb-8 max-w-xs mx-auto">
                A calendar invitation has been sent to your email address. We look forward to speaking with you!
              </p>
              <Button onClick={onClose} variant="outline" className="w-full max-w-xs">
                Close
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
