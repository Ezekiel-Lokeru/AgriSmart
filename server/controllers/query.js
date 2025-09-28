const { supabase } = require('../configs');
const { advisoryAI } = require('../apis');

// 5. Farming Query Routes
const query = async (req, res, next) => {
	try {
		const { query, cropId, category } = req.body;
		
		// Get crop context if cropId is provided
		let context = {};
		if (cropId) {
			const { data: cropData } = await supabase
				.from('crops')
				.select('*')
				.eq('id', cropId)
				.single();
			
			context = {
				cropType: cropData.crop_name,
				plantingDate: cropData.planting_date
			};
		}
		
		// Get AI response
		const aiResponse = await advisoryAI.processFarmingQuery(query, context);
		
		// Store query and response
		const { data, error } = await supabase
			.from('farming_queries')
			.insert({
				farmer_id: req.user.id,
				query_text: query,
				crop_id: cropId,
				ai_response: aiResponse,
				category
			});
		
		if (error) return res.status(400).json({ success: false, error: error.message });
		res.json(aiResponse);
	} catch (error) {
		return next(error);
	}
};

module.exports = { query };