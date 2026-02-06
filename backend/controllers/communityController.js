const YogaSession = require('../models/yogaSession');
const UserProgress = require('../models/userProgress');
const User = require('../models/user');

// Get recent community activity from real users
const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    console.log(`📊 Fetching recent community activity (limit: ${limit})`);

    // Get recent yoga sessions with user details
    const recentSessions = await YogaSession.find()
      .sort({ session_date: -1 })
      .limit(limit)
      .lean();

    // Manually populate user data to ensure we get real names
    const activitiesPromises = recentSessions.map(async (session) => {
      // Get user data
      let user = null;
      try {
        user = await User.findById(session.user_id).select('name email profilePhoto').lean();
      } catch (err) {
        console.error('Error fetching user:', err);
      }

      if (!user || !user.name) {
        console.log(`⚠️ User not found or missing name for session ${session._id}, user_id: ${session.user_id}`);
        return null; // Skip sessions without valid users
      }

      const totalPoses = session.poses_practiced?.length || 0;
      const avgAccuracy = session.poses_practiced?.length > 0
        ? Math.round(session.poses_practiced.reduce((sum, pose) => sum + (pose.accuracy_score || 0), 0) / totalPoses)
        : 0;
      
      // Get the best pose from the session
      const bestPose = session.poses_practiced?.reduce((best, current) => 
        (current.accuracy_score || 0) > (best.accuracy_score || 0) ? current : best
      , session.poses_practiced[0]);

      return {
        id: session._id,
        user: {
          id: user._id,
          name: user.name, // Real name from database
          username: `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
          profilePhoto: user.profilePhoto, // Real photo from database
          isOnline: false
        },
        type: 'session_complete',
        content: `Just completed my ${totalPoses}-pose session! ${bestPose?.pose_name || 'Yoga'} is finally feeling natural. Thanks to this amazing community for the motivation!`,
        timestamp: session.session_date,
        timeAgo: getTimeAgo(session.session_date),
        stats: {
          duration: session.total_duration,
          poses: totalPoses,
          avgAccuracy: avgAccuracy,
          bestPose: bestPose?.pose_name
        },
        likes: 0,
        comments: 0
      };
    });

    const activities = (await Promise.all(activitiesPromises)).filter(a => a !== null);

    console.log(`✅ Fetched ${activities.length} activities with real user data`);

    res.json({
      success: true,
      activities,
      count: activities.length
    });

  } catch (error) {
    console.error('❌ Error fetching community activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch community activity',
      details: error.message
    });
  }
};

// Get top friends/active users
const getTopFriends = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    console.log(`👥 Fetching top active users (limit: ${limit})`);

    // Get users with most recent activity
    const activeUsers = await UserProgress.find()
      .sort({ 'overall_stats.total_sessions': -1, 'overall_stats.current_streak': -1 })
      .limit(limit)
      .lean();

    // Manually fetch user data to ensure we get real names
    const topFriendsPromises = activeUsers.map(async (progress, index) => {
      let user = null;
      try {
        user = await User.findById(progress.user_id).select('name email profilePhoto').lean();
      } catch (err) {
        console.error('Error fetching user:', err);
      }

      if (!user || !user.name) {
        console.log(`⚠️ User not found or missing name for progress ${progress._id}, user_id: ${progress.user_id}`);
        return null; // Skip users without valid data
      }

      return {
        id: user._id,
        name: user.name, // Real name from database
        username: `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
        profilePhoto: user.profilePhoto, // Real photo from database
        rank: index + 1,
        level: getLevelFromSessions(progress.overall_stats?.total_sessions || 0),
        streak: progress.overall_stats?.current_streak || 0,
        totalSessions: progress.overall_stats?.total_sessions || 0,
        isOnline: false
      };
    });

    const topFriends = (await Promise.all(topFriendsPromises)).filter(f => f !== null);

    console.log(`✅ Fetched ${topFriends.length} top users with real data:`, topFriends.map(f => f.name));

    res.json({
      success: true,
      topFriends,
      count: topFriends.length
    });

  } catch (error) {
    console.error('❌ Error fetching top friends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top friends',
      details: error.message
    });
  }
};

// Get user badges based on real achievements
const getUserBadges = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    console.log(`🏅 Fetching badges for user: ${user_id}`);

    const userProgress = await UserProgress.findOne({ user_id });
    
    if (!userProgress) {
      return res.json({
        success: true,
        badges: [],
        count: 0
      });
    }

    const badges = [];
    const stats = userProgress.overall_stats;

    // First Steps badge
    if (stats.total_sessions >= 1) {
      badges.push({
        id: 'first-steps',
        name: 'First Steps',
        description: 'Completed your first session',
        icon: '🎯',
        unlocked: true,
        unlockedDate: userProgress.createdAt
      });
    }

    // Consistency Starter badge
    if (stats.current_streak >= 3) {
      badges.push({
        id: 'consistency-starter',
        name: 'Consistency Starter',
        description: '3-day practice streak',
        icon: '🔥',
        unlocked: true
      });
    }

    // Dedicated Practitioner badge
    if (stats.total_sessions >= 10) {
      badges.push({
        id: 'dedicated-practitioner',
        name: 'Dedicated Practitioner',
        description: 'Completed 10 sessions',
        icon: '🏆',
        unlocked: true
      });
    }

    // Streak Master badge
    if (stats.current_streak >= 7) {
      badges.push({
        id: 'streak-master',
        name: 'Streak Master',
        description: '7-day practice streak',
        icon: '⭐',
        unlocked: true
      });
    }

    res.json({
      success: true,
      badges,
      count: badges.length
    });

  } catch (error) {
    console.error('❌ Error fetching user badges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user badges',
      details: error.message
    });
  }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return new Date(date).toLocaleDateString();
}

// Helper function to determine level from sessions
function getLevelFromSessions(sessions) {
  if (sessions < 10) return 'Beginner';
  if (sessions < 30) return 'Intermediate';
  if (sessions < 50) return 'Advanced';
  return 'Expert';
}

module.exports = {
  getRecentActivity,
  getTopFriends,
  getUserBadges
};
