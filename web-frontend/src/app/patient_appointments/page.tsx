'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Doctor {
  name: string;
  image?: string;
}

interface Appointment {
  id: number;
  doctor: Doctor;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  status: 'BOOKED' | 'CANCELLED' | 'COMPLETED';
}

interface Patient {
  id: string;
  name: string;
}

export default function PatientAppointments() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'BOOKED' | 'CANCELLED'>('BOOKED');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [patientRes, appointmentsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients/${patientId}`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/by-patient/${patientId}`),
        ]);

        if (!patientRes.ok) throw new Error('Failed to fetch patient');
        if (!appointmentsRes.ok) throw new Error('Failed to fetch appointments');

        const patientData = await patientRes.json();
        const appointmentsData = await appointmentsRes.json();

        setPatient(patientData);
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const handleCancel = async (appointmentId: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });

      if (!res.ok) throw new Error('Failed to cancel appointment');

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: 'CANCELLED' } : appt
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReschedule = (appt: Appointment) => {
   
    router.push(`/reschedule?appointmentId=${appt.id}&patientId=${patientId}`);
    

  };

  const filteredAppointments = appointments.filter(
    (appt) => appt.status === activeTab
  );

  if (!patientId) return <p className="p-6">Patient ID is missing.</p>;
  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Appointments for {patient?.name}</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('BOOKED')}
          className={`px-4 py-2 rounded ${activeTab === 'BOOKED' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Booked
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
              <img
                src={appt.doctor.image || '/default-doctor.png'}
                alt="Doctor"
                className="w-20 h-20 object-cover rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">Dr. {appt.doctor.name}</h2>
              <p className="text-gray-700"><strong>Date:</strong> {appt.date}</p>
              <p className="text-gray-700"><strong>Day:</strong> {appt.day}</p>
              <p className="text-gray-700">
                <strong>Time:</strong> {appt.startTime.slice(0, 5)} - {appt.endTime.slice(0, 5)}
              </p>

              {activeTab === 'BOOKED' && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReschedule(appt)}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  >
                    Reschedule
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