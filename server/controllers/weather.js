// controllers/weather.controller.js
const axios = require("axios");
const advisoryAI = require("../apis/openai");

// Fetch current + forecast weather and add AI recommendations
exports.getWeather = async (req, res) => {
  try {
    const { location, cropType } = req.body;

    if (!location) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Location is required",
      });
    }

    //Fetch weather from OpenWeather API
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: location,
          units: "metric",
          appid: process.env.OPENWEATHER_KEY,
        },
      }
    );

    //Extract current conditions + 5-day forecast
    const weatherData = weatherResponse.data;
    const current = weatherData.list[0]; // first item = current
    const forecast = weatherData.list.slice(1, 6 * 5); // next 5 days (3hr steps → 40 entries)

    //AI Recommendations (with safe fallback)
    let recommendations = "AI recommendations unavailable at the moment.";
    try {
      recommendations = await advisoryAI.processWeatherRecommendations(
        weatherData,
        { location, cropType }
      );
    } catch (aiError) {
      console.error("AI recommendation failed:", aiError.message);
    }

    //Respond to frontend
    return res.json({
      success: true,
      error: false,
      message: "Weather fetched successfully",
      current,
      forecast,
      recommendations,
    });
  } catch (err) {
    console.error("Error fetching weather:", err.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Error fetching weather data",
    });
  }
};
