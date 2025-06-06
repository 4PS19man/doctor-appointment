'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, UserCircle2, CalendarHeart } from 'lucide-react';
import axios from 'axios';

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    return `${hour}:${minute}`;
  };
  

  const [form, setForm] = useState({
    location: '',
    dayOfWeek: '',
    slots: [''],
  });

  // Holds slot input arrays keyed by availability id
  const [slotForms, setSlotForms] = useState<{ [availabilityId: string]: string[] }>({});

  // Track which availability ids are currently showing input fields and Add Slots button
  const [editingAvailabilityIds, setEditingAvailabilityIds] = useState<Set<string>>(new Set());

  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (!data) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(data);
    if (parsed.role !== 'doctor' || !parsed.doctor) {
      router.push('/login');
      return;
    }

    fetchDoctor(parsed.doctor.id);
  }, [router]);
   
  const handleViewAppointments = (doctorId: string) => {
    router.push(`/doctor_appointments?doctorId=${doctorId}`);
  };


  const fetchDoctor = async (doctorId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/${doctorId}`);

      if (!res.ok) throw new Error('Failed to fetch doctor data');
      const data = await res.json();
      setDoctor(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load doctor data');
      setLoading(false);
    }
  };

  // --- Form handlers for new availability ---

  const handleSlotChange = (index: number, value: string) => {
    const updatedSlots = [...form.slots];
    updatedSlots[index] = value;
    setForm({ ...form, slots: updatedSlots });
  };

  const handleAddSlot = () => {
    setForm({ ...form, slots: [...form.slots, ''] });
  };

  const handleAvailabilitySubmit = async () => {
    if (!form.location.trim()) return alert('Please enter a location');
    if (!form.dayOfWeek) return alert('Please select a day of the week');
    for (const slot of form.slots) {
      if (!slot || !/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(slot)) {
        return alert('Please fill out all slot times in the format HH:mm-HH:mm');
      }
    }

    const slotsObj = form.slots.map((s) => {
      const [startTime, endTime] = s.split('-');
      return { startTime, endTime };
    });

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/availability`, {
        doctorId: doctor.id,
        location: form.location,
        dayOfWeek: form.dayOfWeek,
        slots: slotsObj,
      });

      const newAvailability = response.data;
      setDoctor((prev: any) => ({
        ...prev,
        availabilities: [...(prev.availabilities || []), newAvailability],
      }));

      setForm({ location: '', dayOfWeek: '', slots: [''] });
      setShowForm(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error adding availability');
    }
  };

  // --- Handlers for adding slots to existing availability ---

  const handleNewSlotChange = (availabilityId: string, index: number, value: string) => {
    const currentSlots = slotForms[availabilityId] ?? [];
    const updatedSlots = [...currentSlots];
    updatedSlots[index] = value;
    setSlotForms({
      ...slotForms,
      [availabilityId]: updatedSlots,
    });
  };

  const handleAddMoreSlotField = (availabilityId: string) => {
    const currentSlots = slotForms[availabilityId] ?? [];

    // If currently not editing this availability, start editing (show input + Add Slots button)
    if (!editingAvailabilityIds.has(availabilityId)) {
      setEditingAvailabilityIds(new Set(editingAvailabilityIds).add(availabilityId));
      // Initialize slot input with one empty string if none exist
      if (!slotForms[availabilityId] || slotForms[availabilityId].length === 0) {
        setSlotForms({
          ...slotForms,
          [availabilityId]: [''],
        });
        return; // No need to add another empty string here, just initialize
      }
    }

    // Add a new empty slot input field
    setSlotForms({
      ...slotForms,
      [availabilityId]: [...currentSlots, ''],
    });
  };



