import { useState, useEffect } from 'react';
import { getMyAppointments, cancelAppointment } from '../services/appointmentService';
import Navbar from '../components/Navbar';

const statusStyles = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-gray-200 text-gray-600',
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const response = await getMyAppointments();
      setAppointments(response.data);
    } catch (err) {
      setError('Unable to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      fetchAppointments();
    } catch (err) {
      setError('Unable to cancel appointment.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading appointments...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-6">My Appointments</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {appointments.length === 0 ? (
          <p className="text-gray-500">You have no appointments yet.</p>
        ) : (
          <div className="grid gap-4">
            {appointments.map((a) => (
              <div
                key={a.id}
                className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{a.doctorName}</h2>
                  <p className="text-sm text-gray-600">{a.specialty}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(a.appointmentDate).toLocaleDateString()} at {a.appointmentTime}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded ${statusStyles[a.status] || ''}`}
                  >
                    {a.status}
                  </span>
                  {a.status === 'Scheduled' && (
                    <button
                      onClick={() => handleCancel(a.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}