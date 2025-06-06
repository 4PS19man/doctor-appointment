'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Stethoscope } from 'lucide-react'; // Optional icon

export default function DoctorRegister() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const emailParam = searchParams.get('email') || '';
  const passwordParam = searchParams.get('password') || '';

  const [formData, setFormData] = useState({
    email: emailParam,
    password: passwordParam,
    name: '',
    gender: '',
    phoneNumber: '',
    specialization: '',
    experience: '',
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: emailParam,
      password: passwordParam,
    }));
  }, [emailParam, passwordParam]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'password') return;
    setFormData({ ...formData, [name]: value });
    setError('');
    setSuccess('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, String(value));
    });

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors`,
        {
          method: 'POST',
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Something went wrong.');
        return;
      }

      setSuccess('Doctor registered successfully!');
      setError('');

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to register doctor. Please try again.');
    }
  };

 
  


  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-10 max-w-lg w-full">
        <div className="flex flex-col items-center mb-6">
          <Stethoscope size={48} className="text-sky-700" />
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Doctor Registration</h1>
          <p className="text-sm text-slate-600 mt-1">Complete your professional profile</p>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 border border-slate-300 rounded-md cursor-not-allowed"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 border border-slate-300 rounded-md cursor-not-allowed"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-slate-700">Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Specialization</label>
              <input
                name="specialization"
                type="text"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Experience (yrs)</label>
              <input
                name="experience"
                type="text"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium text-slate-700">Upload Image</label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full mt-1"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm mt-2 text-center">{success}</p>}

          <button
            type="submit"
            className="w-full mt-4 bg-sky-600 text-white py-3 rounded-md font-semibold hover:bg-sky-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}