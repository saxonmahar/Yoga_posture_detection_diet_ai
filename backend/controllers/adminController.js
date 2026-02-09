// Admin Controller - System Management and Analytics
const User = require('../models/user');
const YogaSession = require('../models/yogaSession');
const PoseSession = require('../models/posesession');

// Get admin dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin only.' 
      });
    }

    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get active users (logged in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: oneDayAgo }
    });

    // Get premium users
    const premiumUsers = await User.countDocuments({
      isPremium: true
    });

    // Get total sessions
    const totalSessions = await YogaSession.countDocuments();

    // Get today's sessions
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todaySessions = await YogaSession.countDocuments({
      createdAt: { $gte: todayStart }
    });

    // Calculate total revenue (mock for now)
    const totalRevenue = premiumUsers * 500; // Assuming Rs 500 per premium user

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt isPremium');

    // Get recent sessions
    const recentSessions = await YogaSession.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user_id', 'name')
      .select('user_id total_duration createdAt');

    // Format recent sessions
    const formattedSessions = recentSessions.map(session => ({
      userName: session.user_id?.name || 'Unknown',
      poseName: 'Yoga Session',
      duration: session.total_duration || 0,
      timeAgo: getTimeAgo(session.createdAt)
    }));

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        premiumUsers,
        totalSessions,
        todaySessions,
        totalRevenue
      },
      recentUsers,
      recentSessions: formattedSessions
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats',
      error: error.message
    });
  }
};

// Get database status
exports.getDatabaseStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin only.' 
      });
    }

    // Check database connection
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState;
    
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    res.json({
      success: true,
      status: statusMap[dbStatus] || 'unknown',
      connected: dbStatus === 1
    });

  } catch (error) {
    console.error('Database status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check database status',
      error: error.message
    });
  }
};

// Helper function to get time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
}

module.exports = exports;