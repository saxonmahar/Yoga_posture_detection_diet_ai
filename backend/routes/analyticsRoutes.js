const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// Import our new analytics functions
const {
  recordYogaSession,
  getUserAnalytics
} = require('../controllers/analyticsController');

// Public endpoints (no auth required for testing)
router.post('/session', recordYogaSession);

// User-specific endpoints (with auth)
router.get('/user/:user_id', getUserAnalytics);

// Get user progress for specific pose
router.get('/user/:user_id/pose/:pose_id', async (req, res) => {
  try {
    const { user_id, pose_id } = req.params;
    const UserProgress = require('../models/userProgress');
    
    const userProgress = await UserProgress.findOne({ user_id });
    
    if (!userProgress) {
      return res.status(404).json({
        success: false,
        error: 'No progress data found'
      });
    }

    const poseProgress = userProgress.pose_progress.find(p => p.pose_id === pose_id);
    
    if (!poseProgress) {
      return res.status(404).json({
        success: false,
        error: 'No progress data found for this pose'
      });
    }

    res.json({
      success: true,
      pose_progress: poseProgress
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get pose progress',
      details: error.message
    });
  }
});

// Get user's recent sessions
router.get('/user/:user_id/sessions', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 10, days = 30 } = req.query;
    
    const YogaSession = require('../models/yogaSession');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const sessions = await YogaSession.find({
      user_id,
      session_date: { $gte: startDate }
    })
    .sort({ session_date: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      sessions,
      total_sessions: sessions.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get user sessions',
      details: error.message
    });
  }
});

// Legacy endpoints (keep for backward compatibility) - commented out until implemented
// router.get('/overview', authMiddleware.verifyToken, analyticsController.getUserAnalytics);
// router.get('/streaks', authMiddleware.verifyToken, analyticsController.getStreaks);
// router.get('/progress-history', authMiddleware.verifyToken, analyticsController.getProgressHistory);
// router.post('/progress', authMiddleware.verifyToken, analyticsController.saveProgress);

module.exports = router;