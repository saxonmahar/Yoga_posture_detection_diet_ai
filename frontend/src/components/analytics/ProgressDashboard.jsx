import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award, 
  Clock, 
  Zap, 
  Star,
  Trophy,
  Flame,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const ProgressDashboard = ({ userId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30'); // days

  useEffect(() => {
    if (userId) {
      fetchUserAnalytics();
    }
  }, [userId, selectedTimeframe]);

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/analytics/user/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      setAnalytics(data.analytics);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMasteryColor = (level) => {
    switch (level) {
      case 'Master': return 'text-yellow-400 bg-yellow-400/20';
      case 'Advanced': return 'text-purple-400 bg-purple-400/20';
      case 'Intermediate': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-green-400 bg-green-400/20';
    }
  };

  const getImprovementIcon = (trend) => {
    switch (trend) {
      case 'Improving': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'Declining': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      case 'Stable': return <Activity className="w-4 h-4 text-blue-400" />;
      default: return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="ml-3 text-slate-400">Loading your progress...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6">
        <div className="text-center py-8">
          <div className="text-red-400 mb-4">⚠️ {error}</div>
          <button 
            onClick={fetchUserAnalytics}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
        <div className="text-center py-8">
          <div className="text-slate-400 mb-4">No progress data available yet</div>
          <p className="text-sm text-slate-500">Complete some yoga sessions to see your analytics!</p>
        </div>
      </div>
    );
  }

  const { overall_stats, pose_progress, achievements, recent_sessions, insights } = analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">Progress Analytics</h2>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMasteryColor(overall_stats.overall_mastery_level)}`}>
            {overall_stats.overall_mastery_level} Level
          </div>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">Total Sessions</span>
            </div>
            <div className="text-2xl font-bold text-white">{overall_stats.total_sessions}</div>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-slate-400">Current Streak</span>
            </div>
            <div className="text-2xl font-bold text-white">{overall_stats.current_streak} days</div>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-400">Practice Time</span>
            </div>
            <div className="text-2xl font-bold text-white">{Math.round(overall_stats.total_practice_time)}m</div>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-slate-400">Favorite Pose</span>
            </div>
            <div className="text-sm font-bold text-white truncate">
              {overall_stats.favorite_pose || 'None yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Pose Progress */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Pose Mastery Progress</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pose_progress.map((pose) => (
            <div key={pose.pose_id} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white text-sm">{pose.pose_name}</h4>
                {getImprovementIcon(pose.improvement_trend)}
              </div>

              <div className="space-y-3">
                {/* Mastery Level */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Level</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMasteryColor(pose.mastery_level)}`}>
                    {pose.mastery_level}
                  </span>
                </div>

                {/* Best Score */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Best Score</span>
                  <span className="text-sm font-bold text-white">{Math.round(pose.best_score)}%</span>
                </div>

                {/* Average Score */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Average</span>
                  <span className="text-sm font-medium text-slate-300">{Math.round(pose.average_score)}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(pose.average_score, 100)}%` }}
                  ></div>
                </div>

                {/* Attempts */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Attempts: {pose.total_attempts}</span>
                  <span className="text-slate-400">Success: {pose.successful_completions}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Achievements</h3>
            <div className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs font-medium">
              {achievements.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-slate-800/40 rounded-xl p-4 border border-yellow-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-medium text-white text-sm">{achievement.name}</h4>
                    <p className="text-xs text-slate-400">{achievement.description}</p>
                  </div>
                </div>
                <div className="text-xs text-yellow-400">
                  Unlocked: {new Date(achievement.unlocked_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insights && insights.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">AI Insights</h3>
          </div>

          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-xl border ${
                insight.type === 'achievement' ? 'bg-green-500/10 border-green-500/30' :
                insight.type === 'improvement' ? 'bg-blue-500/10 border-blue-500/30' :
                insight.type === 'suggestion' ? 'bg-yellow-500/10 border-yellow-500/30' :
                'bg-slate-800/40 border-slate-700/30'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-lg">{insight.icon}</span>
                  <div>
                    <p className="text-sm text-white">{insight.message}</p>
                    <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                      insight.type === 'achievement' ? 'bg-green-500/20 text-green-400' :
                      insight.type === 'improvement' ? 'bg-blue-500/20 text-blue-400' :
                      insight.type === 'suggestion' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-700/50 text-slate-400'
                    }`}>
                      {insight.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      {recent_sessions && recent_sessions.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Recent Sessions</h3>
          </div>

          <div className="space-y-3">
            {recent_sessions.slice(0, 5).map((session, index) => (
              <div key={index} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-white">
                    {new Date(session.session_date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-slate-400">
                    {session.total_duration}m • {session.poses_practiced.length} poses
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-xs text-slate-400">Average Accuracy:</div>
                  <div className="text-sm font-medium text-emerald-400">
                    {Math.round(session.overall_performance.average_accuracy)}%
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {session.poses_practiced.map((pose, poseIndex) => (
                    <div key={poseIndex} className={`px-2 py-1 rounded-full text-xs ${
                      pose.completed_successfully 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-slate-700/50 text-slate-400'
                    }`}>
                      {pose.pose_name} ({Math.round(pose.accuracy_score)}%)
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;