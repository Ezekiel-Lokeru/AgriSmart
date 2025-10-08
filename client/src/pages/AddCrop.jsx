import React, { useState } from "react";
import { Camera, Upload, Leaf, Calendar, Ruler, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AddCrop() {
  const [cropName, setCropName] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [plotSize, setPlotSize] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!cropName || !plantingDate || !plotSize || !image) {
      setError("Please fill all fields and upload an image.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("crop_name", cropName);
      formData.append("planting_date", plantingDate);
      formData.append("plot_size", plotSize);
      formData.append("image", image);

      const res = await api.post("/v1/crops/add-and-diagnose", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.data);
    } catch {
      setError("Failed to add crop or diagnose.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6 relative">
      {/* Close button */}
      <button
        onClick={() => navigate(-1)} // or navigate("/dashboard") depending on your flow
        className="absolute top-4 right-4 bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full shadow-md transition"
        title="Close"
      >
        <X size={20} />
      </button>

      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 mt-10">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Add Crop</h1>
        <p className="text-green-600 mb-6">
          Enter crop details and upload or capture an image for instant health diagnosis.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Crop Name */}
          <div className="relative">
            <Leaf className="absolute left-3 top-3 text-green-500" size={20} />
            <input
              type="text"
              placeholder="Crop Name"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Planting Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-green-500" size={20} />
            <input
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Plot Size */}
          <div className="relative">
            <Ruler className="absolute left-3 top-3 text-green-500" size={20} />
            <input
              type="text"
              placeholder="Plot Size (e.g. 2 acres)"
              value={plotSize}
              onChange={(e) => setPlotSize(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Image Upload + Capture */}
          <div className="flex gap-3">
            <label className="flex-1 cursor-pointer flex items-center justify-center border-2 border-dashed border-green-300 rounded-lg p-4 text-green-600 hover:bg-green-50 transition">
              <Upload className="mr-2" size={20} />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <label className="flex-1 cursor-pointer flex items-center justify-center border-2 border-dashed border-green-300 rounded-lg p-4 text-green-600 hover:bg-green-50 transition">
              <Camera className="mr-2" size={20} />
              Capture
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Preview */}
          {preview && (
            <div className="mt-4 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg shadow"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Adding & Diagnosing..." : "Add Crop"}
          </button>

          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </form>

        {/* Result */}
        {result && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              Crop & Diagnosis Result
            </h2>
            <pre className="text-sm text-green-700 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
