import React, { useState } from "react";
import { Upload, Camera } from "lucide-react";
import api from "../services/api"; // your backend proxy to Plant.id

export default function DiagnoseCrop() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDiagnose = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      // Your backend sends to Plant.id API
      const res = await api.post("/v1/diagnose", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data); // API returns structured diagnosis
    } catch {
      setResult({ error: "Failed to diagnose crop. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-green-800 mb-4">Diagnose Crop</h1>

        {/* Upload + Capture */}
        <div className="flex gap-3 mb-4">
          <label className="flex-1 cursor-pointer flex items-center justify-center border-2 border-dashed border-green-300 rounded-lg p-4 text-green-600 hover:bg-green-50 transition">
            <Upload className="mr-2" /> Upload
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <label className="flex-1 cursor-pointer flex items-center justify-center border-2 border-dashed border-green-300 rounded-lg p-4 text-green-600 hover:bg-green-50 transition">
            <Camera className="mr-2" /> Capture
            <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        {/* Preview */}
        {preview && (
          <div className="flex justify-center mb-4">
            <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-lg shadow" />
          </div>
        )}

        <button
          onClick={handleDiagnose}
          disabled={loading || !image}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? "Diagnosing..." : "Diagnose Crop"}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            {result.error ? (
              <p className="text-red-600">{result.error}</p>
            ) : (
              <div>
                <p><strong>🌾 Crop:</strong> {result.crop || "Unknown"}</p>
                <p><strong>🦠 Disease:</strong> {result.disease || "Healthy"}</p>
                <p><strong>📊 Confidence:</strong> {result.confidence}%</p>
                <p><strong>💊 Treatment:</strong> {result.treatment}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
