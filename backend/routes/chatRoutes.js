const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../middleware/authMiddleware');

// Guest chat (no authentication required)
router.post('/guest', chatController.sendGuestMessage);

// All other chat routes require authentication
router.use(verifyToken);

// Send message to AI assistant
router.post('/message', chatController.sendMessage);

// Get chat history
router.get('/history', chatController.getChatHistory);

// Clear chat history
router.delete('/history', chatController.clearChatHistory);

// Get chat statistics
router.get('/stats', chatController.getChatStats);

module.exports = router;
