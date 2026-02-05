import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Users, Clock, Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import photoService from '../../services/photoService';
import rankingService from '../../services/rankingService';

const YogaLeaderboard = () => {
  const [rankings, setRankings] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch leaderboard rankings
      const rankingsData = await rankingService.getLeaderboard();
      if (rankingsData.success) {
        setRankings(rankingsData.data.rankings);
      }

      // Fetch leaderboard stats
      const statsData = await rankingService.getLeaderboardStats();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch user's personal ranking if logged in
      if (user) {
        try {
          const userRankData = await rankingService.getUserRanking();
          if (userRankData.success) {
            setUserRank(userRankData.data);
          }
        } catch (userError) {
          console.log('Could not fetch user ranking:', userError);
        }
      }

    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getBadgeColor = (badge) => {
    return badge?.color || '#9E9E9E';
  };

  const renderProfilePhoto = (user) => {
    const photoUrl = user.profilePhoto ? photoService.getPhotoUrl(user.profilePhoto, user.id) : null;
    
    if (photoUrl) {
      return (
        <img
          src={photoUrl}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    
    return (
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
        {user.name?.charAt(0)?.toUpperCase() || 'U'}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏆 Yoga Leaderboard
          </h1>
          <p className="text-gray-600">
            Compete with fellow yogis and track your progress
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalSessions}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.activeUsers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Avg Sessions</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.averageSessionsPerUser}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User's Personal Ranking */}
        {user && userRank && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-8 text-white">
            <h2 className="text-xl font-bold mb-4">Your Ranking</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-blue-100">Current Rank</p>
                <p className="text-3xl font-bold">#{userRank.userRank}</p>
                <p className="text-sm text-blue-100">of {userRank.totalUsers}</p>
              </div>
              <div className="text-center">
                <p className="text-blue-100">Sessions</p>
                <p className="text-2xl font-bold">{userRank.sessionCount}</p>
              </div>
              <div className="text-center">
                <p className="text-blue-100">Accuracy</p>
                <p className="text-2xl font-bold">{userRank.averageAccuracy}%</p>
              </div>
              <div className="text-center">
                <p className="text-blue-100">Level</p>
                <p className="text-2xl font-bold">{userRank.level}</p>
              </div>
            </div>
            {userRank.badge && (
              <div className="mt-4 text-center">
                <span 
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                  style={{ backgroundColor: userRank.badge.color + '20', color: userRank.badge.color }}
                >
                  {userRank.badge.icon} {userRank.badge.name}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Top Yoga Practitioners</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {rankings.map((user, index) => (
              <div 
                key={user.id} 
                className={`p-6 flex items-center space-x-4 hover:bg-gray-50 transition-colors ${
                  user.id === user?.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                {/* Rank */}
                <div className="flex-shrink-0">
                  {getRankIcon(user.rank)}
                </div>

                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  {renderProfilePhoto(user)}
                  {/* Fallback hidden by default */}
                  <div 
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md" 
                    style={{ display: 'none' }}
                  >
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-grow">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {user.fitnessLevel}
                    </span>
                    {user.badge && (
                      <span 
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ 
                          backgroundColor: getBadgeColor(user.badge) + '20', 
                          color: getBadgeColor(user.badge) 
                        }}
                      >
                        {user.badge.icon} {user.badge.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Level {user.level}</p>
                </div>

                {/* Stats */}
                <div className="flex space-x-8 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-800">{user.sessionCount}</p>
                    <p className="text-xs text-gray-500">Sessions</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{user.averageAccuracy}%</p>
                    <p className="text-xs text-gray-500">Accuracy</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{user.totalMinutes}</p>
                    <p className="text-xs text-gray-500">Minutes</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{user.currentStreak}</p>
                    <p className="text-xs text-gray-500">Streak</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {rankings.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No rankings yet</h3>
            <p className="text-gray-500">Complete some yoga sessions to appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YogaLeaderboard;