const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');
const validateRegistration = require('../middleware/validation');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegistration, registerUser);

module.exports = router;