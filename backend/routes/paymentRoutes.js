const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Initiate payment
router.post('/initiate', paymentController.initiatePayment);

// Verify payment
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
