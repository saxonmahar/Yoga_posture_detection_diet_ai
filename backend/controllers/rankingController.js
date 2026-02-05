const User = require('../models/user');
const YogaSession = require('../models/yogaSession');

// Get yoga session rankings
const getYogaRankings = async (req, res) => {
  try {
    console.log('🏆 Fetching yoga session rankings...');

    // Get all users with their session counts
    const rankings = await User.aggregate([
      {
        $match: {
          isEmailVerified: true // Only include verified users
        }
      },
      {
        $lookup: {
          from: 'yogasessions',
          localField: '_id',
          foreignField: 'user_id',
          as: 'sessions'
        }
      },
      {
        $addFields: {
          sessionCount: { $size: '$sessions' },
          totalAccuracy: {
            $avg: '$sessions.overall_performance.average_accuracy'
          },
          totalMinutesFromSessions: {
            $sum: '$sessions.total_duration'
          },
          lastSessionDate: {
            $max: '$sessions.session_date'
          }
        }
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          profilePhoto: 1,
          fitnessLevel: 1,
          sessionCount: 1,
          totalAccuracy: { $ifNull: ['$totalAccuracy', 0] },
          totalMinutesFromSessions: { $ifNull: ['$totalMinutesFromSessions', 0] },
          lastSessionDate: 1,
          'stats.completedSessions': 1,
          'stats.totalMinutes': 1,
          'stats.averageAccuracy': 1,
          'stats.currentStreak': 1,
          createdAt: 1
        }
      },
      {
        $addFields: {
          // Use the higher value between aggregated sessions and user stats
          finalSessionCount: {
            $max: ['$sessionCount', '$stats.completedSessions']
          },
          finalTotalMinutes: {
            $max: ['$totalMinutesFromSessions', '$stats.totalMinutes']
          },
          finalAccuracy: {
            $cond: {
              if: { $gt: ['$totalAccuracy', 0] },
              then: '$totalAccuracy',
              else: '$stats.averageAccuracy'
            }
          }
        }
      },
      {
        $sort: {
          finalSessionCount: -1, // Primary sort: most sessions
          finalAccuracy: -1,     // Secondary sort: highest accuracy
          finalTotalMinutes: -1, // Tertiary sort: most minutes
          createdAt: 1           // Final sort: oldest users first
        }
      },
      {
        $limit: 50 // Top 50 users
      }
    ]);

    // Add ranking positions and format data
    const formattedRankings = rankings.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      name: user.fullName,
      email: user.email,
      profilePhoto: user.profilePhoto,
      fitnessLevel: user.fitnessLevel,
      sessionCount: user.finalSessionCount || 0,
      totalMinutes: Math.round(user.finalTotalMinutes || 0),
      averageAccuracy: Math.round(user.finalAccuracy || 0),
      currentStreak: user.stats?.currentStreak || 0,
      lastSessionDate: user.lastSessionDate,
      joinedDate: user.createdAt,
      // Badge based on session count
      badge: getBadge(user.finalSessionCount || 0),
      // Level based on total minutes
      level: getLevel(user.finalTotalMinutes || 0)
    }));

    console.log(`✅ Found ${formattedRankings.length} users in rankings`);

    res.status(200).json({
      success: true,
      message: 'Yoga rankings fetched successfully',
      data: {
        rankings: formattedRankings,
        totalUsers: formattedRankings.length,
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Error fetching yoga rankings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch yoga rankings',
      error: error.message
    });
  }
};

