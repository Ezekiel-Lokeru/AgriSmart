import React, { useState } from 'react';
import api from '../services/api';

export default function Search() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-4xl font-bold text-green-800 mb-4">Search</h1>
      <p className="text-green-700 mb-8">Find crops, weather, and more using our smart search tools.</p>
      <form
        className="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-xl"
        onSubmit={async (e) => {
          e.preventDefault();
          const query = e.target.elements.query.value.trim();
          if (!query) return;
          setLoading(true);
          setError("");
          setResults([]);
          try {
            // Search crops
            const cropsRes = await api.get(`/v1/crops/all?search=${encodeURIComponent(query)}`);
            // Search weather (example: by location)
            const weatherRes = await api.post('/v1/weather/info', { location: query });
            setResults([
              { type: "Crops", data: cropsRes.data },
              { type: "Weather", data: weatherRes.data }
            ]);
          } catch {
            setError("No results found or error searching.");
          } finally {
            setLoading(false);
          }
        }}
      >
        <input
          type="text"
          name="query"
          placeholder="Search crops or location..."
          className="px-4 py-2 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 flex-1"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Search
        </button>
      </form>
      {loading && <div className="text-green-800">Searching...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && results.length > 0 && (
        <div className="w-full max-w-xl">
          {results.map((result, idx) => (
            <div key={idx} className="mb-6 p-4 bg-white rounded shadow">
              <h2 className="text-lg font-semibold text-green-800 mb-2">{result.type} Results</h2>
              <pre className="text-sm text-green-700 whitespace-pre-wrap">{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
