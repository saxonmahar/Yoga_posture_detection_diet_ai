import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Activity, TrendingUp, DollarSign, Calendar, 
  Server, Database, RefreshCw, LogOut, BarChart3, 
  Settings, FileText, Shield, CheckCircle, XCircle,
  Clock, UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [serverStatus, setServerStatus] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loginLogs, setLoginLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const [statsRes, serverRes, logsRes] = await Promise.all([
        fetch('http://localhost:5001/api/admin/stats', {
          credentials: 'include'
        }),
        fetch('http://localhost:5001/api/admin/server-status', {
          credentials: 'include'
        }),
        fetch('http://localhost:5001/api/admin/login-logs?limit=10', {
          credentials: 'include'
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setRecentActivity(statsData.recentActivity || []);
      }

      if (serverRes.ok) {
        const serverData = await serverRes.json();
        const allServers = [
          ...serverData.servers,
          serverData.database
        ];
        setServerStatus(allServers);
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        console.log('📊 Login logs received:', logsData);
        setLoginLogs(logsData.logs || []);
      } else {
        console.error('❌ Failed to fetch login logs:', logsRes.status);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'users':
        navigate('/admin/users');
        break;
      case 'analytics':
        navigate('/admin/analytics');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      case 'logs':
        navigate('/admin/logs');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">System overview and management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="text-blue-400" size={24} />
              </div>
              <span className="text-green-400 text-sm font-semibold">+12%</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats?.totalUsers || 0}</h3>
            <p className="text-slate-400 text-sm">Total Users</p>
          </div>

          {/* Active Today */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Activity className="text-green-400" size={24} />
              </div>
              <span className="text-green-400 text-sm font-semibold">+8%</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats?.activeToday || 0}</h3>
            <p className="text-slate-400 text-sm">Active Today</p>
          </div>

          {/* Total Sessions */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-purple-400" size={24} />
              </div>
              <span className="text-green-400 text-sm font-semibold">+15%</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats?.totalSessions || 0}</h3>
            <p className="text-slate-400 text-sm">Total Sessions</p>
          </div>

          {/* Revenue */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="text-orange-400" size={24} />
              </div>
              <span className="text-green-400 text-sm font-semibold">+23%</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">Rs {stats?.totalRevenue || 0}</h3>
            <p className="text-slate-400 text-sm">Revenue</p>
          </div>

          {/* Premium Users */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <UserPlus className="text-yellow-400" size={24} />
              </div>
              <span className="text-green-400 text-sm font-semibold">+18%</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats?.premiumUsers || 0}</h3>
            <p className="text-slate-400 text-sm">Premium Users</p>
          </div>

          {/* Today's Sessions */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="text-pink-400" size={24} />
              </div>
              <span className="text-red-400 text-sm font-semibold">-5%</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats?.todaySessions || 0}</h3>
            <p className="text-slate-400 text-sm">Today's Sessions</p>
          </div>

          {/* Scheduled Sessions */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Clock className="text-cyan-400" size={24} />
              </div>
              <span className="text-green-400 text-sm font-semibold">+10%</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats?.scheduledSessions || 0}</h3>
            <p className="text-slate-400 text-sm">Scheduled</p>
          </div>
        </div>

        {/* Server Status & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Server Status */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <Server className="text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-white">Server Status</h2>
            </div>
            
            <div className="space-y-3">
              {serverStatus.map((server, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {server.name === 'Database' ? (
                      <Database size={18} className="text-slate-400" />
                    ) : (
                      <Server size={18} className="text-slate-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">{server.name}</p>
                      {server.port && (
                        <p className="text-slate-500 text-xs">Port: {server.port}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {server.status === 'online' ? (
                      <>
                        <CheckCircle size={18} className="text-green-400" />
                        <span className="text-green-400 text-sm font-semibold">Online</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={18} className="text-red-400" />
                        <span className="text-red-400 text-sm font-semibold">Offline</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="text-purple-400" size={24} />
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickAction('users')}
                className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors group"
              >
                <Users size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">Manage Users</span>
              </button>

              <button
                onClick={() => handleQuickAction('analytics')}
                className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors group"
              >
                <BarChart3 size={20} className="text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">View Analytics</span>
              </button>

              <button
                onClick={() => handleQuickAction('settings')}
                className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors group"
              >
                <Settings size={20} className="text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">System Settings</span>
              </button>

              <button
                onClick={() => handleQuickAction('logs')}
                className="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors group"
              >
                <FileText size={20} className="text-yellow-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium">View Logs</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-green-400" size={24} />
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Activity size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{activity.userName}</p>
                      <p className="text-slate-400 text-sm">{activity.action} • {activity.poses} poses • {activity.duration}s</p>
                    </div>
                  </div>
                  <span className="text-slate-500 text-sm">{activity.timeAgo}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">No recent activity</p>
            </div>
          )}
        </div>

        {/* Recent Login Logs */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-white">Recent User Logins</h2>
              <span className="text-slate-500 text-sm">({loginLogs.length})</span>
            </div>
            <button
              onClick={() => navigate('/admin/users')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              View All Users →
            </button>
          </div>
          
          {loginLogs.length > 0 ? (
            <div className="space-y-3">
              {loginLogs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {log.userName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{log.userName}</p>
                      <p className="text-slate-400 text-sm">
                        {log.email} • {log.browser} on {log.os}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-300 text-sm">{log.timeAgo}</p>
                    <p className="text-slate-500 text-xs">{log.ipAddress}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">No login logs yet</p>
              <p className="text-slate-600 text-sm mt-2">Login logs will appear here when users log in</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
