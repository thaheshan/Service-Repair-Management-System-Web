'use client';

import { Users, Wrench, BarChart3, Lock, Clock, AlertCircle } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Client Customer Management',
    description: 'Manage all customer information, service history, and preferences in one centralized location.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Wrench,
    title: 'Repair and Maintenance',
    description: 'Track repair requests, assign technicians, and manage service schedules efficiently.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: BarChart3,
    title: 'Revenue Reports',
    description: 'Get real-time insights into revenue, profitability, and business performance metrics.',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Clock,
    title: 'Smart Scheduling',
    description: 'Optimize technician schedules and reduce idle time with intelligent scheduling.',
    color: 'bg-pink-100 text-pink-600'
  },
  {
    icon: Lock,
    title: 'Role-Based Management',
    description: 'Control access levels and permissions for different team members and roles.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: AlertCircle,
    title: 'Service Alerts',
    description: 'Get instant notifications for pending repairs, completed jobs, and important updates.',
    color: 'bg-indigo-100 text-indigo-600'
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Powerful Features Built for<br />Repair Shops
          </h2>
          <p className="text-gray-600">Everything you need to run a successful repair business</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
