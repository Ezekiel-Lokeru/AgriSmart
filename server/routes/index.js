module.exports = app => {
	require('./auth')(app, '/api/v1/auth');
	require('./crops')(app, '/api/v1/crops');
	require('./profile')(app, '/api/v1/profile');
	require('./weather')(app, '/api/v1/weather');
	require('./query')(app, '/api/v1/query');
	require('./admin')(app, '/api/v1/admin');
	app.get('/api/v1/health', (req, res) => {
     res.status(200).json({ success: true, message: '✅ API is healthy and running!' });
    });

	require('./errors')(app);
}