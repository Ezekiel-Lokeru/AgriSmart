const plantAnalyzer = require('./plant');
const CropAdvisoryAI = require('./gemini');

const advisoryAI = new CropAdvisoryAI();

module.exports = {
	advisoryAI: new CropAdvisoryAI(),
	plantAnalyzer
};