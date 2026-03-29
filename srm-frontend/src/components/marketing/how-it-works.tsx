import { UserPlus, Layers, ClipboardList, Rocket } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus className="w-8 h-8 text-blue-600" />,
    title: 'Register Business',
    description: 'Create an account and set up your shop details in minutes.'
  },
  {
    icon: <Layers className="w-8 h-8 text-blue-600" />,
    title: 'Add Services',
    description: 'Define your services, pricing, and initial inventory.'
  },
  {
    icon: <ClipboardList className="w-8 h-8 text-blue-600" />,
    title: 'Create First Repair',
    description: 'Log a customer issue and start tracking the progress.'
  },
  {
    icon: <Rocket className="w-8 h-8 text-blue-600" />,
    title: 'Manage & Grow',
    description: 'Track analytics, manage team, and scale your business.'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            How SRM Works in 4 Simple<br />Steps
          </h2>
          <p className="text-lg text-gray-500">
            From setting up your business to managing daily operations, it's that easy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center transform transition duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-6 relative">
                {step.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center text-sm font-bold text-gray-400">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
