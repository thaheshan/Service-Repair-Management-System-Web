import { Users, Wrench, Package, CreditCard, BarChart2, Calendar, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: <Users className="w-6 h-6 text-blue-600" />,
    title: 'Customer Management',
    description: 'Build detailed customer profiles and manage relationships seamlessly.',
    features: ['Add customers', 'Track history', 'SMS notifications'],
    color: 'bg-blue-50'
  },
  {
    icon: <Wrench className="w-6 h-6 text-green-600" />,
    title: 'Repair Tracking',
    description: 'Track devices through every stage of the repair process with ease.',
    features: ['Status updates', 'Parts ordering', 'Time tracking'],
    color: 'bg-green-50'
  },
  {
    icon: <Package className="w-6 h-6 text-amber-500" />,
    title: 'Inventory Control',
    description: 'Keep track of your parts, accessories, and products in real-time.',
    features: ['Low stock alerts', 'Vendor management', 'Barcode scanning'],
    color: 'bg-amber-50'
  },
  {
    icon: <CreditCard className="w-6 h-6 text-pink-600" />,
    title: 'POS & Invoicing',
    description: 'Process transactions quickly, create detailed invoices, and manage payments.',
    features: ['Tax calculation', 'Custom receipts', 'Email/SMS invoices'],
    color: 'bg-pink-50'
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-blue-500" />,
    title: 'Analytics & Reports',
    description: 'Make data-driven decisions with comprehensive performance insights.',
    features: ['Revenue tracking', 'Employee performance', 'Popular repairs'],
    color: 'bg-blue-50'
  },
  {
    icon: <Calendar className="w-6 h-6 text-purple-600" />,
    title: 'Booking System',
    description: 'Let customers book repair appointments online automatically.',
    features: ['Online booking', 'Automated reminders', 'Calendar sync'],
    color: 'bg-purple-50'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-[#1E293B] mb-4">
            Powerful Features Built for<br className="hidden md:block" /> Repair Shops
          </h2>
          <p className="text-xl text-gray-500">
            Everything you need to run your repair business efficiently and profitably.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 mb-8 leading-relaxed h-14">
                {feature.description}
              </p>
              
              <ul className="space-y-3">
                {feature.features.map((item, i) => (
                  <li key={i} className="flex items-center text-sm font-medium text-gray-700">
                    <CheckCircle2 className="w-4 h-4 mr-3 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
