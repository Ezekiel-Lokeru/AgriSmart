const { supabase } = require('../configs');

// 1. Farmer Profile Routes: Get Profile
const get = async (req, res, next) => {
	try {
		const { data, error } = await supabase
			.from('farmer_profiles')
			.select('*')
			.eq('id', req.user.id)
			.single();
		
		if (error) return res.status(400).json({ success: false, error: error.message });
		return res.status(200).json({ success: true, data });
	} catch (error) {
		return next(error);
	}
};

// 2. Farmer Profile Routes: Update Profile
const edit = async (req, res, next) => {
	try {
		const { data, error } = await supabase
			.from('farmer_profiles')
			.upsert({
				id: req.user.id,
				...req.body,
				updated_at: new Date()
			});
		
		if (error) return res.status(400).json({ success: false, error: error.message });
		return res.status(200).json({ success: true, data });
	} catch (error) {
		return next(error);
	}
};

// 3. Farmer Profile Routes: Delete Profile
const remove = async (req, res, next) => {
	try {
		const { data, error } = await supabase
			.from('farmer_profiles')
			.delete()
			.eq('id', req.user.id);
		
		if (error) return res.status(400).json({ success: false, error: error.message });
		return res.json({ success: true, data });
	} catch (error) {
		return next(error);
	}
};

module.exports = { get, edit, remove };