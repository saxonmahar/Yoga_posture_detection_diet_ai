const dietService = require('../services/dietService');

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
        const userId = req.user.id;
        const userData = {
            userId,
            ...req.body
        };

        const result = await dietService.getDietRecommendation(userData);

        res.json({
            success: true,
            message: 'Diet recommendation generated',
            ...result
        });
    } catch (error) {
        console.error('Diet recommendation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate diet recommendation'
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