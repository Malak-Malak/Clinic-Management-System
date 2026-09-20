import { useState, useEffect } from 'react';
import { getAllDoctors } from '../services/doctorService';
import Navbar from '../components/Navbar';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAllDoctors();
        setDoctors(response.data);
      } catch (err) {
        setError('Unable to load doctors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.fullName.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center">Loading doctors...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-6">Our Doctors</h1>

        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {filteredDoctors.length === 0 ? (
          <p className="text-gray-500 text-center">No doctors found.</p>
        ) : (
          <div className="grid gap-4">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{doctor.fullName}</h2>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  <p className="text-sm text-gray-500 mt-1">{doctor.description}</p>
                </div>
                {!doctor.isActive && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    Inactive
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}