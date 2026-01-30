const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');
const authMiddleware = require('../middleware/authMiddleware');

// Diet recommendations - temporarily public for testing
router.post('/recommendations', dietController.getDietRecommendation);

// All other diet routes require authentication
router.use(authMiddleware.verifyToken);

// Meal logging
router.post('/meals', dietController.logMeal);
router.get('/meals/today', dietController.getTodayMeals);
router.get('/meals/:mealId', dietController.getMealById);
router.put('/meals/:mealId', dietController.updateMeal);
router.delete('/meals/:mealId', dietController.deleteMeal);

// Analytics
router.get('/weekly-summary', dietController.getWeeklySummary);

module.exports = router;