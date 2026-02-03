const express = require('express');
const router = express.Router();
const {
  requestPasswordReset,
  verifyResetToken,
  resetPassword
} = require('../controllers/forgotPasswordController');

// POST /api/password/forgot - Request password reset
router.post('/forgot', requestPasswordReset);

// POST /api/password/verify - Verify reset token
router.post('/verify', verifyResetToken);

// POST /api/password/reset - Reset password
router.post('/reset', resetPassword);

module.exports = router;