const handleAddSlotToAvailability = async (availabilityId: string) => {
    const newSlots = slotForms[availabilityId] ?? [];
  
    // Validate slot format
    for (const slot of newSlots) {
      if (!slot || !/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(slot)) {
        return alert('Please complete all slot times in the format HH:mm-HH:mm');
      }
    }
  
    // Convert newSlots strings into slot objects
    const slotsObj = newSlots.map((s) => {
      const [startTime, endTime] = s.split('-');
      return { startTime, endTime };
    });
  
    try {
      // Send new slots to backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/slots/upsert`, {
        availabilityId,
        slots: slotsObj,
      });
  
      // Backend returns updated list of slots
      const updatedSlots = response.data; // expecting updated Slot[]
  
      // Update local doctor state with updated slots from backend
      setDoctor((prev: any) => ({
        ...prev,
        availabilities: prev.availabilities.map((a: any) =>
          a.id === availabilityId
            ? {
                ...a,
                slots: updatedSlots, // replace slots with backend updated list
              }
            : a
        ),
      }));
  
      // Reset input form for this availability & stop editing
      setSlotForms((prev) => ({ ...prev, [availabilityId]: [] }));
      const newEditingSet = new Set(editingAvailabilityIds);
      newEditingSet.delete(availabilityId);
      setEditingAvailabilityIds(newEditingSet);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to add slots to availability');
    }
  };
  

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading doctor data...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Profile */}
          <div className="col-span-1 flex flex-col items-center text-center">
            {/* <img
              src={doctor.profileImageUrl || '/default-doctor.png'}
              alt="Doctor"
              className="w-40 h-40 rounded-full object-cover border-4 border-sky-600 shadow-md"
            /> */}
            <img
             src={doctor.image}  // the full URL from backend
              alt="Doctor"
              className="w-40 h-40 rounded-full object-cover border-4 border-sky-600 shadow-md"
             />
            

            <h2 className="mt-4 text-2xl font-bold text-sky-800">Dr. {doctor.name}</h2>
            <div className="mt-2 space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2 justify-center">
                <Mail className="w-4 h-4 text-sky-600" />
                {doctor.email}
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Phone className="w-4 h-4 text-sky-600" />
                {doctor.phoneNumber}
              </div>
              <div className="flex items-center gap-2 justify-center">
                <UserCircle2 className="w-4 h-4 text-sky-600" />
                {doctor.gender}
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-800 bg-sky-50 p-3 rounded-lg w-full">
              <p>
                <strong>Specialization:</strong> {doctor.specialization}
              </p>
              <p>
                <strong>Experience:</strong> {doctor.experience} years
              </p>
               {/* View Appointments Button */}
              
            </div>
            <button
      onClick={() => handleViewAppointments(doctor.id)}
      className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md transition w-full"
    >
      View Appointments
    </button>
          </div>

          {/* Availability */}
          <div className="col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-sky-700 flex items-center gap-2">
                <CalendarHeart className="w-6 h-6" /> Availabilities
              </h3>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-md transition"
              >
                {showForm ? 'Cancel' : '+ Add Availability'}
              </button>
            </div>

            {showForm && (
              <div className="bg-sky-50 border border-sky-200 p-4 rounded-lg mb-6">
                
                <input
  type="text"
  placeholder="Enter Location"
  value={form.location}
  onChange={(e) => setForm({ ...form, location: e.target.value })}
  className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
/>
                <select
                  value={form.dayOfWeek}
                  onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                  className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"

                >
                  <option value="">Select Day</option>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                    (day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    )
                  )}
                </select>
                {form.slots.map((slot, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder="e.g. 10:30-11:30"
                    value={slot}
                    onChange={(e) => handleSlotChange(i, e.target.value)}
                    className= "w-full px-4 py-2 mb-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                ))}
                <button onClick={handleAddSlot} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow-sm mr-3 transition">
                  + Add Slot
                </button>
                <button onClick={handleAvailabilitySubmit} className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md shadow-sm transition">
                  Submit
                </button>
                
                
              </div>
            )}

            <div className="space-y-6">
              {(doctor.availabilities || []).map((availability: any) => (
                <div
                  key={availability.id}
                  className="bg-white border border-sky-200 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-xl font-semibold text-sky-700">
                        {availability.location} - {availability.dayOfWeek}
                      </h4>
                    </div>
                    <div>
                      {/* Show Add More button always */}
                      <button
                        onClick={() => handleAddMoreSlotField(availability.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        + Add More
                      </button>
                    </div>
                  </div>

                  {/* List existing slots */}
                  <ul className="mb-4 space-y-2 text-gray-700">
  {(availability.slots || []).map((slot: any, index: number) => (
    <li
      key={index}
      className="inline-block bg-sky-100 text-sky-800 px-3 py-1 rounded-full font-medium mr-2"
    >
        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
    </li>
  ))}
</ul>



                  {/* Show index inputs and Add Slots button only if editing this availability */}
                  {editingAvailabilityIds.has(availability.id) && (
                    <div>
                      {(slotForms[availability.id] || []).map((slot, idx) => (
                        <input
                          key={idx}
                          type="text"
                          placeholder="HH:mm-HH:mm"
                          value={slot}
                          onChange={(e) => handleNewSlotChange(availability.id, idx, e.target.value)}
                          className="w-40 px-3 py-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      ))}
                      <button
                        onClick={() => handleAddSlotToAvailability(availability.id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md shadow-sm transition ml-2"
                      >
                        Add Slots
                      </button>
                    </div>
                  )}
                </div>
              ))}
               {doctor.availabilities?.length === 0 && (
                <p className="text-left text-gray-500 mt-10">No availabilities yet.</p>

              )}
          


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}