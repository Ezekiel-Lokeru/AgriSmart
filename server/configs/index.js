const { supabase } = require('./supabase');
const { app, plantid, weather, gemini } = require('./app');

module.exports = {
	supabase, app, weather, gemini, plantid
}