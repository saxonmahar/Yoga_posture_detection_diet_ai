// Admin role verification middleware
const User = require('../models/user');

const verifyAdmin = async (req, res, next) => {
  try {
    // User ID should be set by authMiddleware
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Fetch user from database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    // User is admin, proceed
    req.adminUser = user;
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during admin verification'
    });
  }
};

module.exports = { verifyAdmin };
