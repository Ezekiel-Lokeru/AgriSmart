const { supabase } = require('../configs');

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('farmer_profiles')
      .select('id, name, email, role, active');
    if (error) return res.status(400).json({ success: false, error: error.message });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Deactivate user
const deactivateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { error } = await supabase
      .from('farmer_profiles')
      .update({ active: false })
      .eq('id', userId);
    if (error) return res.status(400).json({ success: false, error: error.message });
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Change user role
const changeUserRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    const { error } = await supabase
      .from('farmer_profiles')
      .update({ role })
      .eq('id', userId);
    if (error) return res.status(400).json({ success: false, error: error.message });
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Get analytics
const getAnalytics = async (req, res, next) => {
  try {
    const { data: users, error: userError } = await supabase
      .from('farmer_profiles')
      .select('id');
    const { data: crops, error: cropError } = await supabase
      .from('crops')
      .select('id');
    // Example: API usage could be tracked in a separate table
    const apiUsage = 0;
    if (userError || cropError) return res.status(400).json({ success: false, error: userError?.message || cropError?.message });
    return res.status(200).json({
      success: true,
      data: {
        userCount: users.length,
        cropsCount: crops.length,
        apiUsage
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, deactivateUser, changeUserRole, getAnalytics };
