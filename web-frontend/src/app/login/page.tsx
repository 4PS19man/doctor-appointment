'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, UserCircle2 } from 'lucide-react'; // Optional icons

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      

      localStorage.setItem('userData', JSON.stringify(data));

      if (data.role === 'doctor') {
        router.push(`/doctor_dashboard?doctorId=${data.doctor.id}`);
      } else if (data.role === 'patient') {
        router.push(`/patient_dashboard?patientId=${data.patient.id}`);
      } else {
        setError('Unknown user role.');
      }
    } catch (err) {
      setError('Login failed. Please check your email, password, and role.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-sky-100 to-blue-50 px-4">
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <UserCircle2 size={48} className="text-sky-700" />
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Welcome Back</h1>
          <p className="text-sm text-slate-600 mt-1">Login to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="example@domain.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            >
              <option value="" disabled>Select role</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 transition text-white font-semibold py-2 rounded-md shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}







