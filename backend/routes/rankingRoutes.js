const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getYogaRankings,
  getUserRanking,
  getLeaderboardStats
} = require('../controllers/rankingController');

// Public route - Get yoga session rankings (leaderboard)
router.get('/leaderboard', getYogaRankings);

// Public route - Get leaderboard statistics
router.get('/stats', getLeaderboardStats);

// Protected route - Get user's personal ranking
router.get('/my-rank', verifyToken, getUserRanking);

module.exports = router;