const express = require('express');
const router = express.Router();
const {
  getSchedule,
  createSession,
  updateSession,
  completeSession,
  deleteSession,
  getScheduleTemplates,
  applyTemplate
} = require('../controllers/scheduleController');
const { verifyToken } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Schedule routes
router.get('/', getSchedule);
router.post('/', createSession);
router.put('/:sessionId', updateSession);
router.patch('/:sessionId/complete', completeSession);
router.delete('/:sessionId', deleteSession);

// Template routes
router.get('/templates', getScheduleTemplates);
router.post('/templates/apply', applyTemplate);

module.exports = router;