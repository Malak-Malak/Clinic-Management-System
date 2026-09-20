import { useState, useEffect } from 'react';
import { getMyVisits } from '../services/visitRecordService';
import Navbar from '../components/Navbar';

export default function VisitHistory() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await getMyVisits();
        setVisits(response.data);
      } catch (err) {
        setError('Unable to load visit history.');
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading visit history...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-6">Visit History</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {visits.length === 0 ? (
          <p className="text-gray-500">No completed visits yet.</p>
        ) : (
          <div className="grid gap-4">
            {visits.map((v) => (
              <div
                key={v.id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold">{v.doctorName}</h2>
                  <span className="text-sm text-gray-500">
                    {new Date(v.appointmentDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{v.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}