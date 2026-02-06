const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { verifyToken } = require('../middleware/authMiddleware');

// Get recent community activity
router.get('/activity', verifyToken, communityController.getRecentActivity);

// Get top active friends/users
router.get('/top-friends', verifyToken, communityController.getTopFriends);

// Get user badges
router.get('/badges/:user_id', verifyToken, communityController.getUserBadges);

module.exports = router;
