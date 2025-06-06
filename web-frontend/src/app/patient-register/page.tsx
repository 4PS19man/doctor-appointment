'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserPlus } from 'lucide-react'; // Optional icon

export default function PatientRegister() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get('email') || '';
  const password = searchParams.get('password') || '';

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    gender: '',
    age: '',
    email,
    password,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, phoneNumber, gender, age } = formData;
    if (!name || !phoneNumber || !gender || !age) {
      setError('All fields are required.');
      return;
    }
    if (Number(age) <= 0) {
      setError('Please enter a valid age.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to register patient.');
        setLoading(false);
        return;
      }

      setSuccess('Patient registered successfully!');
      setError('');
      setLoading(false);

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-10 max-w-lg w-full">
        <div className="flex flex-col items-center mb-6">
          <UserPlus size={48} className="text-sky-700" />
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Patient Registration</h1>
          <p className="text-sm text-slate-600 mt-1">Complete your basic details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="col-span-2">
              <label className="text-sm font-medium text-slate-700">Age</label>
              <input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm mt-2 text-center">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 bg-sky-600 text-white py-3 rounded-md font-semibold hover:bg-sky-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registering...' : 'Register Patient'}
          </button>
        </form>
      </div>
    </div>
  );
}
