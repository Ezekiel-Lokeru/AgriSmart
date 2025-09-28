const { supabase } = require('../configs');
const { app } = require('../configs');

// Authentication routes
// 1. Sign Up
const signUp = async (req, res, next) => {
	try {
		// validate email and password
		if (!req.body?.email || !req.body?.password || !req.body?.name) {
			return res.status(400).json({
				success: false,
				error: 'Email, password and name are required'
			});
		}

		const { email, password, name } = req.body;
		const { data, error } = await supabase.auth.signUp({
			email, password,
			options: { data: { role: 'farmer', name } }
		});

		if (error) {
			// Check if the error is not JSON
			if (error.message.includes('Unexpected token')) {
				return res.status(500).json({ success: false, error: 'Invalid response from server' });
			}
			return res.status(400).json({ success: false, error: error.message });
		}

		// Automatically create a profile row for the new user
		if (data && data.user && data.user.id) {
			await supabase.from('farmer_profiles').insert({
				id: data.user.id,
				name,
				email,
				role: 'farmer',
				created_at: new Date()
			});
		}

		res.status(201).json({
			success: true,
			message: 'Registration successful. Please check your email for verification.',
			user: data.user
		});
	} catch (error) {
		return next(error);
	}
};

// 2. Sign In
const signIn  = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const { data, error } = await supabase.auth.signInWithPassword({ email, password});
		if (error) return res.status(401).json({ success: false, error: error.message });
		res.status(200).json({
			message: 'Login successful',
			session: data.session,
			user: data.user
		});
	} catch (error) {
		return next(error);
	}
};

// 3. Sign Out
const signOut = async (req, res, next) => {
	try {
		const { error } = await supabase.auth.signOut();
		if (error) return res.status(400).json({ success: false, error: error.message });
		res.status(200).json({
			message: 'Logout successful',
			success: true
		});
	} catch (error) {
		return next(error);
	}
};

// 4. Password Reset Request
const resetPassword = async (req, res, next) => {
	try {
		const { email } = req.body;
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${app.url}/reset-password`,
		});
		if (error) return res.status(400).json({ success: false, error: error.message });
		res.status(200).json({
			message: 'Password reset instructions sent to email',
			success: true
		});
	} catch (error) {
		return next(error);
	}
};

module.exports = { signUp, signIn, signOut, resetPassword };
