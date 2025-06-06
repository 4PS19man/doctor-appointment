'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Patient {
  name: string;
}

interface Doctor {
  name: string;
  image?: string;
}

interface Appointment {
  id: number;
  patient: Patient;
  doctor: Doctor;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  status: 'BOOKED' | 'CANCELLED' | 'COMPLETED';
}

export default function DoctorAppointments() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctorId') || '';

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorId) return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/by-doctor/${doctorId}`);
        if (!res.ok) throw new Error('Failed to fetch appointments');
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const updateAppointmentStatus = async (appointmentId: number, status: 'COMPLETED' | 'CANCELLED') => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update appointment');

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status } : appt
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update appointment status.');
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (activeTab === 'UPCOMING') return appt.status === 'BOOKED';
    return appt.status === activeTab;
  });

  if (!doctorId) return <p className="p-6 text-red-600 font-semibold">Doctor ID is missing in the URL.</p>;
  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Appointments</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('UPCOMING')}
          className={`px-4 py-2 rounded ${activeTab === 'UPCOMING' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-4 py-2 rounded ${activeTab === 'COMPLETED' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveTab('CANCELLED')}
          className={`px-4 py-2 rounded ${activeTab === 'CANCELLED' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Cancelled
        </button>
      </div>

      {filteredAppointments.length === 0 ? (
        <p>No {activeTab.toLowerCase()} appointments.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Patient info */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={appt.doctor?.image || '/default-doctor.png'}
                  alt="Doctor"
                  className="w-16 h-16 object-cover rounded-full border"
                />
                <div>
                  <h2 className="text-lg font-semibold">Patient: {appt.patient.name}</h2>
                  <p className="text-sm text-gray-500">Dr. {appt.doctor?.name}</p>
                </div>
              </div>

              {/* Appointment details */}
              <p className="text-gray-700"><strong>Date:</strong> {appt.date}</p>
              <p className="text-gray-700"><strong>Day:</strong> {appt.day}</p>
              <p className="text-gray-700">
                <strong>Time:</strong> {appt.startTime.slice(0, 5)} - {appt.endTime.slice(0, 5)}
              </p>

              {/* Buttons */}
              {activeTab === 'UPCOMING' && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => updateAppointmentStatus(appt.id, 'COMPLETED')}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => updateAppointmentStatus(appt.id, 'CANCELLED')}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}