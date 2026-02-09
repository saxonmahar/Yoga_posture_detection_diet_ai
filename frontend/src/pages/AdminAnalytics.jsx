import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, ArrowLeft, TrendingUp, Users, Activity, 
  Calendar, DollarSign, Target
} from 'lucide-react';

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days'); // 7days, 30days, 90days

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/admin/analytics', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaxValue = (data, key) => {
    return Math.max(...data.map(item => item[key]), 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-slate-400 text-sm">View system analytics and trends</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === '7days'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === '30days'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90days')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === '90days'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              90 Days
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {loading ? (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* User Growth Chart */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <Users className="text-blue-400" size={24} />
                <h2 className="text-xl font-bold text-white">User Growth (Last 7 Days)</h2>
              </div>

              <div className="space-y-3">
                {analytics?.userGrowth?.map((day, index) => {
                  const maxUsers = getMaxValue(analytics.userGrowth, 'users');
                  const percentage = (day.users / maxUsers) * 100;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="text-white font-semibold">{day.users} users</span>
                      </div>
                      <div className="w-full bg-slate-700/30 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Session Stats Chart */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-green-400" size={24} />
                <h2 className="text-xl font-bold text-white">Session Activity (Last 7 Days)</h2>
              </div>

              <div className="space-y-3">
                {analytics?.sessionStats?.map((day, index) => {
                  const maxSessions = getMaxValue(analytics.sessionStats, 'sessions');
                  const percentage = (day.sessions / maxSessions) * 100;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="text-white font-semibold">{day.sessions} sessions</span>
                      </div>
                      <div className="w-full bg-slate-700/30 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Total Growth</p>
                    <p className="text-2xl font-bold text-white">
                      {analytics?.userGrowth?.reduce((sum, day) => sum + day.users, 0) || 0}
                    </p>
                  </div>
                </div>
                <p className="text-green-400 text-sm">+12% from last week</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Activity className="text-green-400" size={24} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Total Sessions</p>
                    <p className="text-2xl font-bold text-white">
                      {analytics?.sessionStats?.reduce((sum, day) => sum + day.sessions, 0) || 0}
                    </p>
                  </div>
                </div>
                <p className="text-green-400 text-sm">+18% from last week</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Target className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Avg per Day</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.round((analytics?.sessionStats?.reduce((sum, day) => sum + day.sessions, 0) || 0) / 7)}
                    </p>
                  </div>
                </div>
                <p className="text-green-400 text-sm">+5% from last week</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
