const { queries: { query }} = require('../controllers');
const { verifyUser } = require('../middlewares');

// @description a modular function that registers all the query routes
module.exports = (app, url) => {
	app.use((req, res, next) => {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	
	// Query route
	app.post(`${url}/query`, verifyUser, query);
};