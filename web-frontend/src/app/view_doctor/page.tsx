'use client';

import React, { useEffect, useState } from 'react';
import { useRouter,  useSearchParams } from 'next/navigation';

interface Slot {
  id: number;
  startTime: string;
  endTime: string;
}

interface Availability {
  id: number;
  location: string;
  dayOfWeek: string;
  slots: Slot[];
}

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  phoneNumber: string;
  gender: string;
  experience: string;
  image?: string;
  availabilities: Availability[];
}

export default function ViewDoctor() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const patientId = searchParams.get('patientId'); 
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/${doctorId}`);
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        console.error('Failed to fetch doctor:', err);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  if (!doctor) {
    return <div className="flex justify-center items-center min-h-screen text-lg">Loading doctor details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Profile Section */}
        <div className="md:w-1/3 bg-sky-100 p-6 flex flex-col items-center justify-center">
          <img
            src={doctor.image || '/default-doctor.jpg'}
            alt={`Dr. ${doctor.name}`}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-sky-600 shadow-md mb-4"
          />
          <h2 className="text-xl font-bold text-center text-gray-800">{doctor.name}</h2>
          <p className="text-sm text-gray-600">{doctor.specialization}</p>
          <p className="text-sm text-gray-600">{doctor.experience} years experience</p>
        </div>

        {/* Info Section */}
        <div className="md:w-2/3 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Doctor Details</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Phone:</strong> {doctor.phoneNumber}</p>
            <p><strong>Gender:</strong> {doctor.gender}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Availability</h3>
            {doctor.availabilities.length === 0 ? (
              <p className="text-sm text-gray-500">No availability info provided.</p>
            ) : (
              <div className="space-y-4">
                {doctor.availabilities.map((av) => (
                  <div
                    key={av.id}
                    className="border border-gray-200 p-4 rounded-lg bg-sky-50"
                  >
                    <p><strong>Day:</strong> {av.dayOfWeek}</p>
                    <p><strong>Location:</strong> {av.location}</p>
                    <p><strong>Slots:</strong>{' '}
                      {av.slots.length > 0
                        ? av.slots.map((slot) => `${slot.startTime} - ${slot.endTime}`).join(', ')
                        : 'No slots'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center gap-4">
  <button
    onClick={() =>
      router.push(`/book_appointment?doctorId=${doctorId}&patientId=${patientId}`)
    }
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-semibold transition"
  >
    Book Appointment
  </button>
  <button
    onClick={() => router.push(`/patient_dashboard?doctorId=${doctorId}&patientId=${patientId}`)}
    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md text-sm font-semibold transition"
  >
    Cancel
  </button>
</div>

        </div>
      </div>
    </div>
  );
}