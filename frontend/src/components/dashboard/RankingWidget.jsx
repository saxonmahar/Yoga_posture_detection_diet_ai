import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import rankingService from '../../services/rankingService';

const RankingWidget = () => {
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRanking();
  }, []);

  const fetchUserRanking = async () => {
    try {
      const response = await rankingService.getUserRanking();
      if (response.success) {
        setUserRank(response.data);
      }
    } catch (error) {
      console.log('Could not fetch user ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!userRank) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Your Ranking</h3>
        </div>
        <div className="text-center py-4">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 mb-4">Complete some yoga sessions to get ranked!</p>
          <button
            onClick={handleViewLeaderboard}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Trophy className="w-6 h-6 text-yellow-300 mr-2" />
          <h3 className="text-lg font-semibold">Your Ranking</h3>
        </div>
        <button
          onClick={handleViewLeaderboard}
          className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm opacity-90">Rank</span>
          </div>
          <p className="text-2xl font-bold">#{userRank.userRank}</p>
          <p className="text-xs opacity-75">of {userRank.totalUsers}</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Star className="w-4 h-4 mr-1" />
            <span className="text-sm opacity-90">Sessions</span>
          </div>
          <p className="text-2xl font-bold">{userRank.sessionCount}</p>
          <p className="text-xs opacity-75">{userRank.averageAccuracy}% avg</p>
        </div>
      </div>

      {userRank.badge && (
        <div className="text-center">
          <span 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: userRank.badge.color + '30', 
              color: 'white',
              border: `1px solid ${userRank.badge.color}50`
            }}
          >
            {userRank.badge.icon} {userRank.badge.name}
          </span>
        </div>
      )}

      {userRank.nearbyUsers && userRank.nearbyUsers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm opacity-90 mb-2">Nearby Rankings:</p>
          <div className="space-y-1">
            {userRank.nearbyUsers.slice(0, 3).map((nearbyUser) => (
              <div 
                key={nearbyUser.id} 
                className={`flex items-center justify-between text-sm ${
                  nearbyUser.isCurrentUser ? 'bg-white/20 rounded px-2 py-1' : 'opacity-75'
                }`}
              >
                <span>#{nearbyUser.rank} {nearbyUser.name}</span>
                <span>{nearbyUser.sessionCount} sessions</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingWidget;