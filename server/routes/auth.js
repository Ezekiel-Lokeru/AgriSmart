const { auth: { signIn, signOut, signUp, resetPassword } } = require('../controllers');
const { verifyUser } = require('../middlewares');
// @description a modular function that registers all the auth routes
module.exports = (app, url) => {
	app.use((req, res, next) => {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	
	// Register route
	app.put(`${url}/register`, signUp);
	
	// Login route
	app.post(`${url}/login`, signIn);
	
	// Logout route
	app.post(`${url}/logout`, signOut);
	
	// Reset password route
	app.patch(`${url}/reset-password`, verifyUser, resetPassword);
};