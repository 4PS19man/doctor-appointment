'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Phone, UserCircle2 } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  phoneNumber: string;
  gender: string;
  experience: string;
  image: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  phoneNumber: string;
}

export default function PatientDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors`);
      const data = await res.json();
      setDoctors(data);
    };

    const fetchPatient = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients/${patientId}`);
      const data = await res.json();
      setPatient(data);
    };

    if (patientId) {
      fetchDoctors();
      fetchPatient();
    }
  }, [patientId]);

  const handleViewDoctor = (doctorId: string) => {
    router.push(`/view_doctor?doctorId=${doctorId}&patientId=${patientId}`);
  };

  const handleBookAppointment = (doctorId: string) => {
    router.push(`/book_appointment?doctorId=${doctorId}&patientId=${patientId}`);
  };

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">List of Doctors</h1>
        <button
          onClick={() => setShowProfile((prev) => !prev)}
          className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
        >
          {showProfile ? 'Hide Profile' : 'Go to Profile'}
        </button>
      </div>

      {showProfile && patient && (
  <div className="fixed top-0 right-0 h-full w-[22rem] bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto transition-transform duration-300 ease-in-out">
    <div className="p-6 pt-12 relative">
      {/* Header */}
      <div className="absolute top-4 left-6 right-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Patient Profile</h2>
        <button
          onClick={() => setShowProfile(false)}
          className="text-gray-400 hover:text-red-500 text-2xl leading-none"
        >
          &times;
        </button>
      </div>

      {/* Profile Info */}
      <div className="mt-6 space-y-5 text-gray-700">
        <div className="flex items-center gap-3">
          <UserCircle2 className="w-5 h-5 text-blue-600" />
          <span>
            <span className="font-semibold text-gray-800">Name:</span> {patient.name}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-green-600" />
          <span>
            <span className="font-semibold text-gray-800">Email:</span> {patient.email}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <UserCircle2 className="w-5 h-5 text-purple-600" />
          <span>
            <span className="font-semibold text-gray-800">Age:</span> {patient.age}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <UserCircle2 className="w-5 h-5 text-pink-500" />
          <span>
            <span className="font-semibold text-gray-800">Gender:</span> {patient.gender}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-yellow-500" />
          <span>
            <span className="font-semibold text-gray-800">Phone:</span> {patient.phoneNumber}
          </span>
        </div>

        {/* Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (patient.id) {
                router.push(`/patient_appointments?patientId=${patient.id}`);
                setShowProfile(false);
              }
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 rounded-lg shadow-md font-semibold"
          >
            View Booked Appointments
          </button>
        </div>
      </div>
    </div>
  </div>
)}



      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
            <div className="flex flex-col items-center p-6">
              <img
                src={doc.image}
                alt="Doctor"
                className="w-32 h-32 rounded-full object-cover border-4 border-sky-600 shadow-md"
              />
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold text-gray-800">{doc.name}</p>
                <p className="text-sm text-gray-600">{doc.specialization}</p>
                <p className="text-sm text-gray-600">{doc.experience} years experience</p>
              </div>
              <div className="mt-4 text-sm text-gray-700 w-full">
                <div className="flex items-center gap-2 justify-center">
                  <Mail className="w-4 h-4 text-sky-600" /> {doc.email}
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Phone className="w-4 h-4 text-sky-600" /> {doc.phoneNumber}
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <UserCircle2 className="w-4 h-4 text-sky-600" /> {doc.gender}
                </div>
              </div>
              <div className="mt-4 flex justify-center gap-4 w-full">
                <button
                  onClick={() => handleViewDoctor(doc.id)}
                  className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  More Info
                </button>
                <button
                  onClick={() => handleBookAppointment(doc.id)}
                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}