const { OpenAI } = require('openai');
const { openapi: { key, url }} = require('../configs');

class CropAdvisoryAI {
	constructor() {
		this.openai = new OpenAI({ baseURL: url, apiKey: key });
		
		// Base system prompt for agricultural context
		this.baseSystemPrompt = `You are an expert agricultural advisor with deep knowledge of farming in Kenya.
        Your role is to provide clear, practical advice to small-scale farmers about crop diseases, farming techniques,
        and best practices. Always consider local conditions and traditional farming methods while suggesting modern solutions.`;
	}
	
	/**
	 * Generate custom system prompt based on context
	 * @param {Object} context - Additional context for the prompt
	 * @returns {String} - Customized system prompt
	 */
	generateSystemPrompt(context = {}) {
		const { location, cropType, season } = context;
		let customPrompt = this.baseSystemPrompt;
		
		if (location) {
			customPrompt += `\nYou are specifically advising farmers in ${location}, Kenya.`;
		}
		if (cropType) {
			customPrompt += `\nThe farmer is primarily growing ${cropType}.`;
		}
		if (season) {
			customPrompt += `\nThe current growing season is ${season}.`;
		}
		
		return customPrompt;
	}
	
	/**
	 * Process general farming queries
	 * @param {String} query - Farmer's question
	 * @param {Object} context - Additional context
	 * @returns {Promise<Object>} - AI response
	 */
	async processFarmingQuery(query, context = {}) {
		try {
			const messages = [
				{ role: 'system', content: this.generateSystemPrompt(context) },
				{ role: 'user', content: query }
			];
			
			const response = await this.openai.chat.completions.create({
				model: 'gpt-4.1-mini',
				messages: messages,
				temperature: 0.7,
				max_tokens: 500
			});
			
			return {
				response: response.choices[0].message.content,
				usage: response.usage
			};
		} catch (error) {
			throw new Error(`Error processing farming query: ${error.message}`);
		}
	}
	
	/**
	 * Process crop disease diagnosis with image analysis context
	 * @param {String} diseaseInfo - Disease information from Plant.id API
	 * @param {Object} context - Additional context
	 * @returns {Promise<Object>} - Treatment recommendations
	 */
	async processDiseaseQuery(diseaseInfo, context = {}) {
		try {
			const diseasePrompt = `Based on the image analysis, the crop shows signs of ${diseaseInfo}.
            Please provide:
            1. Detailed explanation of the disease
            2. Immediate treatment steps
            3. Prevention measures
            4. Organic treatment alternatives if available
            5. Expected recovery timeline`;
			
			const messages = [
				{ role: 'system', content: this.generateSystemPrompt(context) },
				{ role: 'user', content: diseasePrompt }
			];
			
			const response = await this.openai.chat.completions.create({
				model: 'gpt-4',
				messages: messages,
				temperature: 0.7,
				max_tokens: 800
			});
			
			return {
				response: response.choices[0].message.content,
				usage: response.usage
			};
		} catch (error) {
			throw new Error(`Error processing disease query: ${error.message}`);
		}
	}
	
	/**
	 * Generate weather-based farming recommendations
	 * @param {Object} weatherData - Data from OpenWeatherMap API
	 * @param {Object} context - Additional context
	 * @returns {Promise<Object>} - Weather-based recommendations
	 */
	async processWeatherRecommendations(weatherData, context = {}) {
		try {
			const weatherPrompt = `Based on the following weather forecast:
            Temperature: ${weatherData.temperature}°C
            Rainfall: ${weatherData.rainfall}mm
            Humidity: ${weatherData.humidity}%
            Forecast: ${weatherData.forecast}
            
            Please provide:
            1. Recommended farming activities for the next 7 days
            2. Precautions to take
            3. Irrigation recommendations
            4. Pest and disease risks in these conditions
            5. Optimal timing for any planned activities`;
			
			const messages = [
				{ role: 'system', content: this.generateSystemPrompt(context) },
				{ role: 'user', content: weatherPrompt }
			];
			
			const response = await this.openai.chat.completions.create({
				model: 'gpt-4',
				messages: messages,
				temperature: 0.7,
				max_tokens: 600
			});
			
			return {
				response: response.choices[0].message.content,
				usage: response.usage
			};
		} catch (error) {
			throw new Error(`Error processing weather recommendations: ${error.message}`);
		}
	}
	
	/**
	 * Generate crop planning recommendations
	 * @param {Object} params - Planning parameters
	 * @param {Object} context - Additional context
	 * @returns {Promise<Object>} - Planning recommendations
	 */
	async processCropPlanning(params, context = {}) {
		try {
			const planningPrompt = `Please provide a detailed crop planning recommendation based on:
            Land Size: ${params.landSize} acres
            Soil Type: ${params.soilType}
            Available Water: ${params.waterSource}
            Budget: ${params.budget} KES
            
            Include:
            1. Recommended crops for the season
            2. Planting schedule
            3. Resource requirements
            4. Expected yields
            5. Potential challenges and solutions
            6. Budget allocation suggestions`;
			
			const messages = [
				{ role: 'system', content: this.generateSystemPrompt(context) },
				{ role: 'user', content: planningPrompt }
			];
			
			const response = await this.openai.chat.completions.create({
				model: 'gpt-4',
				messages: messages,
				temperature: 0.7,
				max_tokens: 1000
			});
			
			return {
				response: response.choices[0].message.content,
				usage: response.usage
			};
		} catch (error) {
			throw new Error(`Error processing crop planning: ${error.message}`);
		}
	}
}

module.exports = CropAdvisoryAI;