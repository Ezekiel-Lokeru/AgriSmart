const { addCrop, getCrops, analyzeDisease, getAnalysisHistory, handleMulterUpload, addCropAndDiagnose, deleteCrop }  = require('../controllers/crops');
const { verifyUser } = require('../middlewares');

// @description a modular function that registers all the crop routes
module.exports = (app, url) => {
	app.use((req, res, next) => {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	
		// Register route
		app.put(`${url}/add`, verifyUser, addCrop);

		// Add crop and diagnose route
		app.post(`${url}/add-and-diagnose`, verifyUser, handleMulterUpload, addCropAndDiagnose);
	
	// Get crops route
	app.get(`${url}/all`, verifyUser, getCrops);
	
	// Analyze disease route
	app.post(`${url}/analyze`, verifyUser, handleMulterUpload, analyzeDisease);
	
	// Get analysis history route
	app.get(`${url}/analysis-history/:cropId`, verifyUser, getAnalysisHistory);

	// Delete crop route
	app.delete(`${url}/:cropId`, verifyUser, deleteCrop);
};