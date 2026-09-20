import { useState } from 'react';
import { getAvailableSlots, bookAppointment } from '../services/appointmentService';

export default function BookingPanel({ doctorId, onBooked }) {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    setSelectedTime('');
    setError('');
    setSuccess('');

    if (!newDate) {
      setSlots([]);
      return;
    }

    setLoading(true);
    try {
      const response = await getAvailableSlots(doctorId, newDate);
      setSlots(response.data);
    } catch (err) {
      setError('Unable to load available slots.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    setError('');
    setSuccess('');

    try {
      await bookAppointment({
        doctorId,
        appointmentDate: date,
        appointmentTime: `${selectedTime}:00`,
      });
      setSuccess('Appointment booked successfully.');
      setSelectedTime('');
      setSlots(slots.filter((s) => s.time !== selectedTime));
      if (onBooked) onBooked();
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This slot is no longer available. Please pick another.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="mt-3 border-t pt-3">
      <h3 className="text-sm font-semibold mb-2">Book an Appointment</h3>

      {error && (
        <div className="bg-red-100 text-red-700 text-xs p-2 rounded mb-2">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 text-xs p-2 rounded mb-2">
          {success}
        </div>
      )}

      <input
        type="date"
        value={date}
        min={today}
        onChange={handleDateChange}
        className="border rounded px-2 py-1 text-sm mb-3"
      />

      {loading && <p className="text-sm text-gray-500">Loading slots...</p>}

      {!loading && date && slots.length === 0 && (
        <p className="text-sm text-gray-400">No available slots for this date.</p>
      )}

      {slots.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {slots.map((s) => (
            <button
              key={s.time}
              onClick={() => setSelectedTime(s.time)}
              className={`text-sm px-3 py-1 rounded border ${
                selectedTime === s.time
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {s.time}
            </button>
          ))}
        </div>
      )}

      {selectedTime && (
        <button
          onClick={handleBook}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
        >
          Confirm Booking for {selectedTime}
        </button>
      )}
    </div>
  );
}