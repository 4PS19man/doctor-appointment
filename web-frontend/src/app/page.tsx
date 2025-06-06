'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, UserPlus } from 'lucide-react'; // Optional: install via `npm install lucide-react`

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6 relative">
      {/* Doctor image */}
      <div className="absolute top-6 left-6 w-24 h-24 md:w-32 md:h-32">
        <Image
          src="/doctor_image.png"
          alt="Doctor"
          width={128}
          height={128}
          className="rounded-full object-cover shadow-lg"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 drop-shadow-sm">
            Healthcare Administration Portal
          </h1>
          <p className="text-slate-700 text-lg mb-8 leading-relaxed">
            Manage appointments, patient details, and doctor availability seamlessly with our integrated platform.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-6">
            <Link href="/login">
              <button className="flex items-center gap-2 px-8 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-semibold shadow-md">
                <LogIn size={18} />
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="flex items-center gap-2 px-8 py-3 bg-white border border-sky-600 text-sky-600 rounded-lg hover:bg-sky-50 transition font-semibold shadow-sm">
                <UserPlus size={18} />
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}