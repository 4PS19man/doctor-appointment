'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaBriefcaseMedical, FaPhone, FaEnvelope, FaVenusMars } from 'react-icons/fa';



interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  day: string;
  date: string;  // Add date here
  slotStartTime: string;
  slotEndTime: string;
  startTime: string;
  endTime: string;
  status: string;
  doctorName: string;
  name: string;
  doctor?: Doctor;
}

interface Slot {
  id: number;
  startTime: string;
  endTime: string;
}

interface Availability {
  id: number;
  dayOfWeek: string;
  location: string;
  slots: Slot[];
}

interface Doctor {
  id: number;
  name: string;
  availabilities: Availability[];
  specialization: string;
  experience: number;
  phoneNumber: string;
  email: string;
  gender: string;
  image: string;
}


  

export default function RescheduleAppointment() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const appointmentId = searchParams.get('appointmentId');
  const patientId = searchParams.get('patientId');

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [day, setDay] = useState('');
  const [date, setDate] = useState(''); // new date state
  const [slotStartTime, setSlotStartTime] = useState('');
  const [slotEndTime, setSlotEndTime] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);

  useEffect(() => {
    if (!appointmentId) return;

    async function fetchData() {
      setLoading(true);
      try {
        const apptRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/${appointmentId}`);
        if (!apptRes.ok) throw new Error('Failed to fetch appointment');
        const apptData: Appointment = await apptRes.json();
        setAppointment(apptData);

        const doctorId = apptData.doctor?.id;
        if (!doctorId) throw new Error('Doctor ID missing in appointment data');

        const doctorRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/${doctorId}`);
        if (!doctorRes.ok) throw new Error('Failed to fetch doctor details');
        const doctorData: Doctor = await doctorRes.json();
        setDoctor(doctorData);

        setDay(apptData.day);
        setDate(apptData.date || ''); // set date from appointment
        setSlotStartTime(apptData.slotStartTime);
        setSlotEndTime(apptData.slotEndTime);
        setStartTime(apptData.startTime);
        setEndTime(apptData.endTime);

        const dayAvailability = doctorData.availabilities.find((a) => a.dayOfWeek === apptData.day);
        setFilteredSlots(dayAvailability ? dayAvailability.slots : []);
      } catch (err) {
        console.error(err);
        setError('Could not load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [appointmentId]);

  useEffect(() => {
    if (!day || !doctor) {
      setFilteredSlots([]);
      setSlotStartTime('');
      setSlotEndTime('');
      return;
    }
    const dayAvailability = doctor.availabilities.find(a => a.dayOfWeek === day);
    const slots = dayAvailability ? dayAvailability.slots : [];
    setFilteredSlots(slots);

    if (!slots.find(s => s.startTime === slotStartTime && s.endTime === slotEndTime)) {
      setSlotStartTime('');
      setSlotEndTime('');
      setStartTime('');
      setEndTime('');
    }
  }, [day, doctor, slotStartTime, slotEndTime]);

  function generateTimeOptions(slotStart: string, slotEnd: string) {
    const intervals: { start: string; end: string }[] = [];
    if (!slotStart || !slotEnd) return intervals;

    const [sh, sm] = slotStart.split(':').map(Number);
    const [eh, em] = slotEnd.split(':').map(Number);

    let current = new Date();
    current.setHours(sh, sm, 0, 0);

    const end = new Date();
    end.setHours(eh, em, 0, 0);

    while (current.getTime() + 10 * 60 * 1000 <= end.getTime()) {
      const start = current.toTimeString().slice(0, 5);
      current = new Date(current.getTime() + 10 * 60 * 1000);
      const endTime = current.toTimeString().slice(0, 5);
      intervals.push({ start, end: endTime });
    }

    return intervals;
  }

  const timeOptions = generateTimeOptions(slotStartTime, slotEndTime);

  useEffect(() => {
    setStartTime('');
    setEndTime('');
  }, [slotStartTime, slotEndTime]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!appointmentId) return;

    const updatedData = {
      day,
      date, // include date in update payload
      slotStartTime,
      slotEndTime,
      startTime,
      endTime,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error('Failed to update appointment');

      alert('Appointment updated successfully');
      router.push(`/patient_appointments?patientId=${patientId}`);
    } catch (err) {
      alert('Error updating appointment');
      console.error(err);
    }
  }

  if (loading) return <div className="p-4">Loading appointment details...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!appointment || !doctor) return <div className="p-4">Appointment or Doctor not found</div>;




return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 py-12 px-8 flex justify-center">
    <div className="flex flex-col md:flex-row gap-10 max-w-6xl w-full">
  
      {/* Left: Doctor info card */}
      <div className="w-full md:w-96 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <img
          src={doctor.image || '/default-doctor.png'}
          alt={doctor.name}
          className="w-36 h-36 rounded-full object-cover mb-6 border-4 border-blue-400 shadow-md"
        />
        <h2 className="text-3xl font-semibold text-blue-900 mb-1 text-center">{doctor.name}</h2>
        <p className="text-center text-lg text-gray-600 mb-6">{doctor.specialization}</p>
  
        <div className="space-y-3 text-sm text-gray-700 pl-12 pr-6">
          <div className="flex items-center gap-3">
            <FaBriefcaseMedical className="text-blue-500 text-xl" />
            <span className="font-medium">Experience:</span>
            <span>{doctor.experience} years</span>
          </div>
          <div className="flex items-center gap-3">
            <FaPhone className="text-green-500 text-xl" />
            <span className="font-medium">Contact:</span>
            <span>{doctor.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-red-500 text-xl" />
            <span className="font-medium">Email:</span>
            <span>{doctor.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaVenusMars className="text-purple-500 text-xl" />
            <span className="font-medium">Gender:</span>
            <span>{doctor.gender}</span>
          </div>
        </div>
      </div>
  
      {/* Right: Appointment form */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-8 max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-3">Reschedule Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
  
          {/* Day selector */}
          <div>
            <label htmlFor="day" className="block font-semibold mb-2 text-gray-700">Day</label>
            <select
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="" disabled>Select day</option>
              {doctor.availabilities.map((a) => (
                <option key={a.id} value={a.dayOfWeek}>
                  {a.dayOfWeek}
                </option>
              ))}
            </select>
          </div>
  
          {/* Date selector */}
          <div>
            <label htmlFor="date" className="block font-semibold mb-2 text-gray-700">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
  
          {/* Slot selector */}
          <div>
            <label htmlFor="slot" className="block font-semibold mb-2 text-gray-700">Slot</label>
            <select
              id="slot"
              value={slotStartTime && slotEndTime ? `${slotStartTime}-${slotEndTime}` : ''}
              onChange={(e) => {
                const [start, end] = e.target.value.split('-');
                setSlotStartTime(start);
                setSlotEndTime(end);
              }}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
              required
              disabled={!filteredSlots.length}
            >
              <option value="" disabled>
                {filteredSlots.length ? 'Select slot' : 'No slots available'}
              </option>
              {filteredSlots.map((slot) => (
                <option
                  key={`${slot.startTime}-${slot.endTime}`}
                  value={`${slot.startTime}-${slot.endTime}`}
                >
                  {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                </option>
              ))}
            </select>
          </div>
  
          {/* Time interval selector */}
          <div>
            <label htmlFor="time" className="block font-semibold mb-2 text-gray-700">Time</label>
            <select
              id="time"
              value={startTime && endTime ? `${startTime}-${endTime}` : ''}
              onChange={(e) => {
                const [start, end] = e.target.value.split('-');
                setStartTime(start);
                setEndTime(end);
              }}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
              required
              disabled={!timeOptions.length}
            >
              <option value="" disabled>Select time interval</option>
              {timeOptions.map(({ start, end }) => (
                <option key={`${start}-${end}`} value={`${start}-${end}`}>
                  {start} - {end}
                </option>
              ))}
            </select>
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
          >
            Update Appointment
          </button>
        </form>
      </div>
  
    </div>
  </div>
  
  );
  
}