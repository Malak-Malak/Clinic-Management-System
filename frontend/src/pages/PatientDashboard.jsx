import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';

export default function PatientDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
        <h1 className="text-2xl font-semibold mb-2">Welcome, {user?.fullName}</h1>
        <p className="text-gray-600">Email: {user?.email}</p>
        <p className="text-gray-600">Role: {user?.role}</p>
      </div>
    </div>
  );
}