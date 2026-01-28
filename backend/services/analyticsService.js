const YogaSession = require('../models/yogaSession');
const UserProgress = require('../models/userProgress');
const Food = require('../models/food');

class AnalyticsService {
    // Get overall user analytics with REAL data
    async getUserAnalytics(userId) {
        try {
            console.log(`📊 Fetching analytics for user: ${userId}`);
            
            // Get ALL yoga sessions for this user (not just last 30 days for now)
            const sessions = await YogaSession.find({
                user_id: userId
            }).sort({ session_date: -1 });

            console.log(`📈 Found ${sessions.length} sessions for user ${userId}`);

            if (sessions.length === 0) {
                // Return default structure for new users
                return {
                    success: true,
                    analytics: {
                        overall_stats: {
                            total_sessions: 0,
                            current_streak: 0,
                            total_practice_time: 0,
                            overall_mastery_level: 'Beginner',
                            favorite_pose: 'None yet'
                        },
                        pose_progress: [],
                        achievements: [],
                        recent_sessions: [],
                        insights: [
                            {
                                message: 'Welcome! Complete your first yoga session to start tracking progress.',
                                type: 'suggestion',
                                icon: '🧘‍♀️'
                            }
                        ]
                    }
                };
            }

            // Calculate real metrics from actual sessions
            const totalSessions = sessions.length;
            const totalDuration = sessions.reduce((sum, s) => sum + (s.total_duration || 0), 0);
            
            // Calculate average accuracy from all poses in all sessions
            let totalAccuracySum = 0;
            let totalPoseCount = 0;
            
            sessions.forEach(session => {
                if (session.poses_practiced && session.poses_practiced.length > 0) {
                    session.poses_practiced.forEach(pose => {
                        totalAccuracySum += pose.accuracy_score || 0;
                        totalPoseCount++;
                    });
                }
            });
            
            const avgAccuracy = totalPoseCount > 0 ? Math.round(totalAccuracySum / totalPoseCount) : 0;

            // Most practiced poses
            const poseCount = {};
            sessions.forEach(session => {
                if (session.poses_practiced) {
                    session.poses_practiced.forEach(pose => {
                        if (pose.pose_name) {
                            poseCount[pose.pose_name] = (poseCount[pose.pose_name] || 0) + 1;
                        }
                    });
                }
            });

            const topPoses = Object.entries(poseCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([pose, count]) => ({ pose, count }));

            const favoritePose = topPoses.length > 0 ? topPoses[0].pose : 'None yet';

            // Calculate current streak
            const currentStreak = await this.calculateCurrentStreak(userId);

            // Create pose progress data
            const poseProgress = Object.entries(poseCount).map(([poseName, count]) => {
                // Get all attempts for this pose
                const poseAttempts = [];
                sessions.forEach(session => {
                    if (session.poses_practiced) {
                        session.poses_practiced.forEach(pose => {
                            if (pose.pose_name === poseName) {
                                poseAttempts.push(pose);
                            }
                        });
                    }
                });

                const avgScore = poseAttempts.length > 0 
                    ? Math.round(poseAttempts.reduce((sum, p) => sum + (p.accuracy_score || 0), 0) / poseAttempts.length)
                    : 0;
                
                const bestScore = poseAttempts.length > 0 
                    ? Math.max(...poseAttempts.map(p => p.accuracy_score || 0))
                    : 0;

                const successfulCompletions = poseAttempts.filter(p => p.completed_successfully).length;

                return {
                    pose_id: `yog${Math.floor(Math.random() * 6) + 1}`, // Generate ID
                    pose_name: poseName,
                    mastery_level: bestScore >= 90 ? 'Advanced' : bestScore >= 75 ? 'Intermediate' : 'Beginner',
                    average_score: avgScore,
                    best_score: bestScore,
                    total_attempts: poseAttempts.length,
                    successful_completions: successfulCompletions,
                    improvement_trend: 'Improving' // Could be calculated from recent vs old scores
                };
            });

            // Generate achievements based on real data
            const achievements = [];
            if (totalSessions >= 1) {
                achievements.push({
                    name: 'First Session Complete',
                    description: 'Completed your first yoga session!',
                    unlocked_date: sessions[sessions.length - 1].session_date,
                    icon: '🎉'
                });
            }
            if (totalSessions >= 5) {
                achievements.push({
                    name: 'Dedicated Practitioner',
                    description: 'Completed 5 yoga sessions!',
                    unlocked_date: sessions[sessions.length - 5].session_date,
                    icon: '🏆'
                });
            }
            if (currentStreak >= 3) {
                achievements.push({
                    name: 'Streak Master',
                    description: `${currentStreak} day practice streak!`,
                    unlocked_date: new Date().toISOString(),
                    icon: '🔥'
                });
            }

            // Generate insights based on real data
            const insights = [];
            if (avgAccuracy >= 85) {
                insights.push({
                    message: `Excellent form! Your average accuracy is ${avgAccuracy}%`,
                    type: 'achievement',
                    icon: '🎯'
                });
            } else if (avgAccuracy >= 70) {
                insights.push({
                    message: `Good progress! Your accuracy is ${avgAccuracy}%. Keep practicing!`,
                    type: 'improvement',
                    icon: '📈'
                });
            } else {
                insights.push({
                    message: `Focus on form accuracy. Current average: ${avgAccuracy}%`,
                    type: 'suggestion',
                    icon: '💪'
                });
            }

            if (currentStreak >= 3) {
                insights.push({
                    message: `Amazing ${currentStreak}-day streak! Consistency is key!`,
                    type: 'achievement',
                    icon: '🔥'
                });
            }

            return {
                success: true,
                analytics: {
                    overall_stats: {
                        total_sessions: totalSessions,
                        current_streak: currentStreak,
                        total_practice_time: totalDuration,
                        overall_mastery_level: avgAccuracy >= 85 ? 'Advanced' : avgAccuracy >= 70 ? 'Intermediate' : 'Beginner',
                        favorite_pose: favoritePose
                    },
                    pose_progress: poseProgress,
                    achievements: achievements,
                    recent_sessions: sessions.slice(0, 5), // Last 5 sessions
                    insights: insights
                }
            };

        } catch (error) {
            console.error('❌ Error fetching user analytics:', error);
            return { success: false, error: error.message };
        }
    }

    // Calculate current streak with REAL data
    async calculateCurrentStreak(userId) {
        try {
            const sessions = await YogaSession.find({
                user_id: userId
            }).sort({ session_date: -1 });

            if (sessions.length === 0) return 0;

            let streak = 0;
            let currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            // Check each day going backwards
            while (true) {
                const startOfDay = new Date(currentDate);
                const endOfDay = new Date(currentDate);
                endOfDay.setHours(23, 59, 59, 999);

                const hasSession = sessions.find(session => {
                    const sessionDate = new Date(session.session_date);
                    return sessionDate >= startOfDay && sessionDate <= endOfDay;
                });

                if (hasSession) {
                    streak++;
                    currentDate.setDate(currentDate.getDate() - 1);
                } else {
                    // If it's today and no session, don't break streak yet
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (currentDate.getTime() === today.getTime()) {
                        currentDate.setDate(currentDate.getDate() - 1);
                        continue;
                    }
                    break;
                }
            }

            return streak;
        } catch (error) {
            console.error('❌ Error calculating streak:', error);
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