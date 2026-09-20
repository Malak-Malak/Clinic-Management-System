import { useState, useEffect } from 'react';
import {
  getAllDoctors,
  createDoctor,
  deactivateDoctor,
} from '../../services/doctorService';
import Navbar from '../../components/Navbar';
import DoctorSchedule from '../../components/DoctorSchedule';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    specialty: '',
    description: '',
  });

  const fetchDoctors = async () => {
    try {
      const response = await getAllDoctors();
      setDoctors(response.data);
    } catch (err) {
      setError('Unable to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      await createDoctor(formData);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        specialty: '',
        description: '',
      });
      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      if (err.response?.status === 409) {
        setFormError('A user with this email already exists.');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateDoctor(id);
      fetchDoctors();
    } catch (err) {
      setError('Unable to deactivate doctor.');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading doctors...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Manage Doctors</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Doctor'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-white p-6 rounded-lg shadow-sm border mb-6 space-y-3"
          >
            {formError && (
              <div className="bg-red-100 text-red-700 text-sm p-2 rounded">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-xs text-blue-600 hover:underline"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Specialty</label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Create Doctor
            </button>
          </form>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white p-4 rounded-lg shadow-sm border"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">{doctor.fullName}</h2>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  <p className="text-xs text-gray-400">{doctor.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  {doctor.isActive ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                  {doctor.isActive && (
                    <button
                      onClick={() => handleDeactivate(doctor.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Deactivate
                    </button>
                  )}
                  <button
                    onClick={() => toggleExpand(doctor.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {expandedId === doctor.id ? 'Hide Schedule' : 'Manage Schedule'}
                  </button>
                </div>
              </div>

              {expandedId === doctor.id && (
                <DoctorSchedule doctorId={doctor.id} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}