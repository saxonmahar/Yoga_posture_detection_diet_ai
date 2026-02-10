const PoseSession = require('../models/posesession');
const UserProgress = require('../models/userProgress');
const AnalyticsService = require('../services/analyticsService');

// Record a new yoga session
const recordYogaSession = async (req, res) => {
  try {
    console.log('📊 Recording yoga session:', req.body);
    const { user_id, poses_practiced, total_duration, session_notes } = req.body;

    // Create new pose session using PoseSession model
    const sessionEndTime = new Date();
    const sessionStartTime = new Date(sessionEndTime.getTime() - (total_duration * 60 * 1000)); // Calculate start time from duration
    
    const poseSession = new PoseSession({
      userId: user_id,
      sessionName: session_notes || 'Yoga Practice Session',
      sessionType: 'yoga',
      duration: Math.round(total_duration), // in minutes
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      status: 'completed',
      totalPoses: poses_practiced?.length || 0,
      poses: poses_practiced?.map(pose => ({
        poseId: pose.pose_id,
        poseName: pose.pose_name,
        accuracyScore: pose.accuracy_score || 0,
        holdDuration: pose.hold_duration || 0,
        feedback: pose.feedback_given?.map(msg => ({
          category: 'form',
          message: msg,
          severity: 'good'
        })) || []
      })) || []
    });

    await poseSession.save();
    console.log('✅ Pose session saved:', poseSession._id);

    // Update user progress with retry logic for version conflicts
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

    // Retry save with version conflict handling
    let saveAttempts = 0;
    const maxAttempts = 3;
    let saved = false;
    
    while (!saved && saveAttempts < maxAttempts) {
      try {
        await userProgress.save();
        saved = true;
        console.log('✅ User progress updated');
      } catch (error) {
        if (error.name === 'VersionError' && saveAttempts < maxAttempts - 1) {
          saveAttempts++;
          console.log(`⚠️ Version conflict, retrying... (attempt ${saveAttempts}/${maxAttempts})`);
          // Reload the document and reapply changes
          userProgress = await UserProgress.findOne({ user_id });
          poses_practiced.forEach(pose => {
            userProgress.updatePoseProgress(
              pose.pose_id, 
              pose.pose_name, 
              pose.accuracy_score, 
              pose.completed_successfully
            );
          });
          userProgress.updateOverallStats();
          userProgress.overall_stats.total_practice_time += total_duration;
          await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
        } else {
          throw error;
        }
      }
    }

    // Check for new achievements (simple implementation)
    const newAchievements = [];
    
    // First session achievement
    if (userProgress.overall_stats.total_sessions === 1) {
      newAchievements.push({
        name: 'First Session Complete',
        description: 'Completed your first yoga session!',
        icon: '🎉'
      });
    }
    
    // Streak achievements
    if (userProgress.overall_stats.current_streak === 3) {
      newAchievements.push({
        name: '3-Day Streak',
        description: 'Completed yoga for 3 consecutive days!',
        icon: '🔥'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Yoga session recorded successfully',
      session: poseSession,
      progress: userProgress,
      new_achievements: newAchievements
    });

  } catch (error) {
    console.error('❌ Error recording yoga session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record yoga session',
      details: error.message
    });
  }
};

// Get user progress analytics - REAL DATA
const getUserAnalytics = async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log(`📈 Fetching analytics for user: ${user_id}`);

    // Use the analytics service for REAL data
    const analyticsResult = await AnalyticsService.getUserAnalytics(user_id);

    if (!analyticsResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch analytics',
        details: analyticsResult.error
      });
    }

    console.log(`✅ Analytics fetched successfully for user ${user_id}`);
    res.json(analyticsResult);

  } catch (error) {
    console.error('❌ Error fetching user analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user analytics',
      details: error.message
    });
  }
};

// Check for new achievements based on user progress
const checkAchievements = async (userProgress) => {
  const newAchievements = [];
  
  // First session achievement
  if (userProgress.overall_stats.total_sessions === 1) {
    newAchievements.push({
      name: 'First Steps',
      description: 'Completed your first yoga session!',
      icon: '🎉',
      unlocked_date: new Date()
    });
  }
  
  // Streak achievements
  if (userProgress.overall_stats.current_streak === 3) {
    newAchievements.push({
      name: 'Consistency Builder',
      description: '3-day practice streak!',
      icon: '🔥',
      unlocked_date: new Date()
    });
  }
  
  // Session milestones
  if (userProgress.overall_stats.total_sessions === 10) {
    newAchievements.push({
      name: 'Dedicated Practitioner',
      description: 'Completed 10 yoga sessions!',
      icon: '🏆',
      unlocked_date: new Date()
    });
  }
  
  return newAchievements;
};

module.exports = {
  recordYogaSession,
  getUserAnalytics,
  checkAchievements
};