'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react'; // Optional icon

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');

    const query = new URLSearchParams({
      email: formData.email,
      password: formData.password,
    }).toString();

    if (formData.role === 'doctor') {
      router.push(`/doctor-register?${query}`);
    } else if (formData.role === 'patient') {
      router.push(`/patient-register?${query}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-sky-50 flex items-center justify-center px-4">
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-10 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <UserPlus size={48} className="text-sky-700" />
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Create Account</h1>
          <p className="text-sm text-slate-600 mt-1">Join as a doctor or patient</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm mt-1 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full mt-4 bg-sky-600 text-white py-3 rounded-md font-semibold hover:bg-sky-700 transition shadow-md"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}