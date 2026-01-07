'use client';
import { useState } from 'react';
export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center mb-6">SRM Login</h2>
        <form className="space-y-6">
          <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-lg" />
          <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-lg" />
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Login</button>
        </form>
      </div>
    </div>
  );
}
