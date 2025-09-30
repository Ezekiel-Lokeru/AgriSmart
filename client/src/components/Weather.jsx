import React, { useState } from "react";
import api from "../services/api";

const WeatherWidget = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/v1/weather", { location});
      if (res.data.success) {
        setWeather(res.data.weather || null);
        setRecommendations(res.data.recommendations || null);
      } else {
        setError("Could not fetch weather data.");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Network or server error while fetching weather.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-green-700 mb-4">
        🌦️ Weather & Advisory
      </h2>

      {/* Input Form */}
      <form
        onSubmit={fetchWeather}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="Enter your location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Weather Results */}
      {weather && (
        <div>
          {/* Current Weather */}
          {weather.list && weather.list.length > 0 && (
            <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-6">
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                📍 {weather.city?.name}, {weather.city?.country}
              </h3>
              <p className="text-green-800">
                Current Temp:{" "}
                <span className="font-bold">{weather.list[0].main.temp}°C</span>
              </p>
              <p className="capitalize text-green-700">
                {weather.list[0].weather[0].description}
              </p>
            </div>
          )}

          {/* Forecast */}
          {weather.list && weather.list.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-700 mb-3">
                📅 5-Day Forecast
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {weather.list.slice(0, 5).map((item, i) => (
                  <div
                    key={i}
                    className="bg-white border border-green-200 rounded-lg p-3 shadow-sm text-center"
                  >
                    <p className="font-medium text-green-700">
                      {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                    <p className="text-sm">{item.main.temp}°C</p>
                    <p className="text-xs capitalize text-gray-600">
                      {item.weather[0].description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No forecast data available.</p>
          )}

          {/* AI Recommendations */}
          {recommendations ? (
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-3">
                🌱 AI Recommendations
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.isArray(recommendations) ? (
                  recommendations.map((rec, i) => {
                    let icon = "✅";
                    let color = "text-green-600";

                    if (/irrigation|water/i.test(rec)) {
                      icon = "💧";
                      color = "text-blue-600";
                    } else if (/fertilizer|soil|nutrient/i.test(rec)) {
                      icon = "🌾";
                      color = "text-yellow-700";
                    } else if (/pest|disease|spray/i.test(rec)) {
                      icon = "🐛";
                      color = "text-red-600";
                    } else if (/harvest|plant|sow/i.test(rec)) {
                      icon = "🧑‍🌾";
                      color = "text-green-700";
                    } else if (/rain|temperature|weather/i.test(rec)) {
                      icon = "☁️";
                      color = "text-gray-600";
                    }

                    return (
                      <div
                        key={i}
                        className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex items-start gap-3">
                          <span className={`${color} text-xl`}>{icon}</span>
                          <p className="text-green-900 leading-relaxed">{rec}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  Object.entries(recommendations).map(([key, value], i) => (
                    <div
                      key={i}
                      className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                    >
                      <h4 className="font-semibold text-green-700 capitalize mb-2">
                        {key.replace(/_/g, " ")}
                      </h4>
                      <p className="text-green-900 leading-relaxed">{value}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No AI recommendations available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
