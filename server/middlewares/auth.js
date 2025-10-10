const { supabase } = require('../configs');

// 5. Authentication Middleware
const verifyUser = async (req, res, next) => {
	try {
		const token = req.headers["authorization"]?.split(' ')[1];
		if (!token) return res.status(401).json({ unauthorized: true, success: false, message: 'Unauthorized access' });
		const { data: { user }, error } = await supabase.auth.getUser(token);
		if (error) return res.status(401).json({ unauthorized: true, success: false, message: 'Unauthorized access' });
		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({
			error: 'Unauthorized access'
		});
	}
};

// Admin authentication middleware
const verifyAdmin = async (req, res, next) => {
  await verifyUser(req, res, async () => {
    try {
      const { data: profile, error } = await supabase
        .from('farmer_profiles')
        .select('role')
        .eq('email', req.user.email) // safer than id
        .single();

      if (error || !profile || profile.role !== 'admin') {
        return res.status(403).json({
          unauthorized: true,
          success: false,
          message: 'Admin access required'
        });
      }

      req.user.role = profile.role;
      next();
    } catch (err) {
      return res.status(403).json({
        unauthorized: true,
        success: false,
        message: 'Admin access required'
      });
    }
  });
};


module.exports = {
	verifyUser,
	verifyAdmin
}