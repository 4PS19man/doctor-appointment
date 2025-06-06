'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaBriefcaseMedical, FaPhone, FaEnvelope, FaVenusMars } from 'react-icons/fa';

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

interface Patient {
  name: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phoneNumber: string;
  email: string;
  gender: string;
  experience: string;
  image: string;
  weekOfDay: string;
}

export default function BookAppointment() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const doctorId = searchParams.get('doctorId');
  const patientId = searchParams.get('patientId');

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [allSlots, setAllSlots] = useState<Slot[]>([]);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<number | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<{ startTime: string; endTime: string; slotId: number } | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [bookedIntervals, setBookedIntervals] = useState<Set<string>>(new Set());
  const [slotStartTime, setSlotStartTime] = useState('');
  const [slotEndTime, setSlotEndTime] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  


  const allWeekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (!patientId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients/${patientId}`)
      .then(res => res.json())
      .then(setPatient)
      .catch(console.error);
  }, [patientId]);

  useEffect(() => {
    if (!doctorId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/${doctorId}`)
      .then(res => res.json())
      .then(setDoctor)
      .catch(console.error);

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/availability/doctor/${doctorId}`)
      .then(res => res.json())
      .then(setAvailability)
      .catch(console.error);
  }, [doctorId]);

  useEffect(() => {
    if (!doctorId || !selectedDay || !selectedDate) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/by-doctor/${doctorId}`)
      .then(res => res.json())
      .then(result => {
        const appointments = Array.isArray(result?.data) ? result.data : result;
        const blockedIntervals = new Set<string>();

        console.log('Appointments:', appointments);
appointments.forEach((appt: any) => {
  const start = appt.startTime ? appt.startTime.slice(0,5) : '';
  const end = appt.endTime ? appt.endTime.slice(0,5) : '';
  const apptDay = appt.day?.toLowerCase();
  const selectedDayLower = selectedDay.toLowerCase();
  const apptDate = new Date(appt.date).toISOString().split('T')[0];
  const selectedDateISO = new Date(selectedDate).toISOString().split('T')[0];

  console.log({apptDay, selectedDayLower, apptDate, selectedDateISO, start, end});

  // const sameDoctor = String(appt.doctorId) === String(doctorId);
  const sameDoctor = doctorId === String(doctorId);
  console.log('doctorId:', doctorId, 'appt.doctorId:', appt.doctorId);

  const sameDay = apptDay === selectedDayLower;
  const sameDate = apptDate === selectedDateISO;

  console.log({sameDoctor, sameDay, sameDate});

  if (sameDoctor && sameDay && sameDate && start && end) {
    blockedIntervals.add(`${start}-${end}`);
  }
});
setBookedIntervals(blockedIntervals)
console.log('Blocked intervals:', blockedIntervals);

      })
      .catch(console.error);
  }, [doctorId, selectedDay, selectedDate]);

  const handleDaySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const day = e.target.value;
    setSelectedDay(day);
    setSelectedSlotId(null);
    setSelectedInterval(null);
    setSelectedDate('');
    setBookingError(null);
    setBookingSuccess(false);

    const matchedAvailability = availability.find(a => a.dayOfWeek === day);
    if (matchedAvailability) {
      setSelectedAvailabilityId(matchedAvailability.id);
      setAllSlots(matchedAvailability.slots);
    } else {
      setAllSlots([]);
      setSelectedAvailabilityId(null);
    }
  };



  const handleSlotClick = (slotId: number) => {
    const slot = allSlots.find(slot => slot.id === slotId);
    if (slot) {
      setSelectedSlotId(slotId);
      setSelectedSlot(slot);
      setSelectedInterval(null); // Reset interval on slot change
      setBookingError(null);
      setBookingSuccess(false);
  
      // Log after updating slot
      console.log('Slot clicked:', slot);
    }
  };
  
  

  

  const handleIntervalSelect = (slotId: number, start: string, end: string) => {
    setSelectedInterval({ slotId, startTime: start, endTime: end });
    setBookingError(null);
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedAvailabilityId || !selectedSlotId || !selectedInterval || !doctorId || !patientId || !selectedDate) {
      if (!selectedInterval) {
        setBookingError('Please select a 10-minute interval.');
      } else {
        setBookingError('Please select all fields including a valid date.');
      }
      return;
    }
  
    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(false);
  
    try {
      const selectedAvailability = availability.find(a => a.id === selectedAvailabilityId);
      if (!selectedAvailability) throw new Error('Invalid availability.');
  
      const selectedSlot = selectedAvailability.slots.find(s => s.id === selectedSlotId);
      if (!selectedSlot) throw new Error('Invalid slot.');
  
      const payload = {
        doctorId,
        patientId,
        day: selectedAvailability.dayOfWeek,
        date: selectedDate,
        location: selectedAvailability.location,
        slotId: selectedSlotId,
        startTime: selectedInterval.startTime,
        endTime: selectedInterval.endTime,
        name: patient?.name,
        doctorName: doctor?.name,
        slotStartTime: selectedSlot.startTime,
        slotEndTime: selectedSlot.endTime,
      };
  
      console.log('Final payload being sent to backend:', payload);
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Booking failed');
      }
  
      setBookingSuccess(true);
      setTimeout(() => {
        router.push(`/patient_dashboard?patientId=${patientId}`);
      }, 2000);
    } catch (error: any) {
      setBookingError(error.message);
    } finally {
      setBookingLoading(false);
    }
  };
  


  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Doctor Info */}
        <div className="md:w-1/3 bg-white p-6 rounded-3xl shadow-xl border border-blue-100">
  {!doctor ? (
    <p className="text-center text-gray-500">Loading doctor details...</p>
  ) : (
    <>
      <img
        src={doctor.image || '/default-doctor.png'}
        alt={doctor.name}
        className="w-32 h-32 rounded-full object-cover mb-4 mx-auto border-4 border-blue-400 shadow-md"
      />
      <h2 className="text-2xl font-bold text-center text-blue-800">{doctor.name}</h2>
      <p className="text-center text-lg text-gray-600 mb-4">{doctor.specialization}</p>
      <div className="space-y-3 text-sm text-gray-700 pl-20">
  <div className="flex items-center gap-2">
    <FaBriefcaseMedical className="text-blue-500" />
    <span className="font-medium">Experience:</span> {doctor.experience} years
  </div>
  <div className="flex items-center gap-2">
    <FaPhone className="text-green-500" />
    <span className="font-medium">Contact:</span> {doctor.phoneNumber}
  </div>
  <div className="flex items-center gap-2">
    <FaEnvelope className="text-red-500" />
    <span className="font-medium">Email:</span> {doctor.email}
  </div>
  <div className="flex items-center gap-2">
    <FaVenusMars className="text-purple-500" />
    <span className="font-medium">Gender:</span> {doctor.gender}
  </div>
</div>




    </>
  )}
