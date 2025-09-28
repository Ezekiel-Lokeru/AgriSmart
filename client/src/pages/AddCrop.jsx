import React, { useState } from 'react';
import api from '../services/api';

export default function AddCrop() {
  const [cropName, setCropName] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [plotSize, setPlotSize] = useState('');
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!cropName || !plantingDate || !plotSize || !image) {
      setError('Please fill all fields and upload an image.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('crop_name', cropName);
      formData.append('planting_date', plantingDate);
      formData.append('plot_size', plotSize);
      formData.append('image', image);
      // Add crop and diagnose in one request
      const res = await api.post('/v1/crops/add-and-diagnose', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data.data);
    } catch {
      setError('Failed to add crop or diagnose.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-4">Add Crop</h1>
      <p className="text-green-700 mb-6">Enter crop details and upload an image for instant health diagnosis.</p>
      <form className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 w-full max-w-md" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Crop Name"
          value={cropName}
          onChange={e => setCropName(e.target.value)}
          className="px-4 py-2 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="date"
          placeholder="Planting Date"
          value={plantingDate}
          onChange={e => setPlantingDate(e.target.value)}
          className="px-4 py-2 rounded border border-green-300"
        />
        <input
          type="text"
          placeholder="Plot Size (e.g. 2 acres)"
          value={plotSize}
          onChange={e => setPlotSize(e.target.value)}
          className="px-4 py-2 rounded border border-green-300"
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          className="px-4 py-2 rounded border border-green-300"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? 'Adding & Diagnosing...' : 'Add Crop'}
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
      {result && (
        <div className="mt-8 bg-white rounded-xl shadow p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Crop & Diagnosis Result</h2>
          <pre className="text-sm text-green-700 whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
