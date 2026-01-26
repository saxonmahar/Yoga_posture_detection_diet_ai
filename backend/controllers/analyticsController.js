const YogaSession = require('../models/yogaSession');
const UserProgress = require('../models/userProgress');
// Don't import User model here to avoid overwrite error

// Record a new yoga session
const recordYogaSession = async (req, res) => {
  try {
    const { user_id, poses_practiced, total_duration, session_notes } = req.body;

    // Create new yoga session
    const yogaSession = new YogaSession({
      user_id,
      poses_practiced,
      total_duration,
      session_notes
    });

    await yogaSession.save();

    // Update user progress
    let userProgress = await UserProgress.findOne({ user_id });
    
    if (!userProgress) {
      userProgress = new UserProgress({ user_id });
    }

    // Update progress for each pose practiced
    poses_practiced.forEach(pose => {
      userProgress.updatePoseProgress(
        pose.pose_id, 
        pose.pose_name, 
        pose.accuracy_score, 
        pose.completed_successfully
      );
    });

    // Update overall stats
    userProgress.updateOverallStats();
    userProgress.overall_stats.total_practice_time += total_duration;

    await userProgress.save();

    // Check for new achievements
    const newAchievements = await checkAchievements(userProgress);

    res.status(201).json({
      success: true,
      message: 'Yoga session recorded successfully',
      session: yogaSession,
      progress: userProgress,
      new_achievements: newAchievements
    });

  } catch (error) {
    console.error('Error recording yoga session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record yoga session',
      details: error.message
    });
  }
};

// Get user progress analytics
const getUserAnalytics = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Get user progress
    const userProgress = await UserProgress.findOne({ user_id }).populate('user_id', 'name email');
    
    if (!userProgress) {
      return res.status(404).json({
        success: false,
        error: 'No progress data found for this user'
      });
    }

    // Get recent sessions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSessions = await YogaSession.find({
      user_id,
      session_date: { $gte: thirtyDaysAgo }
    }).sort({ session_date: -1 });

    // Calculate analytics
    const analytics = {
      user_info: userProgress.user_id,
      overall_stats: userProgress.overall_stats,
      pose_progress: userProgress.pose_progress,
      achievements: userProgress.achievements,
      goals: userProgress.goals,
      recent_sessions: recentSessions,
      insights: generateInsights(userProgress, recentSessions)
    };

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Error getting user analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user analytics',
      details: error.message
    });
  }
};

// Get dashboard summary for all users (leaderboard)
const getDashboardSummary = async (req, res) => {
  try {
    // Get top performers
    const topPerformers = await UserProgress.find()
      .populate('user_id', 'name')
      .sort({ 'overall_stats.longest_streak': -1 })
      .limit(10);

    // Get overall statistics
    const totalUsers = await UserProgress.countDocuments();
    const totalSessions = await YogaSession.countDocuments();
    
    const avgStats = await UserProgress.aggregate([
      {
        $group: {
          _id: null,
          avgStreak: { $avg: '$overall_stats.current_streak' },
          avgPracticeTime: { $avg: '$overall_stats.total_practice_time' },
          avgSessions: { $avg: '$overall_stats.total_sessions' }
        }
      }
    ]);

    // Get pose popularity
    const posePopularity = await UserProgress.aggregate([
      { $unwind: '$pose_progress' },
      {
        $group: {
          _id: '$pose_progress.pose_name',
          total_attempts: { $sum: '$pose_progress.total_attempts' },
          avg_score: { $avg: '$pose_progress.average_score' },
          practitioners: { $sum: 1 }
        }
      },
      { $sort: { total_attempts: -1 } }
    ]);

    res.json({
      success: true,
      dashboard: {
        total_users: totalUsers,
        total_sessions: totalSessions,
        top_performers: topPerformers,
        average_stats: avgStats[0] || {},
        pose_popularity: posePopularity
      }
    });

  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard summary',
      details: error.message
    });
  }
};

// Generate AI insights for user
const generateInsights = (userProgress, recentSessions) => {
  const insights = [];

  // Improvement insights
  userProgress.pose_progress.forEach(pose => {
    if (pose.improvement_trend === 'Improving') {
      insights.push({
        type: 'improvement',
        message: `Great progress in ${pose.pose_name}! You've improved significantly.`,
        icon: '📈'
      });
    } else if (pose.improvement_trend === 'Declining') {
      insights.push({
        type: 'suggestion',
        message: `Consider practicing ${pose.pose_name} more - your scores have been declining.`,
        icon: '💡'
      });
    }
  });

  // Streak insights
  if (userProgress.overall_stats.current_streak >= 7) {
    insights.push({
      type: 'achievement',
      message: `Amazing! You're on a ${userProgress.overall_stats.current_streak}-day streak!`,
      icon: '🔥'
    });
  }

  // Practice time insights
  const avgSessionTime = recentSessions.length > 0 ? 
    recentSessions.reduce((sum, s) => sum + s.total_duration, 0) / recentSessions.length : 0;
  
  if (avgSessionTime > 15) {
    insights.push({
      type: 'positive',
      message: `You're dedicating great time to practice - averaging ${Math.round(avgSessionTime)} minutes per session!`,
      icon: '⏰'
    });
  }

  // Recommendation insights
  const weakestPose = userProgress.pose_progress.reduce((min, pose) => 
    pose.average_score < (min?.average_score || 100) ? pose : min, null
  );

  if (weakestPose) {
    insights.push({
      type: 'recommendation',
      message: `Focus on ${weakestPose.pose_name} - it's your biggest opportunity for improvement.`,
      icon: '🎯'
    });
  }

  return insights.slice(0, 5); // Return top 5 insights
};

// Check for new achievements
const checkAchievements = async (userProgress) => {
  const newAchievements = [];
  const existingAchievements = userProgress.achievements.map(a => a.achievement_id);

  // Define achievements
  const achievements = [
    {
      id: 'first_session',
      name: 'First Steps',
      description: 'Complete your first yoga session',
      condition: () => userProgress.overall_stats.total_sessions >= 1,
      icon: '🌱'
    },
    {
      id: 'week_streak',
      name: 'Week Warrior',
      description: 'Practice for 7 consecutive days',
      condition: () => userProgress.overall_stats.current_streak >= 7,
      icon: '🔥'
    },
    {
      id: 'perfect_pose',
      name: 'Pose Perfect',
      description: 'Achieve 90%+ accuracy in any pose',
      condition: () => userProgress.pose_progress.some(p => p.best_score >= 90),
      icon: '🎯'
    },
    {
      id: 'pose_master',
      name: 'Pose Master',
      description: 'Master all 6 yoga poses',
      condition: () => userProgress.pose_progress.filter(p => p.mastery_level === 'Master').length >= 6,
      icon: '👑'
    },
    {
      id: 'dedicated_practitioner',
      name: 'Dedicated Practitioner',
      description: 'Complete 50 yoga sessions',
      condition: () => userProgress.overall_stats.total_sessions >= 50,
      icon: '🏆'
    }
  ];

  // Check each achievement
  achievements.forEach(achievement => {
    if (!existingAchievements.includes(achievement.id) && achievement.condition()) {
      const newAchievement = {
        achievement_id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        unlocked_date: new Date(),
        icon: achievement.icon
      };
      
      userProgress.achievements.push(newAchievement);
      newAchievements.push(newAchievement);
    }
  });

  return newAchievements;
};

module.exports = {
  recordYogaSession,
  getUserAnalytics,
  getDashboardSummary,
  generateInsights,
  checkAchievements
};