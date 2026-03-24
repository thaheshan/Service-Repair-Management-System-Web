'use client';

const steps = [
  {
    number: '01',
    title: 'Register Your Business',
    description: 'Create an account and set up your repair shop profile in minutes'
  },
  {
    number: '02',
    title: 'Add Your Team',
    description: 'Invite technicians and staff members with custom role permissions'
  },
  {
    number: '03',
    title: 'Start Managing Repairs',
    description: 'Create repair orders and assign them to your technicians'
  },
  {
    number: '04',
    title: 'Track & Optimize',
    description: 'Monitor progress and optimize your business operations in real-time'
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            How SRM Works in 4 Simple<br />Steps
          </h2>
          <p className="text-gray-600">Get up and running in less than an hour</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-purple-200"></div>
              )}
              <div className="relative z-10 bg-white">
                <div className="w-24 h-24 rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl font-bold mb-4 mx-auto">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{step.title}</h3>
                <p className="text-gray-600 text-sm text-center">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
