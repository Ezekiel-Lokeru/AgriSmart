module.exports = app => {
	require('./auth')(app, '/api/v1/auth');
	require('./crops')(app, '/api/v1/crops');
	require('./profile')(app, '/api/v1/profile');
	require('./weather')(app, '/api/weather');
	require('./query')(app, '/api/v1/query');
	require('./admin')(app, '/api/v1/admin');
	require('./errors')(app);
}