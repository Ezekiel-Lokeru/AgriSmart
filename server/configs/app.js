module.exports = {
	app: {
		port: process.env.PORT,
		host: process.env.HOST,
		url: process.env.URL
	},
	weather: {
		openWeatherAPIKey: process.env.OPENWEATHER_API_KEY
	},
	openapi: {
		spec: process.env.OPEN_API_SPEC,
		url: process.env.OPEN_API_URL,
		version: process.env.OPEN_API_VERSION,
		key: process.env.OPEN_API_KEY,
		model: process.env.OPEN_API_MODEL
	},
	supabase: {
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_ANON_KEY
	}
}