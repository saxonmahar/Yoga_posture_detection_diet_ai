const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/recommendations', dietController.getDietRecommendation);

// Yoga-Diet Integration (public for now)
router.post('/post-yoga-meals', dietController.getPostYogaMeals);
router.get('/pre-yoga-meals', dietController.getPreYogaMeals);
router.get('/nepali-foods', dietController.getNepaliFood);
router.get('/search', dietController.searchFoods);

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