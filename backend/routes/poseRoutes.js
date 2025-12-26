const express = require('express');
const router = express.Router();
const poseController = require('../controllers/poseController');
const { verifyToken } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(verifyToken);

// Routes - Note: These are relative to /api/pose
router.post('/sessions', poseController.createSession);        // POST /api/pose/sessions
router.get('/sessions', poseController.getUserSessions);       // GET /api/pose/sessions
router.get('/sessions/:sessionId', poseController.getSessionDetails); // GET /api/pose/sessions/:id
router.put('/sessions/:sessionId/complete', poseController.completeSession); // PUT /api/pose/sessions/:id/complete
router.delete('/sessions/:sessionId', poseController.deleteSession); // DELETE /api/pose/sessions/:id
router.post('/analyze', poseController.analyzePose);           // POST /api/pose/analyze

module.exports = router;