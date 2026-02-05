import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RankingWidget from '../components/dashboard/RankingWidget';
import progressService from '../services/progressService';
import { 
  Activity, 
  Target, 
  Calendar, 
  TrendingUp,
  Play,
  Utensils,
  BarChart3,
  Award,
  Clock,
  Zap,
  Heart,
  User,
  Sparkles,
  ArrowRight,
  Star,
  Trophy,
  Flame,
  CheckCircle,
  Lock,
  Camera,
  Brain,
  Globe,
  Shield,
  Users,
  Sun,
  Moon,
  Droplets,
  Apple,
  ChevronRight,
  AlertCircle,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSessions: 0,
    currentStreak: 0,
    averageAccuracy: 0,
    totalMinutes: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedSession, setHasCompletedSession] = useState(false);
  const [todayGoals, setTodayGoals] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState(null);

  // Icon mapping for dynamic icons
  const iconMap = {
    Sun,
    Moon,
    Droplets,
    Apple
  };

  // Update real-time data
  const updateRealTimeData = () => {
    // Auto-update goals based on time and activity
    progressService.autoUpdateGoals();
    
    // Get updated goals and progress
    const goals = progressService.getFormattedTodayGoals();
    const weekly = progressService.getFormattedWeeklyProgress();
    
    setTodayGoals(goals);
    setWeeklyProgress(weekly);
  };

  // Check if user has completed a yoga session
  const checkSessionCompletion = async () => {
    try {
      // First check database if user is authenticated
      if (user?._id || user?.id) {
        const userId = user._id || user.id;
        const response = await fetch(`http://localhost:5001/api/analytics/user/${userId}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.analytics?.overall_stats?.total_sessions > 0) {
            setHasCompletedSession(true);
            console.log('✅ Dashboard session check: User has completed sessions via database');
            return;
          }
        }
      }
      
      // Fallback to localStorage check
      const completedSession = localStorage.getItem('hasCompletedYogaSession');
      const sessionData = localStorage.getItem('yogaSessionData');
      const multiPoseSession = localStorage.getItem('multiPoseSessionComplete');
      
      if (completedSession === 'true' || sessionData || multiPoseSession === 'true') {
        setHasCompletedSession(true);
      }
    } catch (error) {
      console.error('Error checking session completion:', error);
      // Fallback to localStorage
      const completedSession = localStorage.getItem('hasCompletedYogaSession');
      if (completedSession === 'true') {
        setHasCompletedSession(true);
      }
    }
  };

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // Get user ID for API call
        const userId = user?._id || user?.id;
        
        if (userId) {
          // Try to fetch from backend first
          const response = await fetch(`http://localhost:5001/api/analytics/user/${userId}`, {
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.analytics) {
              const analytics = data.analytics;
              setStats({
                totalSessions: analytics.overall_stats?.total_sessions || 0,
                currentStreak: analytics.overall_stats?.current_streak || 0,
                averageAccuracy: Math.round(analytics.overall_stats?.average_accuracy || 0),
                totalMinutes: Math.round((analytics.overall_stats?.total_practice_time || 0) / 60)
              });
              console.log('✅ Dashboard stats loaded from backend:', analytics.overall_stats);
              setIsLoading(false);
              return;
            }
          }
        }
        
        // Fallback to localStorage data if backend fails or no user ID
        console.log('📱 Falling back to localStorage data for dashboard stats');
        const fallbackStats = {
          totalSessions: 0,
          currentStreak: 0,
          averageAccuracy: 0,
          totalMinutes: 0
        };
        
        // Check for session completion in localStorage
        const hasCompletedSession = localStorage.getItem('hasCompletedYogaSession') === 'true';
        const sessionData = localStorage.getItem('yogaSessionData');
        const progressData = localStorage.getItem('yogaProgressData');
        
        if (hasCompletedSession || sessionData || progressData) {
          // If we have session data, show at least 1 session
          fallbackStats.totalSessions = 1;
          fallbackStats.currentStreak = 1;
          
          // Try to get accuracy from session data
          if (sessionData) {
            try {
              const parsed = JSON.parse(sessionData);
              if (parsed.averageAccuracy) {
                fallbackStats.averageAccuracy = Math.round(parsed.averageAccuracy);
              }
              if (parsed.totalTime) {
                fallbackStats.totalMinutes = Math.round(parsed.totalTime / 60);
              }
            } catch (e) {
              console.log('Error parsing session data:', e);
            }
          }
          
          // Try to get data from progress data
          if (progressData) {
            try {
              const parsed = JSON.parse(progressData);
              if (parsed.latestSession) {
                const session = parsed.latestSession;
                if (session.averageAccuracy) {
                  fallbackStats.averageAccuracy = Math.round(session.averageAccuracy);
                }
                if (session.totalTime) {
                  fallbackStats.totalMinutes = Math.round(session.totalTime / 60);
                }
              }
            } catch (e) {
              console.log('Error parsing progress data:', e);
            }
          }
          
          console.log('✅ Dashboard stats loaded from localStorage:', fallbackStats);
        }
        
        setStats(fallbackStats);
        
      } catch (error) {
        console.error('Error fetching user stats:', error);
        // Set default stats on error
        setStats({
          totalSessions: 0,
          currentStreak: 0,
          averageAccuracy: 0,
          totalMinutes: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSessionCompletion();
    fetchUserStats();
    
    // Initialize real-time data
    updateRealTimeData();
    
    // Set up real-time updates every 30 seconds
    const realTimeInterval = setInterval(updateRealTimeData, 30000);
    
    // Add event listener for storage changes to update stats when new sessions are completed
    const handleStorageChange = (e) => {
      if (e.key === 'hasCompletedYogaSession' || e.key === 'yogaSessionData' || e.key === 'yogaProgressData') {
        console.log('🔄 Session data updated, refreshing dashboard stats');
        fetchUserStats();
        checkSessionCompletion();
        updateRealTimeData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for focus events to refresh when user returns to tab
    const handleFocus = () => {
      console.log('🔄 Dashboard focused, refreshing stats');
      fetchUserStats();
      checkSessionCompletion();
      updateRealTimeData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(realTimeInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  // Add a manual refresh function that can be called
  const refreshStats = async () => {
    setIsLoading(true);
    const userId = user?._id || user?.id;
    
    try {
      if (userId) {
        const response = await fetch(`http://localhost:5001/api/analytics/user/${userId}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.analytics) {
            const analytics = data.analytics;
            setStats({
              totalSessions: analytics.overall_stats?.total_sessions || 0,
              currentStreak: analytics.overall_stats?.current_streak || 0,
              averageAccuracy: Math.round(analytics.overall_stats?.average_accuracy || 0),
              totalMinutes: Math.round((analytics.overall_stats?.total_practice_time || 0) / 60)
            });
            console.log('✅ Dashboard stats refreshed from backend');
            checkSessionCompletion();
            updateRealTimeData();
            setIsLoading(false);
            return;
          }
        }
      }
      
      // Fallback refresh from localStorage
      const hasCompletedSession = localStorage.getItem('hasCompletedYogaSession') === 'true';
      const sessionData = localStorage.getItem('yogaSessionData');
      const progressData = localStorage.getItem('yogaProgressData');
      
      if (hasCompletedSession || sessionData || progressData) {
        const fallbackStats = { totalSessions: 1, currentStreak: 1, averageAccuracy: 90, totalMinutes: 15 };
        
        if (sessionData) {
          try {
            const parsed = JSON.parse(sessionData);
            if (parsed.averageAccuracy) fallbackStats.averageAccuracy = Math.round(parsed.averageAccuracy);
            if (parsed.totalTime) fallbackStats.totalMinutes = Math.round(parsed.totalTime / 60);
          } catch (e) {}
        }
        
        setStats(fallbackStats);
        setHasCompletedSession(true);
        console.log('✅ Dashboard stats refreshed from localStorage');
      }
      
      // Update real-time data
      updateRealTimeData();
      
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'AI Pose Detection',
      description: 'Start your intelligent yoga practice with real-time feedback',
      icon: Camera,
      color: 'from-emerald-500 to-teal-500',
      onClick: () => navigate('/pose-detection'),
      available: true,
      badge: 'Start Now'
    },
    {
      title: 'Schedule Sessions',
      description: 'Plan and organize your yoga practice',
      icon: Calendar,
      color: 'from-indigo-500 to-purple-500',
      onClick: () => navigate('/schedule'),
      available: true,
      badge: 'Plan Now'
    },
    {
      title: 'Personalized Diet',
      description: 'Access your AI-curated nutrition plan',
      icon: Utensils,
      color: 'from-purple-500 to-pink-500',
      onClick: () => navigate('/diet-plan'),
      available: hasCompletedSession,
      locked: !hasCompletedSession,
      badge: hasCompletedSession ? 'Available' : 'Complete Session'
    },
    {
      title: 'Progress Analytics',
      description: 'Deep insights into your wellness journey',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      onClick: () => navigate('/progress'),
      available: hasCompletedSession,
      locked: !hasCompletedSession,
      badge: hasCompletedSession ? 'View Stats' : 'Locked'
    }
  ];

  const achievements = [
    { name: 'First Steps', description: 'Complete your first session', unlocked: hasCompletedSession, icon: Star },
    { name: 'Consistency', description: '3-day streak', unlocked: stats.currentStreak >= 3, icon: Flame },
    { name: 'Good Form', description: '80%+ average accuracy', unlocked: stats.averageAccuracy >= 80, icon: Trophy },
    { name: 'Regular Practice', description: '5 total sessions', unlocked: stats.totalSessions >= 5, icon: Award }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 text-center">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Header */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-full text-sm font-semibold text-emerald-400 mb-6 border border-emerald-500/30 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                WELCOME TO YOUR WELLNESS HUB
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Hello,{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {user?.name || user?.fullName || 'Yogi'}
                </span>
              </h1>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Track your yoga progress, access personalized nutrition recommendations, and maintain your wellness routine with AI-powered guidance.
              </p>
            </div>

            {/* Status Banner */}
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Active User</h3>
                        <p className="text-slate-400">All features available • Yoga Level: Beginner</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={refreshStats}
                        disabled={isLoading}
                        className="flex items-center px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-xl border border-slate-600/50 hover:border-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Refresh stats"
                      >
                        <RefreshCw className={`w-4 h-4 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                      </button>
                      <div className="flex items-center px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
                        <span className="text-emerald-400 text-sm font-medium">AI Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="mb-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  title: "Total Sessions", 
                  value: stats.totalSessions, 
                  icon: Activity, 
                  color: "from-emerald-500 to-teal-500",
                  trend: "+12%",
                  description: "Completed practices"
                },
                { 
                  title: "Current Streak", 
                  value: `${stats.currentStreak}`, 
                  suffix: "days",
                  icon: Flame, 
                  color: "from-orange-500 to-red-500",
                  trend: "+5%",
                  description: "Consecutive days"
                },
                { 
                  title: "Avg Accuracy", 
                  value: `${stats.averageAccuracy}`, 
                  suffix: "%",
                  icon: Target, 
                  color: "from-purple-500 to-pink-500",
                  trend: "+8%",
                  description: "Pose precision"
                },
                { 
                  title: "Total Minutes", 
                  value: stats.totalMinutes, 
                  icon: Clock, 
                  color: "from-blue-500 to-cyan-500",
                  trend: "+15%",
                  description: "Practice time"
                }
              ].map((stat, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl group-hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105">
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-emerald-400 font-semibold">{stat.trend}</div>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-3xl font-bold text-white mb-1">
                        {stat.value}
                        {stat.suffix && <span className="text-xl text-slate-400 ml-1">{stat.suffix}</span>}
                      </div>
                      <div className="text-sm font-semibold text-slate-300">{stat.title}</div>
                      <div className="text-xs text-slate-500">{stat.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Quick Actions - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Quick Actions */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                      <p className="text-slate-400">Jump into your wellness journey</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon
                      return (
                        <button
                          key={index}
                          onClick={action.available ? action.onClick : undefined}
                          disabled={!action.available}
                          className={`group relative p-6 rounded-2xl border transition-all duration-300 text-left ${
                            action.available 
                              ? 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500 hover:transform hover:scale-105 cursor-pointer' 
                              : 'bg-slate-800/50 border-slate-700/30 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-700/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          {/* Lock indicator */}
                          {action.locked && (
                            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                              <Lock className="w-3 h-3 text-amber-400" />
                            </div>
                          )}
                          
                          <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          
                          <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                          <p className="text-slate-400 text-sm mb-4 leading-relaxed">{action.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                              action.available 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-slate-600/20 text-slate-400 border border-slate-600/30'
                            }`}>
                              {action.badge}
                            </span>
                            {action.available && (
                              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Today's Goals */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Today's Goals</h2>
                        <p className="text-slate-400">Your daily wellness targets</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">
                        {todayGoals.filter(g => g.completed).length}/{todayGoals.length}
                      </div>
                      <div className="text-xs text-slate-400">completed</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {todayGoals.map((goal, index) => {
                      const Icon = iconMap[goal.icon] || Target;
                      return (
                        <div 
                          key={index}
                          className={`p-4 rounded-xl border transition-all ${
                            goal.completed 
                              ? 'bg-emerald-500/10 border-emerald-500/30' 
                              : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${goal.completed ? 'bg-emerald-500/20' : 'bg-slate-600/30'}`}>
                                <Icon className={`w-5 h-5 ${goal.completed ? 'text-emerald-400' : 'text-slate-400'}`} />
                              </div>
                              <div>
                                <p className={`font-semibold ${goal.completed ? 'text-white' : 'text-slate-300'}`}>
                                  {goal.title}
                                </p>
                                <p className="text-sm text-slate-400">
                                  {goal.time || (goal.current && goal.target ? `${goal.current}/${goal.target}ml` : '')}
                                </p>
                              </div>
                            </div>
                            {goal.completed && (
                              <CheckCircle className="w-5 h-5 text-emerald-400" fill="currentColor" />
                            )}
                          </div>
                          {goal.progress !== undefined && (
                            <div className="mt-3">
                              <div className="w-full bg-slate-700/50 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(goal.progress, 100)}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">{Math.min(goal.progress, 100)}% complete</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Weekly Progress</h2>
                        <p className="text-slate-400">Your consistency is improving</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">
                        {weeklyProgress?.improvement || '+23%'}
                      </div>
                      <div className="text-xs text-slate-400">vs last week</div>
                    </div>
                  </div>

                  {/* Real-time Progress Visualization */}
                  <div className="space-y-4">
                    {weeklyProgress?.days?.map((dayData, index) => (
                      <div key={dayData.day} className="flex items-center">
                        <div className="w-12 text-sm text-slate-400 font-medium">{dayData.day}</div>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-1000" 
                              style={{width: `${dayData.progress}%`}}
                            ></div>
                          </div>
                        </div>
                        <div className="w-16 text-right">
                          <span className="text-sm text-slate-300 font-medium">{dayData.minutes} min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              
              {/* Ranking Widget */}
              <RankingWidget />
              
              {/* Achievements */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Achievements</h3>
                      <p className="text-slate-400 text-sm">Your milestones</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {achievements.map((achievement, index) => {
                      const Icon = achievement.icon
                      return (
                        <div key={index} className={`flex items-center p-3 rounded-xl border transition-all ${
                          achievement.unlocked 
                            ? 'bg-emerald-500/10 border-emerald-500/30' 
                            : 'bg-slate-700/20 border-slate-600/30'
                        }`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                            achievement.unlocked 
                              ? 'bg-emerald-500/20' 
                              : 'bg-slate-600/20'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              achievement.unlocked ? 'text-emerald-400' : 'text-slate-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold text-sm ${
                              achievement.unlocked ? 'text-white' : 'text-slate-400'
                            }`}>
                              {achievement.name}
                            </div>
                            <div className="text-xs text-slate-500">{achievement.description}</div>
                          </div>
                          {achievement.unlocked && (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">AI Insights</h3>
                      <p className="text-slate-400 text-sm">Personalized tips</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            Your pose accuracy has improved by 15% this week. Focus on holding poses longer for better results.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                          <Heart className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            Consider adding meditation sessions to complement your yoga practice.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">This Week</span>
                      <span className="text-white font-semibold">5 sessions</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Best Streak</span>
                      <span className="text-white font-semibold">{Math.max(stats.currentStreak, 7)} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Favorite Pose</span>
                      <span className="text-white font-semibold">Warrior II</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Next Goal</span>
                      <span className="text-emerald-400 font-semibold">10 sessions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Features */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                      <Star className="w-5 h-5 text-white" fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Premium Features</h3>
                      <p className="text-slate-400 text-sm">Unlock your potential</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      'Advanced AI Analysis',
                      'Personalized Diet Plans',
                      'Progress Analytics',
                      'Priority Support'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center p-3 bg-slate-700/20 rounded-lg border border-slate-600/30">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mr-3" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate('/premium')}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl font-semibold text-white transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center"
                  >
                    <Star className="w-5 h-5 mr-2" fill="currentColor" />
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <section className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl text-center">
                
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Transform Your{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                    Wellness Journey?
                  </span>
                </h3>
                
                <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                  Join thousands of users who have already discovered the power of AI-guided wellness. 
                  Your personalized journey to better health continues here.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/pose-detection')}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl font-semibold text-white transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center group"
                  >
                    <Camera className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Start Session Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => {
                      if (user) {
                        navigate('/community');
                      } else {
                        navigate('/login');
                      }
                    }}
                    className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 backdrop-blur-xl rounded-xl font-semibold text-white transition-all border border-slate-600/50 hover:border-slate-600 flex items-center justify-center"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Join Community
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;