import MyAppointments from './pages/MyAppointments';
import AdminDoctors from './pages/admin/AdminDoctors';
import ProtectedRoute from './components/ProtectedRoute';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import Doctors from './pages/Doctors';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
<Route path="/patient/appointments" element={<MyAppointments />} />
      <Route path="/patient/doctors" element={<Doctors />} />
      <Route
  path="/admin/doctors"
  element={
    <ProtectedRoute allowedRoles={['Admin']}>
      <AdminDoctors />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;