</div>


        {/* Booking Form */}
        <div className="md:w-2/3 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h1 className="text-3xl font-bold mb-6 text-blue-800">Book Appointment</h1>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">Available Day</label>
            <select
              value={selectedDay}
              onChange={handleDaySelect}
              className="w-full border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select a day</option>
              {allWeekDays
                .filter(day => availability.some(av => av.dayOfWeek === day))
                .map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                const inputDate = e.target.value;
                if (!inputDate) return setSelectedDate('');
                const dateDayName = new Date(inputDate).toLocaleDateString('en-US', { weekday: 'long' });
                if (dateDayName !== selectedDay) {
                  setBookingError(`Date must be a ${selectedDay}`);
                  return setSelectedDate('');
                }
                setBookingError(null);
                setSelectedDate(inputDate);
              }}
              min={new Date().toISOString().split('T')[0]}
              disabled={!selectedDay}
              className="w-full border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {allSlots.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-blue-700">Time Slots</h2>
              <div className="flex flex-wrap gap-3">
                {allSlots.map(slot => (
                  <div key={slot.id} className="space-y-1">
                    <button
                      onClick={() => handleSlotClick(slot.id)}
                      className={`px-4 py-2 rounded-full border ${
                        selectedSlotId === slot.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white hover:bg-blue-100 text-blue-800 border-blue-300'
                      }`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                    {selectedSlotId === slot.id && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {generate10MinIntervals(slot.startTime, slot.endTime, bookedIntervals).map((interval, idx) => {
                          const key = `${interval.start}-${interval.end}`;
                          const isBooked = bookedIntervals.has(key);
                          const isSelected =
                            selectedInterval?.startTime === interval.start &&
                            selectedInterval?.endTime === interval.end;
                          return (
                            <button
                              key={idx}
                              onClick={() => !isBooked && handleIntervalSelect(slot.id, interval.start, interval.end)}
                              disabled={isBooked}
                              className={`text-sm px-3 py-1 rounded-full border ${
                                isBooked
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white hover:bg-blue-100 text-blue-700'
                              }`}
                            >
                              {interval.start} - {interval.end}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {bookingError && <p className="text-red-600 mb-4">{bookingError}</p>}
          {bookingSuccess && <p className="text-green-600 mb-4">Appointment booked successfully!</p>}

          <button
            onClick={handleSubmit}
            disabled={bookingLoading}
            className="w-full mt-2 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {bookingLoading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
}

function generate10MinIntervals(startTime: string, endTime: string, bookedIntervals: Set<string>) {
  const intervals = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let start = new Date();
  start.setHours(startHour, startMin, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMin, 0, 0);

  while (start < end) {
    const intervalStart = formatTime(start);
    start.setMinutes(start.getMinutes() + 10);
    if (start > end) break;
    const intervalEnd = formatTime(start);

    intervals.push({
      start: intervalStart,
      end: intervalEnd,
      isBooked: bookedIntervals.has(`${intervalStart}-${intervalEnd}`),
    });
  }

  return intervals;
}

function formatTime(date: Date) {
  return date.toTimeString().slice(0, 5);
}