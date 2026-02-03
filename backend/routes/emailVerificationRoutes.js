const express = require('express');
const router = express.Router();
const {
  verifyEmail,
  resendVerificationEmail,
  checkVerificationStatus
} = require('../controllers/emailVerificationController');

// POST /api/email/verify - Verify email with OTP
router.post('/verify', verifyEmail);

// POST /api/email/resend - Resend verification email
router.post('/resend', resendVerificationEmail);

// GET /api/email/status - Check verification status
router.get('/status', checkVerificationStatus);

module.exports = router;