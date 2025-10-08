const axios = require("axios");
const CropadvisoryAI = require("../apis/gemini");
const advisoryAI = new CropadvisoryAI();

exports.getWeather = async (req, res) => {
  try {
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Location is required",
      });
    }

    // Build the full URL manually for clarity
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    
    // 🔍 Log the exact request being made
    console.log("Fetching weather from:", url);
    console.log("Using OpenWeather key:", process.env.OPENWEATHER_API_KEY ? "Loaded ✅" : "Missing ❌");

    // Fetch weather data
    const weatherResponse = await axios.get(url);

    const weatherData = weatherResponse.data;
    const current = weatherData.list[0];
    const forecast = weatherData.list.slice(1, 6 * 5);

    // AI Recommendations
    let recommendations = "AI recommendations unavailable at the moment.";
    try {
      recommendations = await advisoryAI.processWeatherRecommendations(
        weatherData,
        { location }
      );
    } catch (aiError) {
      console.error("AI recommendation failed:", aiError.message);
    }

    return res.json({
      success: true,
      error: false,
      message: "Weather fetched successfully",
      current,
      forecast,
      recommendations,
    });
  } catch (err) {
    console.error("Error fetching weather:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Error fetching weather data",
    });
  }
};
