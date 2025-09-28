const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const CropAdvisoryAI = require('./openai');
const dotenv = require('dotenv');

dotenv.config();

class PlantDiseaseAnalyzer {
	constructor() {
		this.apiKey = process.env.PLANT_ID_API_KEY;
		this.baseUrl = 'https://plant.id/api/v3';
		this.advisoryAI = new CropAdvisoryAI();
	}
	
	/**
	 * Convert image to base64
	 * @param {Buffer|String} image - Image buffer or path
	 * @returns {String} - Base64 encoded image
	 */
	async prepareImage(image) {
		try {
			let imageBuffer;
			if (Buffer.isBuffer(image)) {
				imageBuffer = image;
			} else if (typeof image === 'string') {
				imageBuffer = await fs.promises.readFile(image);
			} else {
				throw new Error('Invalid image input');
			}
			return imageBuffer.toString('base64');
		} catch (error) {
			throw new Error(`Error preparing image: ${error.message}`);
		}
	}
	
	/**
	 * Analyze image for plant diseases
	 * @param {Buffer|String} image - Image data or file path
	 * @param {Object} details - Additional details about the crop
	 * @returns {Promise<Object>} - Analysis results with AI recommendations
	 */
	async analyzeDiseaseImage(image, details = {}) {
		try {
			// Prepare image for Plant.id API
			const base64Image = await this.prepareImage(image);
			
			// Prepare request data
			const data = {
				images: [base64Image],
				modifiers: ['similar_images', 'symptoms', 'health=auto'],
				disease_details: ["cause",
					"common_names",
					"classification",
					"description",
					"treatment",
					"url"],
				language: "en",
				details: details.plantDetails || []
			};
			
			// Make a request to Plant.id API
			const response = await axios.post(`${this.baseUrl}/health_assessment`, data, {
				headers: {
					'Api-Key': this.apiKey,
					'Content-Type': 'application/json'
				}
			});
			
			// Process the response
			const analysisResult = this.processPlantIdResponse(response.data);
			
			// Get AI-powered recommendations
			const aiRecommendations = await this.getAIRecommendations(analysisResult, details);
			
			return {
				plantIdAnalysis: analysisResult,
				aiRecommendations: aiRecommendations,
				timestamp: new Date().toISOString()
			};
			
		} catch (error) {
			// Log full error response from Plant.id
			if (error.response) {
				console.error('Plant.id API error:', {
					status: error.response.status,
					data: error.response.data,
					headers: error.response.headers
				});
			} else {
				console.error('Plant.id error:', error.message);
			}
			throw new Error(`Disease analysis failed: ${error.message}`);
		}
	}
	
	/**
	 * Process Plant.id API response
	 * @param {Object} response - Raw API response
	 * @returns {Object} - Processed analysis results
	 */
	processPlantIdResponse(response) {
		try {
			const { health_assessment } = response;
			const diseases = health_assessment.diseases || [];
			
			// Extract relevant information
			return {
				isHealthy: health_assessment.is_healthy,
				diseases: diseases.map(disease => ({
					name: disease.name,
					probability: disease.probability,
					details: {
						cause: disease.disease_details.cause,
						commonNames: disease.disease_details.common_names,
						description: disease.disease_details.description,
						treatment: disease.disease_details.treatment,
						classification: disease.disease_details.classification,
						url: disease.disease_details.url
					}
				})),
				imageQuality: {
					isAcceptable: response.meta_data?.image_quality_assessment?.is_acceptable || false,
					qualityScore: response.meta_data?.image_quality_assessment?.quality_score || 0
				}
			};
		} catch (error) {
			throw new Error(`Error processing Plant.id response: ${error.message}`);
		}
	}
	
	/**
	 * Get AI recommendations based on disease analysis
	 * @param {Object} analysis - Processed Plant.id analysis
	 * @param {Object} details - Additional crop details
	 * @returns {Promise<Object>} - AI recommendations
	 */
	async getAIRecommendations(analysis, details) {
		try {
			const context = {
				location: details.location,
				cropType: details.cropType,
				season: details.season
			};
			
			let diseaseInfo = '';
			
			if (analysis.isHealthy) {
				diseaseInfo = 'The plant appears healthy, but please provide preventive care recommendations.';
			} else {
				const topDisease = analysis.diseases[0];
				diseaseInfo = `
                    Disease: ${topDisease.name}
                    Confidence: ${(topDisease.probability * 100).toFixed(2)}%
                    Cause: ${topDisease.details.cause}
                    Description: ${topDisease.details.description}
                `;
			}
			
			const recommendations = await this.advisoryAI.processDiseaseQuery(diseaseInfo, context);
			
			return {
				...recommendations,
				confidenceLevel: analysis.isHealthy ? 1 : analysis.diseases[0].probability,
				suggestedActions: this.categorizeTreatments(recommendations.response)
			};
			
		} catch (error) {
			throw new Error(`Error getting AI recommendations: ${error.message}`);
		}
	}
	
	/**
	 * Categorize treatment recommendations
	 * @param {String} recommendations - Raw AI recommendations
	 * @returns {Object} - Categorized treatments
	 */
	categorizeTreatments(recommendations) {
		// Split recommendations into categories
		const categories = {
			immediate: [],
			preventive: [],
			organic: [],
			chemical: []
		};
		
		// Parse recommendations and categorize
		// This is a simple implementation - you might want to use more sophisticated NLP
		const lines = recommendations.split('\n');
		lines.forEach(line => {
			if (line.toLowerCase().includes('immediately') || line.toLowerCase().includes('urgent')) {
				categories.immediate.push(line.trim());
			} else if (line.toLowerCase().includes('prevent')) {
				categories.preventive.push(line.trim());
			} else if (line.toLowerCase().includes('organic')) {
				categories.organic.push(line.trim());
			} else if (line.toLowerCase().includes('chemical')) {
				categories.chemical.push(line.trim());
			}
		});
		
		return categories;
	}
	
	/**
	 * Save analysis results to a file (for debugging/logging)
	 * @param {Object} analysis - Analysis results
	 * @param {String} filename - Output filename
	 */
	async saveAnalysisResults(analysis, filename) {
		try {
			await fs.promises.writeFile(
				filename,
				JSON.stringify(analysis, null, 2)
			);
		} catch (error) {
			console.error(`Error saving analysis results: ${error.message}`);
		}
	}
}

module.exports = PlantDiseaseAnalyzer;