import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Welcome, {user?.fullName}</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
        <p className="text-gray-600">Email: {user?.email}</p>
        <p className="text-gray-600">Role: {user?.role}</p>
      </div>
    </div>
  );
}