import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { getDashboardStats } from '../../services/dashboardService';
import Navbar from '../../components/Navbar';

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError('Unable to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Doctors" value={stats.totalDoctors} />
          <StatCard label="Total Patients" value={stats.totalPatients} />
          <StatCard label="Today's Appointments" value={stats.todaysAppointments} />
          <StatCard label="Completed Today" value={stats.completedToday} />
          <StatCard label="Cancelled Today" value={stats.cancelledToday} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <h2 className="font-semibold mb-4">Appointments by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.appointmentsByStatus}>
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h2 className="font-semibold mb-4">Appointments per Day (Last 7 Days)</h2>
          {stats.appointmentsPerDay.length === 0 ? (
            <p className="text-sm text-gray-400">No appointment data in this range.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.appointmentsPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#16a34a" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}