// Get user's personal ranking
const getUserRanking = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`🔍 Fetching ranking for user: ${userId}`);

    // Get all users ranked by session count
    const allRankings = await User.aggregate([
      {
        $match: {
          isEmailVerified: true
        }
      },
      {
        $lookup: {
          from: 'yogasessions',
          localField: '_id',
          foreignField: 'user_id',
          as: 'sessions'
        }
      },
      {
        $addFields: {
          sessionCount: { $size: '$sessions' },
          totalAccuracy: {
            $avg: '$sessions.overall_performance.average_accuracy'
          },
          totalMinutesFromSessions: {
            $sum: '$sessions.total_duration'
          }
        }
      },
      {
        $addFields: {
          finalSessionCount: {
            $max: ['$sessionCount', '$stats.completedSessions']
          },
          finalTotalMinutes: {
            $max: ['$totalMinutesFromSessions', '$stats.totalMinutes']
          },
          finalAccuracy: {
            $cond: {
              if: { $gt: ['$totalAccuracy', 0] },
              then: '$totalAccuracy',
              else: '$stats.averageAccuracy'
            }
          }
        }
      },
      {
        $sort: {
          finalSessionCount: -1,
          finalAccuracy: -1,
          finalTotalMinutes: -1,
          createdAt: 1
        }
      }
    ]);

    // Find user's position
    const userRankIndex = allRankings.findIndex(user => user._id.toString() === userId);
    
    if (userRankIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found in rankings'
      });
    }

    const userRanking = allRankings[userRankIndex];
    const rank = userRankIndex + 1;

    // Get nearby users (3 above and 3 below)
    const startIndex = Math.max(0, userRankIndex - 3);
    const endIndex = Math.min(allRankings.length, userRankIndex + 4);
    const nearbyUsers = allRankings.slice(startIndex, endIndex).map((user, index) => ({
      rank: startIndex + index + 1,
      id: user._id,
      name: user.fullName,
      profilePhoto: user.profilePhoto,
      sessionCount: user.finalSessionCount || 0,
      averageAccuracy: Math.round(user.finalAccuracy || 0),
      isCurrentUser: user._id.toString() === userId
    }));

    res.status(200).json({
      success: true,
      message: 'User ranking fetched successfully',
      data: {
        userRank: rank,
        totalUsers: allRankings.length,
        sessionCount: userRanking.finalSessionCount || 0,
        averageAccuracy: Math.round(userRanking.finalAccuracy || 0),
        totalMinutes: Math.round(userRanking.finalTotalMinutes || 0),
        badge: getBadge(userRanking.finalSessionCount || 0),
        level: getLevel(userRanking.finalTotalMinutes || 0),
        nearbyUsers: nearbyUsers
      }
    });

  } catch (error) {
    console.error('❌ Error fetching user ranking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user ranking',
      error: error.message
    });
  }
};

// Helper function to determine badge based on session count
const getBadge = (sessionCount) => {
  if (sessionCount >= 100) return { name: 'Yoga Master', icon: '🧘‍♂️', color: '#FFD700' };
  if (sessionCount >= 50) return { name: 'Yoga Expert', icon: '🏆', color: '#C0C0C0' };
  if (sessionCount >= 25) return { name: 'Yoga Enthusiast', icon: '🥉', color: '#CD7F32' };
  if (sessionCount >= 10) return { name: 'Yoga Practitioner', icon: '⭐', color: '#4CAF50' };
  if (sessionCount >= 5) return { name: 'Yoga Student', icon: '🌟', color: '#2196F3' };
  return { name: 'Beginner', icon: '🌱', color: '#9E9E9E' };
};

// Helper function to determine level based on total minutes
const getLevel = (totalMinutes) => {
  const level = Math.floor(totalMinutes / 60) + 1; // 1 level per hour
  return Math.min(level, 100); // Cap at level 100
};

// Get leaderboard statistics
const getLeaderboardStats = async (req, res) => {
  try {
    console.log('📊 Fetching leaderboard statistics...');

    const stats = await User.aggregate([
      {
        $match: {
          isEmailVerified: true
        }
      },
      {
        $lookup: {
          from: 'yogasessions',
          localField: '_id',
          foreignField: 'user_id',
          as: 'sessions'
        }
      },
      {
        $addFields: {
          sessionCount: { $size: '$sessions' }
        }
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalSessions: { $sum: '$sessionCount' },
          averageSessionsPerUser: { $avg: '$sessionCount' },
          maxSessions: { $max: '$sessionCount' },
          activeUsers: {
            $sum: {
              $cond: [{ $gt: ['$sessionCount', 0] }, 1, 0]
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalUsers: 0,
      totalSessions: 0,
      averageSessionsPerUser: 0,
      maxSessions: 0,
      activeUsers: 0
    };

    res.status(200).json({
      success: true,
      message: 'Leaderboard statistics fetched successfully',
      data: {
        totalUsers: result.totalUsers,
        totalSessions: result.totalSessions,
        averageSessionsPerUser: Math.round(result.averageSessionsPerUser * 10) / 10,
        maxSessions: result.maxSessions,
        activeUsers: result.activeUsers,
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Error fetching leaderboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getYogaRankings,
  getUserRanking,
  getLeaderboardStats
};