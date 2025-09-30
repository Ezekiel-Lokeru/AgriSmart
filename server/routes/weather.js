const { weather: { getWeather }} = require('../controllers');
const { verifyUser } = require('../middlewares');

// @description a modular function that registers all the weather routes
module.exports = (app, url) => {
	app.use((req, res, next) => {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	
	// Weather route
	app.post(`${url}`, verifyUser, getWeather);
};