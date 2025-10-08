// server/apis/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { gemini: { key } } = require("../configs");

class CropAdvisoryAI {
  constructor() {
    this.genAI = new GoogleGenerativeAI(key);

    // Gemini models
    this.defaultModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.advancedModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Base system prompt for agricultural context
    this.baseSystemPrompt = `You are an expert agricultural advisor with deep knowledge of farming in Kenya.
        Your role is to provide clear, practical advice to small-scale farmers about crop diseases, farming techniques,
        and best practices. Always consider local conditions and traditional farming methods while suggesting modern solutions.`;
  }

  /**
   * 🧹 Clean and shorten AI responses to avoid repetition or unnecessary formatting
   */
  cleanResponse(text) {
    if (!text) return "";

    // Remove markdown, stars, hashtags, etc.
    let clean = text.replace(/\*\*/g, "").replace(/#+/g, "").trim();

    // Split and remove duplicate or near-duplicate lines
    const lines = clean
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const uniqueLines = [];
    for (const line of lines) {
      const normalized = line.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!uniqueLines.some(u => u.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized)) {
        uniqueLines.push(line);
      }
    }

    // Limit to ~200 words
    clean = uniqueLines.join("\n");
    clean = clean.split(/\s+/).slice(0, 200).join(" ");

    return clean.trim();
  }

  /**
   * Generate custom system prompt based on context
   */
  generateSystemPrompt(context = {}) {
    const { location, cropType, season } = context;
    let customPrompt = this.baseSystemPrompt;

    if (location) customPrompt += `\nYou are specifically advising farmers in ${location}, Kenya.`;
    if (cropType) customPrompt += `\nThe farmer is primarily growing ${cropType}.`;
    if (season) customPrompt += `\nThe current growing season is ${season}.`;

    return customPrompt;
  }

  /**
   * General farming queries
   */
  async processFarmingQuery(query, context = {}) {
    try {
      const prompt = `${this.generateSystemPrompt(context)}\n\nFarmer's question: ${query}`;

      const response = await this.defaultModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      return { response: this.cleanResponse(response.response.text()) };
    } catch (error) {
      throw new Error(`Error processing farming query: ${error.message}`);
    }
  }

  /**
   * Crop disease diagnosis with Plant.id context
   */
  async processDiseaseQuery(diseaseInfo, context = {}) {
    try {
      const diseasePrompt = `${this.generateSystemPrompt(context)}

Based on the image analysis, the crop shows signs of:
${diseaseInfo}

Please provide:
1. Short, clear explanation of the disease
2. Immediate treatment steps
3. Prevention measures
4. Organic treatment alternatives if available
5. Expected recovery timeline
Keep the advice simple, practical, and concise.`;

      const response = await this.advancedModel.generateContent({
        contents: [{ role: "user", parts: [{ text: diseasePrompt }] }],
      });

      return { response: this.cleanResponse(response.response.text()) };
    } catch (error) {
      throw new Error(`Error processing disease query: ${error.message}`);
    }
  }

  /**
   * Weather-based recommendations
   */
  async processWeatherRecommendations(weatherData, context = {}) {
    try {
      const weatherPrompt = `${this.generateSystemPrompt(context)}

Based on the following weather forecast:
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

      const response = await this.advancedModel.generateContent({
        contents: [{ role: "user", parts: [{ text: weatherPrompt }] }],
      });

      return { response: this.cleanResponse(response.response.text()) };
    } catch (error) {
      throw new Error(`Error processing weather recommendations: ${error.message}`);
    }
  }

  /**
   * Crop planning recommendations
   */
  async processCropPlanning(params, context = {}) {
    try {
      const planningPrompt = `${this.generateSystemPrompt(context)}

Please provide a detailed crop planning recommendation based on:
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

      const response = await this.advancedModel.generateContent({
        contents: [{ role: "user", parts: [{ text: planningPrompt }] }],
      });

      return { response: this.cleanResponse(response.response.text()) };
    } catch (error) {
      throw new Error(`Error processing crop planning: ${error.message}`);
    }
  }
}

module.exports = CropAdvisoryAI;
