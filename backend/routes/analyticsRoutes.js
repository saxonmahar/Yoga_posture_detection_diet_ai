const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// All analytics routes require authentication
router.use(authMiddleware.verifyToken);

// Analytics endpoints
router.get('/overview', analyticsController.getUserAnalytics);
router.get('/streaks', analyticsController.getStreaks);
router.get('/progress-history', analyticsController.getProgressHistory);

// Progress tracking
router.post('/progress', analyticsController.saveProgress);

module.exports = router;