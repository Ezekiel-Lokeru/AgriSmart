const { profile: { edit, get, remove }} = require('../controllers');
const { verifyUser } = require('../middlewares');

// @description a modular function that registers all the profile routes
module.exports = (app, url) => {
	app.use((req, res, next) => {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	
	// Edit profile route
	app.patch(`${url}/edit`, verifyUser, edit);
	
	// Get profile route
	app.get(`${url}/get`, verifyUser, get);
	
	// Remove profile route
	app.delete(`${url}/remove`, verifyUser, remove);
};