import { ShieldCheck, Lock, Zap, CheckCircle2, Shield } from 'lucide-react';

export default function SecuritySection() {
  return (
    <section className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl font-extrabold text-[#1E293B] mb-6 leading-tight">
              Enterprise-Grade<br />Security
            </h2>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-lg">
              Your data is our top priority. We employ industry-leading security measures to keep your business and customer information safe.
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-700 font-medium">
                <CheckCircle2 className="w-6 h-6 mr-4 text-blue-600 shrink-0" />
                End-to-end encryption for all sensitive data
              </li>
              <li className="flex items-center text-gray-700 font-medium">
                <CheckCircle2 className="w-6 h-6 mr-4 text-green-500 shrink-0" />
                24/7 continuous monitoring and threat detection
              </li>
              <li className="flex items-center text-gray-700 font-medium">
                <CheckCircle2 className="w-6 h-6 mr-4 text-yellow-500 shrink-0" />
                Daily automated backups stored securely offsite
              </li>
              <li className="flex items-center text-gray-700 font-medium">
                <CheckCircle2 className="w-6 h-6 mr-4 text-purple-600 shrink-0" />
                Role-based access controls and audit logging
              </li>
            </ul>
          </div>
          
          {/* Right Cards */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 z-0"></div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 relative z-10 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">AES-256</h4>
                <p className="text-sm text-gray-500">Encryption Standard</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 relative z-10 hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">ISO Certified</h4>
                <p className="text-sm text-gray-500">Security compliance</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 relative z-10 hover:shadow-md transition">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">99.9% Uptime</h4>
                <p className="text-sm text-gray-500">Reliable performance</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 relative z-10 hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">GDPR Ready</h4>
                <p className="text-sm text-gray-500">Data privacy assured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
