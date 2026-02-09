// Admin Routes - System Management
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { verifyAdmin } = require('../middleware/adminMiddleware');

// All admin routes require authentication AND admin role
router.use(verifyToken);
router.use(verifyAdmin);

// Get admin dashboard stats
router.get('/stats', adminController.getAdminStats);

// Get database status
router.get('/db-status', adminController.getDatabaseStatus);

// Get all server statuses
router.get('/server-status', adminController.getServerStatus);

// Get all users (for user management)
router.get('/users', adminController.getAllUsers);

// Get analytics data
router.get('/analytics', adminController.getAnalytics);

module.exports = router;