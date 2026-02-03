const express = require('express');
const router = express.Router();
const {
  confirmLogin,
  denyLogin,
  getSecurityDashboard
} = require('../controllers/securityController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes (no auth required)
router.get('/confirm', confirmLogin);
router.get('/deny', denyLogin);

// Protected routes (auth required)
router.get('/dashboard', verifyToken, getSecurityDashboard);

module.exports = router;