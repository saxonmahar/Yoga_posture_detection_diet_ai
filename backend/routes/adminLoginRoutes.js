// Admin Login Routes
const express = require('express');
const router = express.Router();
const adminLoginController = require('../controllers/adminLoginController');

// POST /api/admin/login - Admin login
router.post('/login', adminLoginController);

module.exports = router;
