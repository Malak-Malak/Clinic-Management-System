import { useState, useEffect } from 'react';
import { getDoctorAppointments, completeVisit } from '../../services/appointmentService';
import Navbar from '../../components/Navbar';

const statusStyles = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-gray-200 text-gray-600',
};

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notesDraft, setNotesDraft] = useState({});
  const [openNotesId, setOpenNotesId] = useState(null);

  const fetchAppointments = async () => {
    try {
      const response = await getDoctorAppointments();
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

  const handleNotesChange = (id, value) => {
    setNotesDraft({ ...notesDraft, [id]: value });
  };

  const handleComplete = async (id) => {
    setError('');
    try {
      await completeVisit(id, notesDraft[id] || '');
      setOpenNotesId(null);
      fetchAppointments();
    } catch (err) {
      setError('Unable to complete visit. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading appointments...</div>;
  }

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(
    (a) => a.appointmentDate.split('T')[0] === today
  );
  const otherAppointments = appointments.filter(
    (a) => a.appointmentDate.split('T')[0] !== today
  );

  const renderAppointment = (a) => (
    <div
      key={a.id}
      className="bg-white p-4 rounded-lg shadow-sm border"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold">{a.patientName}</h2>
          <p className="text-sm text-gray-500">
            {new Date(a.appointmentDate).toLocaleDateString()} at {a.appointmentTime}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-1 rounded ${statusStyles[a.status] || ''}`}>
            {a.status}
          </span>
          {a.status === 'Scheduled' && (
            <button
              onClick={() => setOpenNotesId(openNotesId === a.id ? null : a.id)}
              className="text-sm text-blue-600 hover:underline"
            >
              {openNotesId === a.id ? 'Cancel' : 'Complete Visit'}
            </button>
          )}
        </div>
      </div>

      {openNotesId === a.id && (
        <div className="mt-3 border-t pt-3">
          <label className="block text-sm font-medium mb-1">Visit Notes</label>
          <textarea
            value={notesDraft[a.id] || ''}
            onChange={(e) => handleNotesChange(a.id, e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm mb-2"
            rows={3}
            placeholder="Enter visit notes..."
          />
          <button
            onClick={() => handleComplete(a.id)}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
          >
            Save & Complete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-6">Doctor Dashboard</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <h2 className="text-lg font-semibold mb-3">Today's Appointments</h2>
        {todaysAppointments.length === 0 ? (
          <p className="text-gray-500 mb-6">No appointments today.</p>
        ) : (
          <div className="grid gap-4 mb-6">
            {todaysAppointments.map(renderAppointment)}
          </div>
        )}

        <h2 className="text-lg font-semibold mb-3">All Appointments</h2>
        {otherAppointments.length === 0 ? (
          <p className="text-gray-500">No other appointments.</p>
        ) : (
          <div className="grid gap-4">
            {otherAppointments.map(renderAppointment)}
          </div>
        )}
      </div>
    </div>
  );
}