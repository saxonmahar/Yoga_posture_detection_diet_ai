const dietService = require('../services/dietService');
const yogaDietService = require('../services/yogaDietService');

// Get post-yoga meal recommendations
exports.getPostYogaMeals = async (req, res) => {
    try {
        console.log('🧘 Post-yoga meal request:', req.body);
        
        const sessionData = {
            caloriesBurned: req.body.caloriesBurned || 0,
            duration: req.body.duration || 0,
            poses: req.body.poses || [],
            accuracy: req.body.accuracy || 0,
            timeOfDay: req.body.timeOfDay || 'morning'
        };

        const recommendations = yogaDietService.getPostYogaMeals(sessionData);

        res.json({
            success: true,
            ...recommendations
        });
    } catch (error) {
        console.error('❌ Post-yoga meal error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get post-yoga meal recommendations',
            details: error.message
        });
    }
};

// Get pre-yoga meal suggestions
exports.getPreYogaMeals = async (req, res) => {
    try {
        const { scheduledTime } = req.query;
        
        if (!scheduledTime) {
            return res.status(400).json({
                success: false,
                error: 'Scheduled time is required'
            });
        }

        const recommendations = yogaDietService.getPreYogaMeals(scheduledTime);

        res.json(recommendations);
    } catch (error) {
        console.error('❌ Pre-yoga meal error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get pre-yoga meal suggestions',
            details: error.message
        });
    }
};

// Get Nepali foods
exports.getNepaliFood = async (req, res) => {
    try {
        const { category, goal } = req.query;
        
        if (goal) {
            const meals = yogaDietService.getMealsByGoal(goal, category || 'lunch');
            return res.json({
                success: true,
                meals
            });
        }

        const foods = yogaDietService.getAllFoods();
        
        if (category) {
            return res.json({
                success: true,
                meals: foods[category] || []
            });
        }

        res.json({
            success: true,
            foods
        });
    } catch (error) {
        console.error('❌ Get Nepali food error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get Nepali food data',
            details: error.message
        });
    }
};

// Search foods
exports.searchFoods = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }

        const results = yogaDietService.searchFoods(q);

        res.json({
            success: true,
            results
        });
    } catch (error) {
        console.error('❌ Search foods error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search foods',
            details: error.message
        });
    }
};

exports.logMeal = async (req, res) => {
    try {
        const userId = req.user.id;
        const mealData = req.body;

        const result = await dietService.logMeal(userId, mealData);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.status(201).json({
            success: true,
            message: 'Meal logged successfully',
            meal: result.meal
        });
    } catch (error) {
        console.error('Log meal error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to log meal'
        });
    }
};

exports.getDietRecommendation = async (req, res) => {
    try {
        console.log('🍎 Diet recommendation request received');
        console.log('👤 User from token:', req.user);
        console.log('📦 Request body:', req.body);
        
        // For public access, user might not be authenticated
        const userId = req.user?.id || 'guest';
        const userData = {
            userId,
            ...req.body
        };

        console.log('📤 Sending to diet service:', userData);
        const result = await dietService.getDietRecommendation(userData);

        res.json({
            success: true,
            message: 'Diet recommendation generated',
            ...result
        });
    } catch (error) {
        console.error('❌ Diet recommendation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate diet recommendation',
            details: error.message
        });
    }
};

exports.getTodayMeals = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await dietService.getTodayMeals(userId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Get today meals error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch meals'
        });
    }
};

exports.getMealById = async (req, res) => {
    try {
        const { mealId } = req.params;

        const result = await dietService.getMealById(mealId);

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.json({
            success: true,
            meal: result.meal
        });
    } catch (error) {
        console.error('Get meal error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch meal'
        });
    }
};

exports.updateMeal = async (req, res) => {
    try {
        const { mealId } = req.params;
        const updateData = req.body;

        const result = await dietService.updateMeal(mealId, updateData);

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.json({
            success: true,
            message: 'Meal updated successfully',
            meal: result.meal
        });
    } catch (error) {
        console.error('Update meal error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update meal'
        });
    }
};

exports.deleteMeal = async (req, res) => {
    try {
        const { mealId } = req.params;

        const result = await dietService.deleteMeal(mealId);

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.json({
            success: true,
            message: 'Meal deleted successfully'
        });
    } catch (error) {
        console.error('Delete meal error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete meal'
        });
    }
};

exports.getWeeklySummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate = new Date().toISOString().split('T')[0] } = req.query;

        const result = await dietService.getWeeklySummary(userId, new Date(startDate));

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Weekly summary error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get weekly summary'
        });
    }
};