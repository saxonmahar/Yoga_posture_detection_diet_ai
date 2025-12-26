const PoseSession = require('../models/posesession');
const Food = require('../models/food');
const Progress = require('../models/progress');

class AnalyticsService {
    // Get overall user analytics
    async getUserAnalytics(userId) {
        try {
            // Get data from last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // Get sessions data
            const sessions = await PoseSession.find({
                userId,
                createdAt: { $gte: thirtyDaysAgo },
                status: 'completed'
            });

            // Get nutrition data
            const meals = await Food.find({
                userId,
                createdAt: { $gte: thirtyDaysAgo }
            });

            // Calculate metrics
            const totalSessions = sessions.length;
            const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
            const totalCaloriesBurned = sessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0);
            const avgAccuracy = sessions.length > 0 
                ? sessions.reduce((sum, s) => sum + (s.avgAccuracy || 0), 0) / sessions.length
                : 0;

            // Nutrition metrics
            const totalMeals = meals.length;
            const avgDailyCalories = totalMeals > 0
                ? meals.reduce((sum, m) => sum + (m.totalCalories || 0), 0) / 30
                : 0;

            // Most practiced poses
            const poseCount = {};
            sessions.forEach(session => {
                session.poses.forEach(pose => {
                    if (pose.poseName) {
                        poseCount[pose.poseName] = (poseCount[pose.poseName] || 0) + 1;
                    }
                });
            });

            const topPoses = Object.entries(poseCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([pose, count]) => ({ pose, count }));

            // Weekly progress
            const weeklyProgress = await this.getWeeklyProgress(userId);

            return {
                success: true,
                analytics: {
                    overview: {
                        totalSessions,
                        totalDuration,
                        totalCaloriesBurned: Math.round(totalCaloriesBurned),
                        avgAccuracy: Math.round(avgAccuracy),
                        totalMeals,
                        avgDailyCalories: Math.round(avgDailyCalories)
                    },
                    topPoses,
                    weeklyProgress,
                    streaks: {
                        currentStreak: await this.calculateCurrentStreak(userId),
                        longestStreak: await this.calculateLongestStreak(userId)
                    },
                    recommendations: this.generateRecommendations({
                        totalSessions,
                        avgAccuracy,
                        avgDailyCalories
                    })
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Calculate current streak
    async calculateCurrentStreak(userId) {
        try {
            let streak = 0;
            let currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            while (true) {
                const startOfDay = new Date(currentDate);
                const endOfDay = new Date(currentDate);
                endOfDay.setHours(23, 59, 59, 999);

                const hasSession = await PoseSession.findOne({
                    userId,
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                    status: 'completed'
                });

                if (hasSession) {
                    streak++;
                    currentDate.setDate(currentDate.getDate() - 1);
                } else {
                    break;
                }
            }

            return streak;
        } catch (error) {
            return 0;
        }
    }

    // Calculate longest streak
    async calculateLongestStreak(userId) {
        try {
            const sessions = await PoseSession.find({
                userId,
                status: 'completed'
            }).sort({ createdAt: 1 });

            if (sessions.length === 0) return 0;

            let longestStreak = 0;
            let currentStreak = 1;
            let prevDate = sessions[0].createdAt.toDateString();

            for (let i = 1; i < sessions.length; i++) {
                const currentDate = sessions[i].createdAt.toDateString();
                const prevDateObj = new Date(prevDate);
                const currentDateObj = new Date(currentDate);
                
                const diffDays = Math.floor((currentDateObj - prevDateObj) / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    currentStreak++;
                } else if (diffDays > 1) {
                    longestStreak = Math.max(longestStreak, currentStreak);
                    currentStreak = 1;
                }
                
                prevDate = currentDate;
            }

            return Math.max(longestStreak, currentStreak);
        } catch (error) {
            return 0;
        }
    }

    // Get weekly progress data
    async getWeeklyProgress(userId) {
        const weeks = [];
        const now = new Date();
        
        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(weekStart.getDate() - (i * 7));
            weekStart.setHours(0, 0, 0, 0);
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);

            const sessions = await PoseSession.find({
                userId,
                createdAt: { $gte: weekStart, $lte: weekEnd },
                status: 'completed'
            });

            const meals = await Food.find({
                userId,
                createdAt: { $gte: weekStart, $lte: weekEnd }
            });

            weeks.push({
                week: `Week ${4 - i}`,
                startDate: weekStart.toISOString().split('T')[0],
                sessions: sessions.length,
                totalDuration: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
                caloriesBurned: sessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0),
                mealsLogged: meals.length
            });
        }

        return weeks;
    }

    // Generate recommendations based on analytics
    generateRecommendations(data) {
        const recommendations = [];

        if (data.totalSessions < 3) {
            recommendations.push('Try to complete at least 3 sessions per week for better results');
        }

        if (data.avgAccuracy < 70) {
            recommendations.push('Focus on improving your form accuracy. Watch the tutorial videos');
        }

        if (data.avgDailyCalories > 2500) {
            recommendations.push('Consider reducing calorie intake for weight management');
        } else if (data.avgDailyCalories < 1500) {
            recommendations.push('Make sure you are eating enough to support your workouts');
        }

        if (recommendations.length === 0) {
            recommendations.push('Great job! Keep up the consistent practice');
        }

        return recommendations;
    }

    // Save progress data
    async saveProgress(userId, progressData) {
        try {
            // Check if progress exists for today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            let progress = await Progress.findOne({
                userId,
                date: { $gte: today, $lt: tomorrow }
            });

            if (progress) {
                // Update existing
                Object.assign(progress, progressData);
            } else {
                // Create new
                progress = new Progress({
                    userId,
                    date: new Date(),
                    ...progressData
                });
            }

            await progress.save();
            return { success: true, progress };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get progress history
    async getProgressHistory(userId, limit = 30) {
        try {
            const progress = await Progress.find({ userId })
                .sort({ date: -1 })
                .limit(limit);

            return { success: true, progress };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new AnalyticsService();