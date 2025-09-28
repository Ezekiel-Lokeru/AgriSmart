import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import WeatherWidget from '../components/Weather';

export default function Dashboard() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError('');
    try {
      const cropsRes = await api.get('/v1/crops/all');
      const cropsList = Array.isArray(cropsRes.data.data) ? cropsRes.data.data : [];

      const diagnosisPromises = cropsList.map(async crop => {
        try {
          const diagRes = await api.get(`/v1/crops/analysis-history/${crop.id}`);
          const history = diagRes.data?.data || [];
          const latestDiag = history.length > 0 ? history[0] : null;
          return { ...crop, diagnosis: latestDiag, history };
        } catch (err) {
          console.error(`Failed to fetch diagnosis for crop ${crop.id}`, err);
          return { ...crop, diagnosis: null, history: [] };
        }
      });

      const cropsWithDiagnosis = await Promise.all(diagnosisPromises);
      setCrops(cropsWithDiagnosis);
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  const openHistory = crop => {
    setSelectedCrop(crop);
    setModalOpen(true);
  };

  const closeHistory = () => {
    setSelectedCrop(null);
    setModalOpen(false);
  };

  const handleReDiagnose = async (cropId) => {
    try {
      await api.post(`/v1/crops/analyze/${cropId}`);
      alert('Crop re-diagnosed successfully!');
      fetchData();
    } catch (err) {
      console.error('Re-diagnose failed:', err);
      alert('Failed to re-diagnose crop.');
    }
  };

  const handleDelete = async (cropId) => {
    if (!window.confirm('Are you sure you want to delete this crop?')) return;

    try {
      await api.delete(`/v1/crops/${cropId}`);
      alert('Crop deleted successfully!');
      setCrops(crops.filter(crop => crop.id !== cropId));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete crop.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-green-700 text-white px-4 py-3">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Dashboard</h1>
          <p className="text-green-700 mb-8">
            Welcome to your dashboard. Access your crops, weather, and more.
          </p>

          {loading && <div className="text-green-800">Loading...</div>}
          {error && <div className="text-red-600">{error}</div>}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-10">
              {/* Crops & Diagnosis Widget */}
              <div className="bg-white rounded-xl shadow p-6 col-span-2">
                <div className="flex flex-col items-center mb-4">
                  <span className="text-green-600 text-3xl mb-2">🌱</span>
                  <h2 className="text-xl font-semibold text-green-800 mb-1">My Crops & Diagnosis</h2>
                  <p className="text-green-700 text-center">
                    You have <span className="font-bold">{crops.length}</span> crops.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Link to="/crops" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Go to Crops</Link>
                    <Link to="/crops/add" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Add Crop</Link>
                  </div>
                </div>

                {crops.length === 0 ? (
                  <div className="text-green-700 text-center">No crops found.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {crops.map(crop => (
                      <div key={crop.id} className="bg-green-50 border border-green-200 rounded-lg p-4 shadow hover:shadow-md transition flex flex-col">
                        {/* Crop Image */}
                        <div className="w-full h-40 mb-3 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                          {crop.image_url ? (
                            <img src={crop.image_url} alt={crop.crop_name} className="w-full h-full object-cover"/>
                          ) : (
                            <span className="text-gray-400 text-sm">No image</span>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-green-800">{crop.crop_name}</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Disease: <span className="font-medium">
                            {crop.diagnosis?.plant_id_response?.disease_name ||
                              (crop.diagnosis ? 'Healthy' : 'No analysis yet')}
                          </span>
                        </p>
                        <p className="text-sm text-green-700">
                          Treatment: <span className="font-medium">
                            {crop.diagnosis?.plant_id_response?.treatment ||
                              (crop.diagnosis ? 'No treatment needed' : 'N/A')}
                          </span>
                        </p>
                        {crop.diagnosis?.ai_recommendation && (
                          <p className="text-sm text-green-700">
                            AI Advice: <span className="italic">{crop.diagnosis.ai_recommendation}</span>
                          </p>
                        )}
                        {crop.diagnosis?.confidence_level && (
                          <p className="text-sm text-green-700">
                            Confidence: <span className="font-medium">{crop.diagnosis.confidence_level}%</span>
                          </p>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => openHistory(crop)}
                            className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                          >
                            View More
                          </button>
                          <button
                            onClick={() => handleReDiagnose(crop.id)}
                            className="flex-1 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition"
                          >
                            Re-diagnose
                          </button>
                          <button
                            onClick={() => handleDelete(crop.id)}
                            className="flex-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Placeholder for Weather Widget */}
              <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
                <span className="text-blue-600 text-3xl mb-2">☀️</span>
                <h2 className="text-xl font-semibold text-green-800 mb-1">Weather Widget</h2>
                <p className="text-green-700 text-center">
                  <WeatherWidget />
                </p>
              </div>
            </div>
          )}

          {/* Modal for Crop History */}
          {modalOpen && selectedCrop && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  {selectedCrop.crop_name} - Analysis History
                </h3>
                {selectedCrop.history.length === 0 ? (
                  <p className="text-green-700">No analysis history available.</p>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {selectedCrop.history.map((h, idx) => (
                      <div key={idx} className="border border-green-200 rounded-lg p-3 bg-green-50">
                        <p className="text-sm text-green-700">
                          Disease: <span className="font-medium">{h.plant_id_response?.disease_name || 'Healthy'}</span>
                        </p>
                        <p className="text-sm text-green-700">
                          Treatment: <span className="font-medium">{h.plant_id_response?.treatment || 'No treatment needed'}</span>
                        </p>
                        {h.ai_recommendation && (
                          <p className="text-sm text-green-700">
                            AI Advice: <span className="italic">{h.ai_recommendation}</span>
                          </p>
                        )}
                        {h.confidence_level && (
                          <p className="text-sm text-green-700">
                            Confidence: <span className="font-medium">{h.confidence_level}%</span>
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(h.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={closeHistory}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
