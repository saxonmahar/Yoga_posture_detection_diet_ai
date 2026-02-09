// Admin Controller - System Management and Analytics
const User = require('../models/user');
const YogaSession = require('../models/yogaSession');
const PoseSession = require('../models/posesession');
const Schedule = require('../models/schedule');
const LoginLog = require('../models/loginLog');
const axios = require('axios');

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

    // Get active today (users who had sessions today)
    const activeToday = await YogaSession.distinct('user_id', {
      createdAt: { $gte: todayStart }
    });

    // Calculate total revenue (from premium users)
    const totalRevenue = premiumUsers * 500; // Assuming Rs 500 per premium user

    // Get recent activity (last 10 sessions)
    const recentActivity = await YogaSession.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user_id', 'fullName email')
      .select('user_id total_duration poses createdAt');

    // Format recent activity
    const formattedActivity = recentActivity.map(session => ({
      id: session._id,
      userName: session.user_id?.fullName || 'Unknown User',
      userEmail: session.user_id?.email || '',
      action: 'Completed yoga session',
      poses: session.poses?.length || 0,
      duration: Math.round(session.total_duration || 0),
      timestamp: session.createdAt,
      timeAgo: getTimeAgo(session.createdAt)
    }));

    // Get scheduled sessions count
    const scheduledSessions = await Schedule.countDocuments({
      date: { $gte: new Date() }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeToday: activeToday.length,
        premiumUsers,
        totalSessions,
        todaySessions,
        totalRevenue,
        scheduledSessions
      },
      recentActivity: formattedActivity
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

// Get all server statuses
exports.getServerStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin only.' 
      });
    }

    const servers = [
      { name: 'Backend API', url: 'http://localhost:5001/api/auth/me', port: 5001 },
      { name: 'ML Service', url: 'http://localhost:5000', port: 5000 },
      { name: 'Diet Service', url: 'http://localhost:5002', port: 5002 },
      { name: 'Photo Service', url: 'http://localhost:5010', port: 5010 }
    ];

    const statusChecks = await Promise.all(
      servers.map(async (server) => {
        try {
          const response = await axios.get(server.url, { timeout: 2000 });
          return {
            name: server.name,
            port: server.port,
            status: 'online',
            responseTime: response.headers['x-response-time'] || 'N/A'
          };
        } catch (error) {
          return {
            name: server.name,
            port: server.port,
            status: 'offline',
            error: error.message
          };
        }
      })
    );

    // Check database
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'online' : 'offline';

    res.json({
      success: true,
      servers: statusChecks,
      database: {
        name: 'Database',
        status: dbStatus
      }
    });

  } catch (error) {
    console.error('Server status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check server status',
      error: error.message
    });
  }
};

// Get all users (for user management)
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin only.' 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get system analytics
exports.getAnalytics = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin only.' 
      });
    }

    // Get user growth (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await User.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });

      last7Days.push({
        date: date.toISOString().split('T')[0],
        users: count
      });
    }

    // Get session stats (last 7 days)
    const sessionStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await YogaSession.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });

      sessionStats.push({
        date: date.toISOString().split('T')[0],
        sessions: count
      });
    }

    res.json({
      success: true,
      analytics: {
        userGrowth: last7Days,
        sessionStats
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// Get recent login logs
exports.getLoginLogs = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin only.' 
      });
    }

    const limit = parseInt(req.query.limit) || 20;

    const logs = await LoginLog.find()
      .sort({ loginTime: -1 })
      .limit(limit)
      .select('user email userName loginTime ipAddress deviceInfo status');

    // Format logs
    const formattedLogs = logs.map(log => ({
      id: log._id,
      userId: log.user,
      email: log.email,
      userName: log.userName,
      loginTime: log.loginTime,
      timeAgo: getTimeAgo(log.loginTime),
      ipAddress: log.ipAddress,
      device: log.deviceInfo?.device || 'Unknown',
      browser: log.deviceInfo?.browser || 'Unknown',
      os: log.deviceInfo?.os || 'Unknown',
      status: log.status
    }));

    res.json({
      success: true,
      logs: formattedLogs
    });

  } catch (error) {
    console.error('Login logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch login logs',
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