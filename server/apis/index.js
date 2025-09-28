const PlantDiseaseAnalyzer = require('./plant');
const CropAdvisoryAI = require('./openai');

module.exports = {
	advisoryAI: new CropAdvisoryAI(),
	plantAnalyzer: new PlantDiseaseAnalyzer()
}