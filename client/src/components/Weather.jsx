import React, { useState, useEffect } from "react";
import api from "../services/api";

const WeatherWidget = () => {
  const [location, setLocation] = useState("");
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Load saved weather data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("weatherData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setLocation(parsed.location);
      setCurrent(parsed.current);
      setForecast(parsed.forecast);
      setRecommendations(parsed.recommendations);
    }
  }, []);

  const fetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/v1/weather", { location });
      if (res.data.success) {
        const newData = {
          location,
          current: res.data.current,
          forecast: res.data.forecast,
          recommendations: res.data.recommendations?.response || res.data.recommendations,
        };

        // ✅ Save to state
        setCurrent(newData.current);
        setForecast(newData.forecast);
        setRecommendations(newData.recommendations);

        // ✅ Save to localStorage
        localStorage.setItem("weatherData", JSON.stringify(newData));
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

  const clearWeather = () => {
    localStorage.removeItem("weatherData");
    setCurrent(null);
    setForecast([]);
    setRecommendations(null);
    setLocation("");
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-green-700 mb-4">🌦️ Weather & Advisory</h2>

      <form onSubmit={fetchWeather} className="flex flex-col sm:flex-row gap-3 mb-6">
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
        {current && (
          <button
            type="button"
            onClick={clearWeather}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg"
          >
            Clear
          </button>
        )}
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {current && (
        <div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              📍 {location}
            </h3>
            <p className="text-green-800">
              Current Temp: <span className="font-bold">{current.main.temp}°C</span>
            </p>
            <p className="capitalize text-green-700">
              {current.weather[0].description}
            </p>
          </div>

          {/* 5-Day Forecast */}
<h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
  📅 5-Day Forecast
</h3>

<div className="flex flex-wrap gap-3 justify-start">
  {forecast
    // Pick one forecast per day (every 8th item = 24h)
    .filter((_, idx) => idx % 8 === 0)
    .slice(0, 6)
    .map((day, index) => (
      <div
        key={index}
        className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 w-[120px] text-center"
      >
        <p className="font-semibold text-gray-700">
          {new Date(day.dt * 1000).toLocaleDateString("en-US", {
            weekday: "short",
          })}
        </p>
        <p className="text-gray-500 text-sm">
          {day.main.temp.toFixed(2)}°C
        </p>
        <p className="text-gray-400 text-sm">
          {day.weather[0].description}
        </p>
      </div>
    ))}
</div>


          {recommendations && (
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-3">🌱 AI Recommendations</h3>
              <div className="flex flex-col items-center space-y-3">
                {Array.isArray(recommendations)
                  ? recommendations.map((rec, i) => {
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
                          className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition w-full max-w-3xl mx-auto"
                        >
                          <div className="flex items-start gap-3">
                            <span className={`${color} text-xl`}>{icon}</span>
                            <p className="text-green-900 leading-relaxed">{rec}</p>
                          </div>
                        </div>
                      );
                    })
                  : Object.entries(
                      typeof recommendations === "object"
                        ? recommendations
                        : { Summary: recommendations }
                    ).map(([key, value], i) => (
                      <div
                        key={i}
                        className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition w-full max-w-3xl mx-auto"
                      >
                        <h4 className="font-semibold text-green-700 capitalize mb-2">
                          {key.replace(/_/g, " ")}
                        </h4>
                        <p className="text-green-900 leading-relaxed whitespace-pre-line">
                          {value}
                        </p>
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
