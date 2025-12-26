const analyticsService = require('../services/analyticsService');

exports.getUserAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await analyticsService.getUserAnalytics(userId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analytics'
        });
    }
};

exports.saveProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const progressData = req.body;

        const result = await analyticsService.saveProgress(userId, progressData);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json({
            success: true,
            message: 'Progress saved successfully',
            progress: result.progress
        });
    } catch (error) {
        console.error('Save progress error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save progress'
        });
    }
};

exports.getProgressHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 30 } = req.query;

        const result = await analyticsService.getProgressHistory(userId, parseInt(limit));

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json({
            success: true,
            progress: result.progress
        });
    } catch (error) {
        console.error('Get progress history error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch progress history'
        });
    }
};

exports.getStreaks = async (req, res) => {
    try {
        const userId = req.user.id;

        const currentStreak = await analyticsService.calculateCurrentStreak(userId);
        const longestStreak = await analyticsService.calculateLongestStreak(userId);

        res.json({
            success: true,
            streaks: {
                currentStreak,
                longestStreak
            }
        });
    } catch (error) {
        console.error('Get streaks error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate streaks'
        });
    }
};