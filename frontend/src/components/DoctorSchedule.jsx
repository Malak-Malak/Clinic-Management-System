import { useState, useEffect } from 'react';
import {
  getSchedulesByDoctor,
  createSchedule,
  deleteSchedule,
} from '../services/scheduleService';

const DAYS = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

export default function DoctorSchedule({ doctorId }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');

  const fetchSchedules = async () => {
    try {
      const response = await getSchedulesByDoctor(doctorId);
      setSchedules(response.data);
    } catch (err) {
      setError('Unable to load schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [doctorId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await createSchedule(doctorId, {
        dayOfWeek: Number(dayOfWeek),
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
      });
      fetchSchedules();
    } catch (err) {
      setError('Invalid time range, or end time is before start time.');
    }
  };

  const handleDelete = async (scheduleId) => {
    try {
      await deleteSchedule(doctorId, scheduleId);
      fetchSchedules();
    } catch (err) {
      setError('Unable to delete schedule.');
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading schedule...</p>;
  }

  return (
    <div className="mt-3 border-t pt-3">
      <h3 className="text-sm font-semibold mb-2">Weekly Schedule</h3>

      {error && (
        <div className="bg-red-100 text-red-700 text-xs p-2 rounded mb-2">
          {error}
        </div>
      )}

      {schedules.length === 0 ? (
        <p className="text-sm text-gray-400 mb-2">No availability set.</p>
      ) : (
        <ul className="mb-3 space-y-1">
          {schedules.map((s) => (
            <li
              key={s.id}
              className="flex justify-between items-center text-sm bg-gray-50 px-3 py-1 rounded"
            >
              <span>
                {s.dayOfWeek}: {s.startTime} - {s.endTime}
              </span>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-red-600 hover:underline text-xs"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="flex gap-2 items-end flex-wrap">
        <div>
          <label className="block text-xs text-gray-500">Day</label>
          <select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            {DAYS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500">Start</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500">End</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Add Slot
        </button>
      </form>
    </div>
  );
}