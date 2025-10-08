const plantAnalyzer = require('./plant');
const CropAdvisoryAI = require('./gemini');

module.exports = {
	advisoryAI: new CropAdvisoryAI(),
	plantAnalyzer
};