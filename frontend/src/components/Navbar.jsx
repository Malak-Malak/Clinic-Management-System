import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b px-6 py-3 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/patient/dashboard" className="font-semibold">
          Clinic
        </Link>
        <Link to="/patient/doctors" className="text-gray-600 hover:text-black">
          Doctors
        </Link>
        {user?.role === 'Patient' && (
          <Link to="/patient/appointments" className="text-gray-600 hover:text-black">
            My Appointments
          </Link>
        )}
        {user?.role === 'Patient' && (
          <Link to="/patient/visits" className="text-gray-600 hover:text-black">
            Visit History
          </Link>
        )}
        {user?.role === 'Admin' && (
          <Link to="/admin/doctors" className="text-gray-600 hover:text-black">
            Manage Doctors
          </Link>
        )}
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.fullName}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}