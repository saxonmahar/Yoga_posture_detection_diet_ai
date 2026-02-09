// Admin Dashboard - System Overview and Management
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Activity, TrendingUp, Server, Database, 
  DollarSign, Calendar, AlertTriangle, CheckCircle,
  BarChart3, Monitor, Settings, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Admin check
  useEffect(() => {
    if (!user) {
      console.log('⚠️ No user, redirecting to admin login...');
      navigate('/admin');
      return;
    }
    
    if (user.role !== 'admin') {
      console.log('⚠️ Not admin, redirecting to admin login...');
      navigate('/admin');
    }
  }, [user, navigate]);

  // Dashboard stats state
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    totalRevenue: 0,
    premiumUsers: 0,
    todaySessions: 0
  });

  const [serverStatus, setServerStatus] = useState({
    backend: 'checking',
    ml: 'checking',
    diet: 'checking',
    database: 'checking'
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch admin data
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
      checkServerStatus();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats from backend
      const response = await fetch('http://localhost:5001/api/admin/stats', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {
          totalUsers: 0,
          activeUsers: 0,
          totalSessions: 0,
          totalRevenue: 0,
          premiumUsers: 0,
          todaySessions: 0
        });
        setRecentUsers(data.recentUsers || []);
        setRecentSessions(data.recentSessions || []);
      } else {
        // Use mock data if API not available
        setStats({
          totalUsers: 156,
          activeUsers: 42,
          totalSessions: 1247,
          totalRevenue: 12450,
          premiumUsers: 23,
          todaySessions: 18
        });
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      // Use mock data on error
      setStats({
        totalUsers: 156,
        activeUsers: 42,
        totalSessions: 1247,
        totalRevenue: 12450,
        premiumUsers: 23,
        todaySessions: 18
      });
    } finally {
      setLoading(false);
    }
  };

  const checkServerStatus = async () => {
    const services = [
      { name: 'backend', url: 'http://localhost:5001/health' },
      { name: 'ml', url: 'http://localhost:5000/health' },
      { name: 'diet', url: 'http://localhost:5002/health' }
    ];

    const newStatus = { ...serverStatus };

    for (const service of services) {
      try {
        const response = await fetch(service.url, { 
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        });
        newStatus[service.name] = response.ok ? 'online' : 'offline';
      } catch (error) {
        newStatus[service.name] = 'offline';
      }
    }

    // Check database (through backend)
    try {
      const response = await fetch('http://localhost:5001/api/admin/db-status', {
        credentials: 'include',
        signal: AbortSignal.timeout(3000)
      });
      newStatus.database = response.ok ? 'online' : 'offline';
    } catch (error) {
      newStatus.database = 'offline';
    }

    setServerStatus(newStatus);
  };

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-sm font-semibold ${
            change > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-slate-400 text-sm">{title}</p>
    </div>
  );

  const ServerStatusCard = ({ name, status }) => (
    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
      <div className="flex items-center gap-3">
        <Server className="w-5 h-5 text-slate-400" />
        <span className="text-white font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        {status === 'checking' && (
          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
        )}
        {status === 'online' && (
          <>
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">Online</span>
          </>
        )}
        {status === 'offline' && (
          <>
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">Offline</span>
          </>
        )}
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Redirecting to admin login...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🛡️ Admin Dashboard
              </h1>
              <p className="text-slate-400">
                System overview and management
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  fetchAdminData();
                  checkServerStatus();
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading admin data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={Users}
                title="Total Users"
                value={stats.totalUsers}
                change={12}
                color="from-blue-500 to-cyan-500"
              />
              <StatCard
                icon={Activity}
                title="Active Today"
                value={stats.activeUsers}
                change={8}
                color="from-green-500 to-emerald-500"
              />
              <StatCard
                icon={TrendingUp}
                title="Total Sessions"
                value={stats.totalSessions}
                change={15}
                color="from-purple-500 to-pink-500"
              />
              <StatCard
                icon={DollarSign}
                title="Revenue"
                value={`Rs ${stats.totalRevenue}`}
                change={23}
                color="from-yellow-500 to-orange-500"
              />
              <StatCard
                icon={Users}
                title="Premium Users"
                value={stats.premiumUsers}
                change={18}
                color="from-indigo-500 to-purple-500"
              />
              <StatCard
                icon={Calendar}
                title="Today's Sessions"
                value={stats.todaySessions}
                change={-5}
                color="from-pink-500 to-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Server Status */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Monitor className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Server Status</h2>
                </div>
                <div className="space-y-3">
                  <ServerStatusCard name="Backend API" status={serverStatus.backend} />
                  <ServerStatusCard name="ML Service" status={serverStatus.ml} />
                  <ServerStatusCard name="Diet Service" status={serverStatus.diet} />
                  <ServerStatusCard name="Database" status={serverStatus.database} />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/admin/users')}
                    className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Manage Users</span>
                    </div>
                    <span className="text-slate-400 group-hover:text-white transition-colors">→</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/admin/analytics')}
                    className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-green-400" />
                      <span className="text-white font-medium">View Analytics</span>
                    </div>
                    <span className="text-slate-400 group-hover:text-white transition-colors">→</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/admin/settings')}
                    className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-medium">System Settings</span>
                    </div>
                    <span className="text-slate-400 group-hover:text-white transition-colors">→</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/admin/logs')}
                    className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-medium">View Logs</span>
                    </div>
                    <span className="text-slate-400 group-hover:text-white transition-colors">→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              </div>
              <div className="space-y-3">
                {recentSessions.length > 0 ? (
                  recentSessions.slice(0, 5).map((session, index) => (
                    <div key={index} className="p-4 bg-slate-700/30 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{session.userName}</p>
                        <p className="text-sm text-slate-400">{session.poseName} - {session.duration}min</p>
                      </div>
                      <span className="text-xs text-slate-500">{session.timeAgo}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;