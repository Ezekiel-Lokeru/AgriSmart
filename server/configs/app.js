module.exports = {
  app: {
    port: process.env.PORT,
    host: process.env.HOST,
    url: process.env.URL
  },
  weather: {
    openWeatherAPIKey: process.env.OPENWEATHER_API_KEY
  },
  gemini: {
    key: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL
  },
  plantid: {
    key: process.env.PLANT_ID_API_KEY 
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  }
};
