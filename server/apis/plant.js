// server/apis/plant.js
const axios = require('axios');
const fs = require('fs');

const CropAdvisoryAI = require('./gemini');
const { plantid } = require('../configs/app');

class PlantDiseaseAnalyzer {
  constructor() {
    this.apiKey = plantid.key; 
    this.baseUrl = 'https://plant.id/api/v3';
    this.advisoryAI = new CropAdvisoryAI();
  }

  /** Convert image (Buffer or path) to base64 string */
  async prepareImage(image) {
    try {
      let buffer;
      if (Buffer.isBuffer(image)) {
        buffer = image;
      } else if (typeof image === 'string') {
        buffer = await fs.promises.readFile(image);
      } else {
        throw new Error('Invalid image input: must be Buffer or file path string');
      }
      return buffer.toString('base64');
    } catch (err) {
      throw new Error(`Error preparing image: ${err.message}`);
    }
  }

  /** Call Plant.id health_assessment and return structured analysis + AI recommendations */
async analyzeDiseaseImage(image, details = {}) {
  try {
    if (!this.apiKey) throw new Error('Missing PLANT_ID_API_KEY in config');

    const base64Image = await this.prepareImage(image);

    // First attempt with full modifiers (paid plan)
    let payload = {
      images: [base64Image],
      modifiers: ['health=auto', 'similar_images=true', 'symptoms=true'],
    //   disease_details: [
    //     'cause',
    //     'common_names',
    //     'classification',
    //     'description',
    //     'treatment',
    //     'url'
    //   ]
    };

    let resp;
    try {
      resp = await axios.post(`${this.baseUrl}/health_assessment`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': this.apiKey
        },
        timeout: 60_000
      });
    } catch (err) {
      // Check if error is due to unsupported modifiers (free trial)
      if (err.response?.status === 400 && /Unknown modifier/i.test(err.response.data)) {
        console.warn('⚠️ Falling back to free-tier Plant.id modifiers...');
        payload.modifiers = ['health=auto']; // retry with free tier
		try {
        resp = await axios.post(`${this.baseUrl}/health_assessment`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': this.apiKey
          },
          timeout: 60_000
        });
		} catch (innerErr) {
         console.warn('⚠️ Falling back to no modifiers at all...');
         delete payload.modifiers; // final fallback
         resp = await axios.post(`${this.baseUrl}/health_assessment`, payload, {
         headers: {
          'Content-Type': 'application/json',
          'Api-Key': this.apiKey
        },
        timeout: 60_000
      });
    }
      } else {
        throw err;
      }
    }

    const result = resp?.data?.result || resp?.data || {};
    const analysisResult = this.processPlantIdResponse(result);

    // fallback if AI fails
    let aiRecommendations = {
      response: 'AI recommendations unavailable',
      confidenceLevel: 0,
      suggestedActions: {}
    };
    try {
      aiRecommendations = await this.getAIRecommendations(analysisResult, details);
    } catch (aiErr) {
      console.error('AI recommendations error:', aiErr?.message || aiErr);
    }

    let topDisease = null;

    if (analysisResult?.diseases?.length > 0) {
   // Pick the most confident one
    topDisease = analysisResult.diseases.reduce((prev, curr) =>
    curr.probability > prev.probability ? curr : prev
    );
 }

   // ✅ fallback if no disease detected
   if (!topDisease) {
   topDisease = { name: 'Healthy', probability: 1 };
 }

    return {
  raw: {
    plantIdAnalysis: analysisResult,
    aiRecommendations
  },
  normalized: {
    crop_id: details.cropId || null,
    isHealthy: analysisResult.isHealthy,
    disease_name: topDisease.name || 'Healthy',
    confidence: topDisease.probability || 1,
    recommendations: aiRecommendations.response,
    suggestedActions: aiRecommendations.suggestedActions,
    timestamp: new Date().toISOString()
  }
};

  } catch (error) {
    if (error.response) {
      console.error('Plant.id API error:', {
        status: error.response.status,
        data: error.response.data
      });
      throw new Error(
        `Disease analysis failed: ${error.response.status} ${JSON.stringify(error.response.data)}`
      );
    } else {
      console.error('Plant.id error:', error.message);
      throw new Error(`Disease analysis failed: ${error.message}`);
    }
  }
}


  /** Normalize Plant.id response */
  processPlantIdResponse(response) {
    const health = response?.health_assessment || response || {};
    const diseasesRaw = Array.isArray(health?.diseases) ? health.diseases : [];

    const diseases = diseasesRaw.map(d => {
      const detailsSource = d?.disease_details || d?.details || d;
      return {
        name: d?.name || detailsSource?.name || 'Unknown',
        probability:
          typeof d?.probability === 'number'
            ? d.probability
            : parseFloat(d?.probability || 0),
        details: {
          cause: detailsSource?.cause || null,
          commonNames: detailsSource?.common_names || null,
          description: detailsSource?.description || null,
          treatment: detailsSource?.treatment || null,
          classification: detailsSource?.classification || null,
          url: detailsSource?.url || null
        }
      };
    });

    return {
      isHealthy: health?.is_healthy ?? diseases.length === 0,
      diseases,
      imageQuality: {
        isAcceptable: response?.meta_data?.image_quality_assessment?.is_acceptable || false,
        qualityScore: response?.meta_data?.image_quality_assessment?.quality_score || 0
      },
      raw: response
    };
  }

  /** Ask AI for recommendations */
  async getAIRecommendations(analysis, details = {}) {
    const context = {
      location: details.location || null,
      cropType: details.cropType || null,
      season: details.season || null
    };

    let diseaseInfoText;
    if (analysis.isHealthy || (analysis.diseases.length === 0)) {
      diseaseInfoText =
        'The plant appears healthy. Please provide preventive care recommendations for common pests and diseases.';
    } else {
      const top = analysis.diseases[0];
      diseaseInfoText = `Disease: ${top.name}\nConfidence: ${(top.probability * 100).toFixed(
        2
      )}%\nDescription: ${top.details.description || 'N/A'}\nCause: ${
        top.details.cause || 'N/A'
      }`;
    }

    const recommendations = await this.advisoryAI.processDiseaseQuery(
      diseaseInfoText,
      context
    );
    const responseText =
      recommendations?.response ||
      recommendations?.text ||
      (typeof recommendations === 'string'
        ? recommendations
        : 'No recommendations returned');

    return {
      response: responseText,
      raw: recommendations,
      confidenceLevel: analysis.isHealthy ? 1 : (analysis.diseases?.[0]?.probability || 0),
      suggestedActions: this.categorizeTreatments(responseText)
    };
  }

  /** Categorize recommendations */
  categorizeTreatments(recommendations = '') {
    const categories = { immediate: [], preventive: [], organic: [], chemical: [] };
    if (!recommendations) return categories;

    recommendations
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean)
      .forEach(line => {
        const lower = line.toLowerCase();
        if (lower.includes('immediately') || lower.includes('urgent') || lower.includes('asap')) {
          categories.immediate.push(line);
        } else if (lower.includes('prevent')) {
          categories.preventive.push(line);
        } else if (
          lower.includes('organic') ||
          lower.includes('compost') ||
          lower.includes('neem') ||
          lower.includes('biological')
        ) {
          categories.organic.push(line);
        } else if (
          lower.includes('chemical') ||
          lower.includes('spray') ||
          lower.includes('pesticide') ||
          lower.includes('fungicide')
        ) {
          categories.chemical.push(line);
        } else {
          categories.preventive.push(line);
        }
      });

    return categories;
  }

  /** Optional helper: save analysis for debugging */
  async saveAnalysisResults(analysis, filename = './analysis-debug.json') {
    try {
      await fs.promises.writeFile(filename, JSON.stringify(analysis, null, 2));
    } catch (err) {
      console.error(`Error saving analysis results: ${err.message}`);
    }
  }
}

module.exports = new PlantDiseaseAnalyzer();
